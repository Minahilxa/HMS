import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'healsync_secret_123';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/healsync_his';

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  name: String,
  email: String,
  role: String,
  avatar: String
});
const User = mongoose.model('User', UserSchema);

const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  status: { type: String, default: 'OPD' },
  admissionDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  diagnosis: String,
  phone: String,
  email: String,
  medicalHistory: [{ condition: String, treatment: String, notes: String, date: String }],
  prescriptions: [{ doctorName: String, medications: [{ name: String, dosage: String, frequency: String, duration: String }], date: String }]
});
const Patient = mongoose.model('Patient', PatientSchema);

const DoctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  department: String,
  status: { type: String, default: 'On Duty' },
  room: String,
  experience: String,
  displayOnWeb: { type: Boolean, default: true },
  publicBio: String
});
const Doctor = mongoose.model('Doctor', DoctorSchema);

const AppointmentSchema = new mongoose.Schema({
  patientName: String,
  doctorId: String,
  doctorName: String,
  time: String,
  date: String,
  type: { type: String, default: 'General Checkup' },
  source: { type: String, default: 'Walk-in' },
  status: { type: String, default: 'Scheduled' }
});
const Appointment = mongoose.model('Appointment', AppointmentSchema);

const InvoiceSchema = new mongoose.Schema({
  patientName: String,
  patientId: String,
  date: String,
  category: String,
  amount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'Unpaid' },
  paymentMethod: String,
  insuranceProvider: String,
  insuranceStatus: String
});
const Invoice = mongoose.model('Invoice', InvoiceSchema);

// --- MONGODB CONNECTION ---
let isDbConnected = false;
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2000, 
})
  .then(async () => {
    isDbConnected = true;
    console.log('✅ Connected to MongoDB');
    await seed();
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection could not be established. Falling back to demo mode.');
  });

const seed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const usersToSeed = [
        { username: 'admin', password: 'password123', name: 'System Admin', role: 'Admin', email: 'admin@healsync.com' },
      ];
      await User.insertMany(usersToSeed);
      console.log('👤 Seeded users');
    }
  } catch (err) {
    console.warn('Seed error:', err.message);
  }
};

// --- AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized access' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) { 
    res.status(403).json({ message: 'Invalid or expired session' }); 
  }
};

// --- ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`[LOGIN] Attempt for: ${username}`);
  
  if (username === 'admin' && password === 'password123') {
    const user = { id: 'demo-id', username: 'admin', name: 'System Admin', role: 'Admin', email: 'admin@healsync.com' };
    const token = jwt.sign(user, SECRET, { expiresIn: '8h' });
    console.log('[LOGIN] Success (Bypass)');
    return res.json({ user, token });
  }

  try {
    if (!isDbConnected) {
      return res.status(503).json({ message: 'Connecting to medical database... Please try again in 5 seconds.' });
    }

    const user = await User.findOne({ username, password }).lean();
    if (user) {
      const token = jwt.sign({ 
        id: user._id, 
        role: user.role, 
        name: user.name, 
        email: user.email 
      }, SECRET, { expiresIn: '8h' });
      
      const userRes = { ...user, id: user._id };
      delete userRes._id; delete userRes.password; delete userRes.__v;
      console.log('[LOGIN] Success (DB)');
      res.json({ user: userRes, token });
    } else {
      console.log('[LOGIN] Failed: Invalid credentials');
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/init-dashboard', authenticate, async (req, res) => {
  try {
    const role = req.user.role;
    let stats = { dailyAppointments: 12, opdPatients: 45, ipdPatients: 12, emergencyCases: 0, totalRevenue: 12450, doctorsOnDuty: 14 };
    
    res.json({
      stats,
      revenue: [
        { date: '2024-05-18', amount: 5100, category: 'Pharmacy' }
      ],
      doctors: [],
      emergencyCases: []
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch dashboard' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Clinical Server Active on Port ${PORT}`);
});