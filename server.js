
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
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

mongoose.plugin((schema) => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => { delete ret._id; }
  });
});

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
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

const LabTest = mongoose.model('LabTest', new mongoose.Schema({ name: String, category: String, price: Number, description: String }));
const LabSample = mongoose.model('LabSample', new mongoose.Schema({ 
  patientName: String, testName: String, collectionDate: String, status: String, result: String 
}));
const RadiologyOrder = mongoose.model('RadiologyOrder', new mongoose.Schema({
  patientName: String, type: String, bodyPart: String, priority: String, status: String, radiologistNotes: String
}));
const Invoice = mongoose.model('Invoice', new mongoose.Schema({
  patientName: String, patientId: String, date: String, category: String, total: Number, status: String, paymentMethod: String, insuranceProvider: String, insuranceStatus: String
}));

// --- SEEDING ---
const seed = async () => {
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    await User.create({ username: 'admin', password: 'password', name: 'System Admin', role: 'Super Admin', email: 'admin@healsync.com' });
    console.log('👤 Seeded Admin');
  }
  const settings = await HospitalSettings.findOne();
  if (!settings) {
    await HospitalSettings.create({
      name: 'HealSync General Hospital',
      tagline: 'Excellence in Every Heartbeat',
      address: '77 Medical Plaza, Health District',
      email: 'contact@healsync.org',
      phone: '+1 800 HEAL SYNC',
      opdTimings: 'Mon-Sat: 08:00 AM - 09:00 PM'
    });
    console.log('🏥 Seeded Hospital Settings');
  }
  const docCount = await Doctor.countDocuments();
  if (docCount === 0) {
    await Doctor.insertMany([
      { name: 'Dr. Sarah Wilson', specialization: 'Cardiology', department: 'Cardiology', status: 'On Duty', room: '302', experience: '12 Years' },
      { name: 'Dr. James Miller', specialization: 'Neurology', department: 'Neurology', status: 'On Duty', room: '105', experience: '8 Years' }
    ]);
    console.log('🩺 Seeded Doctors');
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

// Dashboard
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
      stats: { dailyAppointments: aptCount, opdPatients: opdCount, ipdPatients: ipdCount, emergencyCases: 0, totalRevenue: 12450, doctorsOnDuty: docCount },
      revenue: [
        { date: '2024-05-10', amount: 4500, category: 'OPD' },
        { date: '2024-05-12', amount: 6200, category: 'IPD' },
        { date: '2024-05-14', amount: 3800, category: 'Lab' },
        { date: '2024-05-16', amount: 8400, category: 'Surgery' },
        { date: '2024-05-18', amount: 5100, category: 'Pharmacy' }
      ],
      doctors,
      emergencyCases: []
    });
  } catch (e) {
    res.status(500).json({ message: 'Sync failed' });
  }
});

// Patients
app.get('/api/patients', authenticate, async (req, res) => res.json(await Patient.find()));
app.post('/api/patients', authenticate, async (req, res) => res.status(201).json(await Patient.create(req.body)));
app.patch('/api/patients/:id', authenticate, async (req, res) => {
  const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
app.post('/api/patients/:id/ehr', authenticate, async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  patient.medicalHistory.push({ ...req.body, date: new Date().toISOString().split('T')[0] });
  await patient.save();
  res.json(patient);
});
app.post('/api/patients/:id/prescriptions', authenticate, async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  patient.prescriptions.push({ ...req.body, date: new Date().toISOString().split('T')[0] });
  await patient.save();
  res.json(patient);
});

// Appointments
app.get('/api/appointments', authenticate, async (req, res) => res.json(await Appointment.find()));
app.post('/api/appointments', authenticate, async (req, res) => res.status(201).json(await Appointment.create(req.body)));
app.patch('/api/appointments/:id/status', authenticate, async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.json({ success: true });
});

// Settings
app.get('/api/settings/hospital', authenticate, async (req, res) => res.json(await HospitalSettings.findOne() || {}));
app.patch('/api/settings/hospital', authenticate, async (req, res) => {
  const updated = await HospitalSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json(updated);
});

// Doctors
app.get('/api/doctors', authenticate, async (req, res) => res.json(await Doctor.find()));

// Lab
app.get('/api/lab/tests', authenticate, async (req, res) => res.json(await LabTest.find()));
app.get('/api/lab/samples', authenticate, async (req, res) => res.json(await LabSample.find()));
app.patch('/api/lab/samples/:id', authenticate, async (req, res) => {
  const updated = await LabSample.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Radiology
app.get('/api/radiology/orders', authenticate, async (req, res) => res.json(await RadiologyOrder.find()));
app.post('/api/radiology/orders', authenticate, async (req, res) => res.status(201).json(await RadiologyOrder.create({ ...req.body, status: 'Requested' })));
app.patch('/api/radiology/orders/:id', authenticate, async (req, res) => {
  const updated = await RadiologyOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Billing
app.get('/api/billing/invoices', authenticate, async (req, res) => res.json(await Invoice.find()));
app.patch('/api/billing/invoices/:id', authenticate, async (req, res) => {
  const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
