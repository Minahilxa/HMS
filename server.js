
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
// Using localhost with a timeout to prevent hanging on startup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healsync_his';

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

const HospitalSettingsSchema = new mongoose.Schema({
  name: { type: String, default: 'HealSync General Hospital' },
  tagline: String,
  address: String,
  email: String,
  phone: String,
  website: String,
  opdTimings: String
});
const HospitalSettings = mongoose.model('HospitalSettings', HospitalSettingsSchema);

// --- MONGODB CONNECTION & SEEDING ---
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Faster failure if DB is down
})
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await seed();
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

mongoose.plugin((schema) => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => { 
      ret.id = ret._id;
      delete ret._id; 
    }
  });
});

const seed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const usersToSeed = [
        { username: 'superadmin', password: 'password123', name: 'Super Administrator', role: 'Super Admin', email: 'super@healsync.com' },
        { username: 'admin', password: 'password123', name: 'System Admin', role: 'Admin', email: 'admin@healsync.com' },
        { username: 'doctor', password: 'password123', name: 'Dr. Sarah Wilson', role: 'Doctor', email: 'sarah@healsync.com' },
        { username: 'nurse', password: 'password123', name: 'Nurse Joy', role: 'Nurse', email: 'joy@healsync.com' },
        { username: 'labtech', password: 'password123', name: 'Dexter Morgan', role: 'Lab Technician', email: 'dexter@healsync.com' },
        { username: 'receptionist', password: 'password123', name: 'Pam Beesly', role: 'Receptionist', email: 'pam@healsync.com' },
        { username: 'accountant', password: 'password123', name: 'Kevin Malone', role: 'Accountant', email: 'kevin@healsync.com' },
        { username: 'patient', password: 'password123', name: 'John Doe', role: 'Patient', email: 'john@gmail.com' },
      ];
      await User.insertMany(usersToSeed);
      console.log('👤 Seeded Default Users');
    }

    const settingsCount = await HospitalSettings.countDocuments();
    if (settingsCount === 0) {
      await HospitalSettings.create({
        name: 'HealSync General Hospital',
        tagline: 'Excellence in Every Heartbeat',
        address: '77 Medical Plaza, Health District',
        email: 'contact@healsync.org',
        phone: '+1 800 HEAL SYNC',
        opdTimings: 'Mon-Sat: 08:00 AM - 09:00 PM'
      });
    }
  } catch (err) {
    console.warn('Seed skipped:', err.message);
  }
};

// --- AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) { res.status(403).json({ message: 'Invalid Token' }); }
};

// --- ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password }).lean();
    if (user) {
      const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, SECRET, { expiresIn: '8h' });
      const userRes = { ...user, id: user._id };
      delete userRes._id;
      delete userRes.password;
      res.json({ user: userRes, token });
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/init-dashboard', authenticate, async (req, res) => {
  try {
    const role = req.user.role;
    let stats = { dailyAppointments: 12, opdPatients: 45, ipdPatients: 12, emergencyCases: 0, totalRevenue: 12450, doctorsOnDuty: 2 };
    
    if (role === 'Accountant') stats.totalRevenue = 84500;
    else if (role === 'Doctor') stats.dailyAppointments = 4;
    else if (role === 'Patient') stats = { dailyAppointments: 1, opdPatients: 0, ipdPatients: 0, emergencyCases: 0, totalRevenue: 0, doctorsOnDuty: 14 };

    const doctors = await Doctor.find({ status: 'On Duty' }).limit(5).lean();
    res.json({
      stats,
      revenue: [
        { date: '2024-05-10', amount: 4500, category: 'OPD' },
        { date: '2024-05-12', amount: 6200, category: 'IPD' },
        { date: '2024-05-14', amount: 3800, category: 'Lab' },
        { date: '2024-05-16', amount: 8400, category: 'Surgery' },
        { date: '2024-05-18', amount: 5100, category: 'Pharmacy' }
      ],
      doctors: doctors.map(d => ({ ...d, id: d._id })),
      emergencyCases: []
    });
  } catch (e) {
    res.status(500).json({ message: 'Init Sync failed' });
  }
});

app.get('/api/users', authenticate, async (req, res) => {
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  res.json(await User.find());
});

app.get('/api/patients', authenticate, async (req, res) => {
  if (req.user.role === 'Patient') return res.json(await Patient.find({ email: req.user.email }));
  res.json(await Patient.find());
});

app.get('/api/doctors', authenticate, async (req, res) => res.json(await Doctor.find()));
app.get('/api/appointments', authenticate, async (req, res) => res.json(await Appointment.find()));
app.get('/api/billing/invoices', authenticate, async (req, res) => res.json(await Invoice.find()));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
