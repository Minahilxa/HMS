
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

// --- MONGODB CONNECTION ---
// Faster connection settings
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('✅ DB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

mongoose.plugin((schema) => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => { delete ret._id; }
  });
});

// --- SCHEMAS ---
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String, email: String, role: String
}));

const Patient = mongoose.model('Patient', new mongoose.Schema({
  name: String, age: Number, gender: String, status: { type: String, default: 'OPD' },
  admissionDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  diagnosis: String, phone: String, email: String
}));

const Appointment = mongoose.model('Appointment', new mongoose.Schema({
  patientName: String, doctorName: String, time: String, date: String, status: String
}));

const Doctor = mongoose.model('Doctor', new mongoose.Schema({
  name: String, specialization: String, department: String, status: { type: String, default: 'On Duty' }
}));

const HospitalSettings = mongoose.model('HospitalSettings', new mongoose.Schema({
  name: { type: String, default: 'HealSync General Hospital' }
}));

// --- SEEDING ---
const seed = async () => {
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    await User.create({ username: 'admin', password: 'password', name: 'System Admin', role: 'Super Admin', email: 'admin@healsync.com' });
    console.log('👤 Seeded Admin');
  }
};
seed();

// --- AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) { res.status(403).json({ message: 'Invalid Token' }); }
};

// --- OPTIMIZED ENDPOINTS ---

// 1. Combined Dashboard Initialization (The Performance Fix)
app.get('/api/init-dashboard', authenticate, async (req, res) => {
  try {
    const [aptCount, opdCount, ipdCount, docCount, doctors] = await Promise.all([
      Appointment.countDocuments(),
      Patient.countDocuments({ status: 'OPD' }),
      Patient.countDocuments({ status: 'IPD' }),
      Doctor.countDocuments({ status: 'On Duty' }),
      Doctor.find({ status: 'On Duty' }).limit(5)
    ]);

    res.json({
      stats: { dailyAppointments: aptCount, opdPatients: opdCount, ipdPatients: ipdCount, emergencyCases: 0, totalRevenue: 0, doctorsOnDuty: docCount },
      revenue: [],
      doctors: doctors,
      emergencyCases: []
    });
  } catch (e) {
    res.status(500).json({ message: 'Sync failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, SECRET, { expiresIn: '8h' });
    res.json({ user, token });
  } else {
    res.status(401).json({ message: 'Invalid Login' });
  }
});

// Generic Fallbacks for other modules
const createCrud = (route, Model) => {
  app.get(`/api/${route}`, authenticate, async (req, res) => res.json(await Model.find()));
  app.post(`/api/${route}`, authenticate, async (req, res) => res.status(201).json(await Model.create(req.body)));
};

createCrud('patients', Patient);
createCrud('appointments', Appointment);
createCrud('doctors', Doctor);
app.get('/api/users', authenticate, async (req, res) => res.json(await User.find()));
app.get('/api/settings/hospital', authenticate, async (req, res) => res.json(await HospitalSettings.findOne() || {}));

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
