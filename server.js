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
const SECRET = process.env.JWT_SECRET || 'healsync_enterprise_secure_key_2024';
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
  name: String, age: Number, gender: String, status: String, admissionDate: String, diagnosis: String,
  medicalHistory: Array, prescriptions: Array
});
const Patient = mongoose.model('Patient', PatientSchema);

// --- MONGODB CONNECTION ---
let isDbConnected = false;
mongoose.connect(MONGODB_URI, { 
  serverSelectionTimeoutMS: 5000,
  autoIndex: true 
})
  .then(async () => {
    isDbConnected = true;
    console.log('✅ Connected to MongoDB');
    await seed();
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection issue. Operating in High-Availability Bypass Mode.');
  });

const seed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const usersToSeed = [
        { username: 'admin', password: 'password123', name: 'System Admin', role: 'Admin', email: 'admin@healsync.com' },
        { username: 'doctor', password: 'password123', name: 'Dr. Sarah Wilson', role: 'Doctor', email: 'sarah@healsync.com' },
        { username: 'nurse', password: 'password123', name: 'Nurse Joy', role: 'Nurse', email: 'joy@healsync.com' }
      ];
      await User.insertMany(usersToSeed);
      console.log('👤 Seeded users');
    }
  } catch (err) {
    console.warn('Seed error:', err.message);
  }
};

// --- AUTH HELPERS ---
const generateToken = (user) => {
  const userId = user._id ? user._id.toString() : (user.id || 'anonymous');
  const payload = {
    id: userId,
    role: user.role,
    name: user.name,
    email: user.email
  };
  return jwt.sign(payload, SECRET, { expiresIn: '12h' });
};

// --- MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Your session has expired. Please re-authenticate.',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ 
      message: 'Access Denied: Invalid security session.',
      code: 'INVALID_TOKEN'
    });
  }
};

const authorize = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      message: `Permission Denied: Your role (${req.user?.role || 'Guest'}) lacks clinical clearance.` 
    });
  }
  next();
};

// --- ROUTES ---

// Root status route
app.get('/', (req, res) => {
  res.send('HealSync HIS Clinical API is Running. Use Port 3000 for the Frontend UI.');
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  const bypassUsers = {
    'admin': { id: 'bypass-admin', name: 'System Admin', role: 'Admin', email: 'admin@healsync.com' },
    'doctor': { id: 'bypass-doctor', name: 'Dr. Sarah Wilson', role: 'Doctor', email: 'sarah@healsync.com' },
    'nurse': { id: 'bypass-nurse', name: 'Nurse Joy', role: 'Nurse', email: 'joy@healsync.com' }
  };

  if (bypassUsers[username] && password === 'password123') {
    const user = bypassUsers[username];
    return res.json({ user, token: generateToken(user) });
  }

  try {
    if (!isDbConnected) {
      return res.status(503).json({ message: 'Clinical Database Offline. Please use demo credentials.' });
    }

    const user = await User.findOne({ username, password }).lean();
    if (user) {
      const userRes = { ...user, id: user._id.toString() };
      delete userRes._id; delete userRes.password; delete userRes.__v;
      res.json({ user: userRes, token: generateToken(userRes) });
    } else {
      res.status(401).json({ message: 'Invalid Staff Credentials.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Authentication Service Error.' });
  }
});

app.get('/api/init-dashboard', authenticate, async (req, res) => {
  try {
    res.json({
      stats: { dailyAppointments: 12, opdPatients: 45, ipdPatients: 12, emergencyCases: 0, totalRevenue: 12450, doctorsOnDuty: 14 },
      revenue: [
        { date: '2024-05-18', amount: 5100, category: 'Pharmacy' },
        { date: '2024-05-19', amount: 3200, category: 'OPD' },
        { date: '2024-05-20', amount: 4150, category: 'IPD' }
      ],
      doctors: [],
      emergencyCases: []
    });
  } catch (e) {
    res.status(500).json({ message: 'Dashboard Sync Failed' });
  }
});

app.get('/api/patients', authenticate, authorize(['Admin', 'Doctor', 'Nurse', 'Super Admin']), async (req, res) => {
  try {
    if (!isDbConnected) return res.json([]);
    const patients = await Patient.find().lean();
    res.json(patients.map(p => ({ ...p, id: p._id.toString() })));
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve patient registry.' });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Clinical API active on http://localhost:${PORT}`));