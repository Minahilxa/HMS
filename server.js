
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
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected: healsync_his'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Global Plugin to map _id to id for the frontend
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

const HospitalSettings = mongoose.model('HospitalSettings', new mongoose.Schema({
  name: { type: String, default: 'HealSync General Hospital' },
  tagline: String, address: String, email: String, phone: String, opdTimings: String
}));

const Patient = mongoose.model('Patient', new mongoose.Schema({
  name: String, age: Number, gender: String, status: { type: String, default: 'OPD' },
  admissionDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  diagnosis: String, phone: String, email: String,
  medicalHistory: [{ date: String, condition: String, treatment: String, notes: String }],
  prescriptions: [{ date: String, doctorName: String, medications: Array, notes: String }]
}));

const Appointment = mongoose.model('Appointment', new mongoose.Schema({
  patientName: String, doctorId: String, doctorName: String, time: String, date: String,
  type: String, source: String, status: { type: String, default: 'Scheduled' }
}));

const Doctor = mongoose.model('Doctor', new mongoose.Schema({
  name: String, specialization: String, department: String, status: { type: String, default: 'On Duty' },
  room: String, experience: String, displayOnWeb: { type: Boolean, default: true }, publicBio: String
}));

const Department = mongoose.model('Department', new mongoose.Schema({
  name: String, description: String, headDoctorId: String, staffCount: Number, status: { type: String, default: 'Active' }
}));

const Service = mongoose.model('Service', new mongoose.Schema({
  name: String, description: String, cost: Number, category: String, isAvailable: { type: Boolean, default: true }
}));

const PharmacyItem = mongoose.model('PharmacyItem', new mongoose.Schema({
  name: String, category: String, stock: Number, minStockLevel: Number, price: Number, expiryDate: String
}));

const PharmacySale = mongoose.model('PharmacySale', new mongoose.Schema({
  patientName: String, items: Array, totalAmount: Number, date: String, paymentStatus: String
}));

const LabTest = mongoose.model('LabTest', new mongoose.Schema({ name: String, category: String, price: Number, description: String }));
const LabSample = mongoose.model('LabSample', new mongoose.Schema({ 
  patientName: String, testName: String, collectionDate: String, status: String, result: String 
}));
const RadiologyOrder = mongoose.model('RadiologyOrder', new mongoose.Schema({
  patientName: String, type: String, bodyPart: String, priority: String, status: String, radiologistNotes: String
}));

const Invoice = mongoose.model('Invoice', new mongoose.Schema({
  patientName: String, date: String, category: String, total: Number, status: String, 
  paymentMethod: String, insuranceProvider: String, insuranceStatus: String
}));

const Announcement = mongoose.model('Announcement', new mongoose.Schema({ title: String, content: String, priority: String, targetAudience: String, date: String, author: String }));
const CMSPage = mongoose.model('CMSPage', new mongoose.Schema({ title: String, slug: String, content: String, status: String, lastUpdated: String }));

// --- SEEDING ---
const seed = async () => {
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    await User.create({ username: 'admin', password: 'password', name: 'System Admin', role: 'Super Admin', email: 'admin@healsync.com' });
    console.log('👤 Created default admin: admin/password');
  }
};
seed();

// --- MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid Token' });
  }
};

// --- ROUTES ---

// Auth
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

// Analytics (Fixing the 404s that caused the blank screen)
app.get('/api/analytics/dashboard-stats', authenticate, async (req, res) => {
  try {
    const [apt, opd, ipd, doc] = await Promise.all([
      Appointment.countDocuments(),
      Patient.countDocuments({ status: 'OPD' }),
      Patient.countDocuments({ status: 'IPD' }),
      Doctor.countDocuments({ status: 'On Duty' })
    ]);
    res.json({ dailyAppointments: apt, opdPatients: opd, ipdPatients: ipd, emergencyCases: 0, totalRevenue: 0, doctorsOnDuty: doc });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/analytics/revenue', authenticate, (req, res) => res.json([]));
app.get('/api/analytics/patient-growth', authenticate, (req, res) => res.json([]));
app.get('/api/analytics/doctor-performance', authenticate, (req, res) => res.json([]));
app.get('/api/emergency/cases', authenticate, (req, res) => res.json([]));

// CRUD Helper
const createCrud = (route, Model) => {
  app.get(`/api/${route}`, authenticate, async (req, res) => res.json(await Model.find()));
  app.post(`/api/${route}`, authenticate, async (req, res) => res.status(201).json(await Model.create(req.body)));
  app.patch(`/api/${route}/:id`, authenticate, async (req, res) => res.json(await Model.findByIdAndUpdate(req.params.id, req.body, { new: true })));
  app.delete(`/api/${route}/:id`, authenticate, async (req, res) => { await Model.findByIdAndDelete(req.params.id); res.sendStatus(200); });
};

createCrud('patients', Patient);
createCrud('appointments', Appointment);
createCrud('doctors', Doctor);
createCrud('departments', Department);
createCrud('services', Service);
createCrud('laboratory/tests', LabTest);
createCrud('laboratory/samples', LabSample);
createCrud('radiology/orders', RadiologyOrder);
createCrud('pharmacy/inventory', PharmacyItem);
createCrud('pharmacy/sales', PharmacySale);
createCrud('billing/invoices', Invoice);
createCrud('cms/pages', CMSPage);
createCrud('communication/announcements', Announcement);

// Missing specialized routes for App.tsx initial load
app.get('/api/reports', authenticate, (req, res) => res.json([]));
app.get('/api/users', authenticate, async (req, res) => res.json(await User.find()));
app.get('/api/settings/hospital', authenticate, async (req, res) => res.json(await HospitalSettings.findOne() || await HospitalSettings.create({})));
app.get('/api/appointments/slots', authenticate, (req, res) => res.json([]));
app.get('/api/staff/leaves', authenticate, (req, res) => res.json([]));

app.listen(PORT, () => console.log(`🚀 HIS Server active on port ${PORT}`));
