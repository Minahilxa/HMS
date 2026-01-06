
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

// --- MODELS ---
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  email: String,
  role: String,
  avatar: String
}));

const Patient = mongoose.model('Patient', new mongoose.Schema({
  name: String, age: Number, gender: String, status: String, admissionDate: String, diagnosis: String,
  medicalHistory: Array, prescriptions: Array, email: String, phone: String
}));

const Doctor = mongoose.model('Doctor', new mongoose.Schema({
  name: String, specialization: String, department: String, status: String, room: String, 
  experience: String, schedules: Array, publicBio: String, displayOnWeb: Boolean, profileImage: String
}));

const Appointment = mongoose.model('Appointment', new mongoose.Schema({
  patientName: String, doctorId: String, doctorName: String, time: String, date: String, 
  type: String, source: String, status: String
}));

const Department = mongoose.model('Department', new mongoose.Schema({
  name: String, description: String, headDoctorId: String, staffCount: { type: Number, default: 0 }, status: String
}));

const Service = mongoose.model('Service', new mongoose.Schema({
  name: String, description: String, cost: Number, category: String, isAvailable: { type: Boolean, default: true }
}));

const Invoice = mongoose.model('Invoice', new mongoose.Schema({
  patientId: String, patientName: String, date: String, category: String, amount: Number, 
  tax: Number, discount: Number, total: Number, status: String, paymentMethod: String, 
  insuranceProvider: String, insuranceStatus: String
}));

const LabSample = mongoose.model('LabSample', new mongoose.Schema({
  patientId: String, patientName: String, testId: String, testName: String, 
  collectionDate: String, status: String, result: String
}));

const RadiologyOrder = mongoose.model('RadiologyOrder', new mongoose.Schema({
  patientId: String, patientName: String, type: String, bodyPart: String, 
  priority: String, status: String, requestDate: String, radiologistNotes: String
}));

const PharmacyItem = mongoose.model('PharmacyItem', new mongoose.Schema({
  name: String, category: String, stock: Number, minStockLevel: Number, 
  price: Number, expiryDate: String, supplierId: String
}));

const EmergencyCase = mongoose.model('EmergencyCase', new mongoose.Schema({
  patientName: String, arrivalType: String, priority: String, timestamp: String, 
  assignedDoctor: String, status: String
}));

const Email = mongoose.model('Email', new mongoose.Schema({
  senderEmail: String, recipientEmail: String, patientName: String, subject: String, 
  content: String, status: String, timestamp: { type: String, default: () => new Date().toLocaleString() }, 
  direction: String, type: String
}));

const Invitation = mongoose.model('Invitation', new mongoose.Schema({
  email: String, role: String, status: { type: String, default: 'Sent' }, timestamp: String
}));

const Settings = mongoose.model('Settings', new mongoose.Schema({
  name: String, tagline: String, address: String, email: String, phone: String, website: String, opdTimings: String
}));

// --- DATABASE ---
let isDbConnected = false;
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    isDbConnected = true;
    console.log('✅ Connected to MongoDB');
    await seed();
  })
  .catch(() => console.warn('⚠️ Database connection issue.'));

const seed = async () => {
  if (await User.countDocuments() === 0) {
    await User.insertMany([
      { username: 'admin', password: 'password123', name: 'Master Admin', role: 'Super Admin', email: 'abbasminahil1@gmail.com' },
      { username: 'receptionist', password: 'password123', name: 'Alice Front', role: 'Receptionist', email: 'alice@healsync.com' },
      { username: 'doctor', password: 'password123', name: 'Dr. Sarah Wilson', role: 'Doctor', email: 'sarah@healsync.com' },
      { username: 'lab_tech', password: 'password123', name: 'Mark Tech', role: 'Lab Technician', email: 'mark@healsync.com' },
      { username: 'radiologist', password: 'password123', name: 'Dr. Ray X', role: 'Radiologist', email: 'ray@healsync.com' },
      { username: 'pharmacist', password: 'password123', name: 'Pharma Phil', role: 'Pharmacist', email: 'phil@healsync.com' }
    ]);
    console.log('👤 Seeded administrative roles');
  }
  if (await Settings.countDocuments() === 0) {
    await Settings.create({ name: 'HealSync General Hospital', tagline: 'Excellence in Clinical Care' });
  }
};

// --- MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Auth required' });
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], SECRET);
    next();
  } catch (err) { res.status(403).json({ message: 'Invalid session' }); }
};

// --- ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }).lean();
  if (user) {
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, SECRET, { expiresIn: '12h' });
    res.json({ user, token });
  } else res.status(401).json({ message: 'Access Denied' });
});

app.get('/api/init-dashboard', authenticate, async (req, res) => {
  const [stats, doctors, emergencyCases] = await Promise.all([
    Patient.countDocuments(), Doctor.find(), EmergencyCase.find({ status: 'Active' })
  ]);
  res.json({
    stats: { dailyAppointments: 12, opdPatients: 45, ipdPatients: 12, emergencyCases: emergencyCases.length, totalRevenue: 12450, doctorsOnDuty: 8 },
    revenue: [{ date: '2024-05-20', amount: 4150, category: 'IPD' }],
    doctors, emergencyCases
  });
});

// Patients
app.get('/api/patients', authenticate, async (req, res) => res.json(await Patient.find()));
app.post('/api/patients', authenticate, async (req, res) => res.json(await Patient.create(req.body)));
app.patch('/api/patients/:id', authenticate, async (req, res) => res.json(await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.post('/api/patients/:id/ehr', authenticate, async (req, res) => {
  const p = await Patient.findById(req.params.id);
  p.medicalHistory.push({ ...req.body, id: Date.now().toString() });
  await p.save();
  res.json(p);
});

// Doctors
app.get('/api/doctors', authenticate, async (req, res) => res.json(await Doctor.find()));
app.post('/api/doctors', authenticate, async (req, res) => res.json(await Doctor.create(req.body)));
app.patch('/api/doctors/:id/status', authenticate, async (req, res) => res.json(await Doctor.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })));

// Appointments
app.get('/api/appointments', authenticate, async (req, res) => res.json(await Appointment.find()));
app.post('/api/appointments', authenticate, async (req, res) => res.json(await Appointment.create(req.body)));

// Billing
app.get('/api/invoices', authenticate, async (req, res) => res.json(await Invoice.find()));
app.post('/api/invoices', authenticate, async (req, res) => {
  const inv = req.body;
  inv.tax = inv.amount * 0.1;
  inv.total = inv.amount + inv.tax - (inv.discount || 0);
  res.json(await Invoice.create(inv));
});

// Pharmacy
app.get('/api/pharmacy/inventory', authenticate, async (req, res) => res.json(await PharmacyItem.find()));
app.post('/api/pharmacy/inventory', authenticate, async (req, res) => res.json(await PharmacyItem.create(req.body)));

// Lab & Radio
app.get('/api/lab/samples', authenticate, async (req, res) => res.json(await LabSample.find()));
app.get('/api/radiology/orders', authenticate, async (req, res) => res.json(await RadiologyOrder.find()));

// Emergency
app.get('/api/emergency/cases', authenticate, async (req, res) => res.json(await EmergencyCase.find()));
app.post('/api/emergency/cases', authenticate, async (req, res) => res.json(await EmergencyCase.create({ ...req.body, timestamp: new Date().toLocaleString() })));

// Settings
app.get('/api/settings/hospital', authenticate, async (req, res) => res.json(await Settings.findOne()));
app.patch('/api/settings/hospital', authenticate, async (req, res) => res.json(await Settings.findOneAndUpdate({}, req.body, { new: true })));

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Clinical API active on http://127.0.0.1:${PORT}`));
