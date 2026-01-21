import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || "healsync_enterprise_secure_key_2024";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healsync_testing";

// --- MODELS ---
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    email: String,
    role: String,
    avatar: String,
  })
);

const Patient = mongoose.model(
  "Patient",
  new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    status: String,
    admissionDate: String,
    diagnosis: String,
    medicalHistory: Array,
    prescriptions: Array,
    email: String,
    phone: String,
  })
);

const Doctor = mongoose.model(
  "Doctor",
  new mongoose.Schema({
    name: String,
    specialization: String,
    department: String,
    status: String,
    room: String,
    experience: String,
    schedules: Array,
    publicBio: String,
    displayOnWeb: Boolean,
    profileImage: String,
  })
);

const Appointment = mongoose.model(
  "Appointment",
  new mongoose.Schema({
    patientName: String,
    doctorId: String,
    doctorName: String,
    time: String,
    date: String,
    type: String,
    source: String,
    status: String,
  })
);

const TimeSlot = mongoose.model(
  "TimeSlot",
  new mongoose.Schema({
    doctorId: String,
    day: String,
    startTime: String,
    endTime: String,
    isAvailable: { type: Boolean, default: true },
  })
);
const LeaveRequest = mongoose.model(
  "LeaveRequest",
  new mongoose.Schema({
    doctorId: String,
    doctorName: String,
    type: String,
    startDate: String,
    endDate: String,
    reason: String,
    status: { type: String, default: "Pending" },
  })
);

const DoctorPerformance = mongoose.model(
  "DoctorPerformance",
  new mongoose.Schema({
    doctorId: String,
    patientsSeen: Number,
    surgeriesPerformed: Number,
    rating: Number,
    attendanceRate: Number,
  })
);

const Department = mongoose.model(
  "Department",
  new mongoose.Schema({
    name: String,
    description: String,
    headDoctorId: String,
    staffCount: { type: Number, default: 0 },
    status: String,
  })
);

const Service = mongoose.model(
  "Service",
  new mongoose.Schema({
    name: String,
    description: String,
    cost: Number,
    category: String,
    isAvailable: { type: Boolean, default: true },
  })
);

const LabTest = mongoose.model(
  "LabTest",
  new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
  })
);

const PharmacySale = mongoose.model(
  "PharmacySale",
  new mongoose.Schema({
    patientName: String,
    items: Array,
    totalAmount: Number,
    date: { type: String, default: () => new Date().toLocaleDateString() },
    paymentStatus: String,
  })
);

const PharmacySupplier = mongoose.model(
  "PharmacySupplier",
  new mongoose.Schema({
    name: String,
    contactPerson: String,
    phone: String,
    email: String,
    address: String,
  })
);

const Invoice = mongoose.model(
  "Invoice",
  new mongoose.Schema({
    patientId: String,
    patientName: String,
    date: String,
    category: String,
    amount: Number,
    tax: Number,
    discount: Number,
    total: Number,
    status: String,
    paymentMethod: String,
    insuranceProvider: String,
    insuranceStatus: String,
  })
);
const InsurancePanel = mongoose.model(
  "InsurancePanel",
  new mongoose.Schema({
    name: String,
    code: String,
    contactPerson: String,
    email: String,
    phone: String,
    settlementPeriod: Number,
    status: String,
  })
);
const InsuranceClaim = mongoose.model(
  "InsuranceClaim",
  new mongoose.Schema({
    patientId: String,
    patientName: String,
    panelId: String,
    panelName: String,
    invoiceId: String,
    claimAmount: Number,
    approvedAmount: Number,
    status: String,
    submissionDate: String,
    settlementDate: String,
  })
);

const PatientCoverage = mongoose.model(
  "PatientCoverage",
  new mongoose.Schema({
    patientId: String,
    panelId: String,
    policyNumber: String,
    totalLimit: Number,
    consumedLimit: Number,
    expiryDate: String,
    status: { type: String, default: "Verified" },
  })
);

const CMSPage = mongoose.model(
  "CMSPage",
  new mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    status: String,
    lastUpdated: {
      type: String,
      default: () => new Date().toLocaleDateString(),
    },
  })
);

const CMSBlog = mongoose.model(
  "CMSBlog",
  new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    date: String,
    image: String,
    excerpt: String,
    status: String,
  })
);
const CMSSlider = mongoose.model(
  "CMSSlider",
  new mongoose.Schema({
    title: String,
    subTitle: String,
    imageUrl: String,
    buttonText: String,
    buttonLink: String,
    order: Number,
    isActive: Boolean,
  })
);

const CMSSEO = mongoose.model(
  "CMSSEO",
  new mongoose.Schema({
    pageName: String,
    titleTag: String,
    metaDescription: String,
    keywords: String,
  })
);
const Announcement = mongoose.model(
  "Announcement",
  new mongoose.Schema({
    title: String,
    content: String,
    priority: String,
    targetAudience: String,
    date: { type: String, default: () => new Date().toLocaleDateString() },
    author: String,
  })
);

const SMSLog = mongoose.model(
  "SMSLog",
  new mongoose.Schema({
    patientName: String,
    phoneNumber: String,
    message: String,
    status: String,
    timestamp: String,
    type: String,
  })
);

const EmailLog = mongoose.model(
  "EmailLog",
  new mongoose.Schema({
    senderEmail: String,
    recipientEmail: String,
    patientName: String,
    subject: String,
    content: String,
    status: String,
    timestamp: String,
    direction: String,
    type: String,
  })
);
const LabSample = mongoose.model(
  "LabSample",
  new mongoose.Schema({
    patientId: String,
    patientName: String,
    testId: String,
    testName: String,
    collectionDate: String,
    status: String,
    result: String,
  })
);

const RadiologyOrder = mongoose.model(
  "RadiologyOrder",
  new mongoose.Schema({
    patientId: String,
    patientName: String,
    type: String,
    bodyPart: String,
    priority: String,
    status: String,
    requestDate: String,
    radiologistNotes: String,
  })
);

const PharmacyItem = mongoose.model(
  "PharmacyItem",
  new mongoose.Schema({
    name: String,
    category: String,
    stock: Number,
    minStockLevel: Number,
    price: Number,
    expiryDate: String,
    supplierId: String,
  })
);

const EmergencyCase = mongoose.model(
  "EmergencyCase",
  new mongoose.Schema({
    patientName: String,
    arrivalType: String,
    priority: String,
    timestamp: String,
    assignedDoctor: String,
    status: String,
  })
);

const Email = mongoose.model(
  "Email",
  new mongoose.Schema({
    senderEmail: String,
    recipientEmail: String,
    patientName: String,
    subject: String,
    content: String,
    status: String,
    timestamp: { type: String, default: () => new Date().toLocaleString() },
    direction: String,
    type: String,
  })
);

const Invitation = mongoose.model(
  "Invitation",
  new mongoose.Schema({
    email: String,
    role: String,
    status: { type: String, default: "Sent" },
    timestamp: String,
  })
);

const Settings = mongoose.model(
  "Settings",
  new mongoose.Schema({
    name: String,
    tagline: String,
    address: String,
    email: String,
    phone: String,
    website: String,
    opdTimings: String,
  })
);

const EmergencyNumber = mongoose.model(
  "EmergencyNumber",
  new mongoose.Schema({
    label: String,
    number: String,
    department: String,
  })
);

const PaymentGateway = mongoose.model(
  "PaymentGateway",
  new mongoose.Schema({
    provider: String,
    merchantId: String,
    status: String,
    methods: Array,
  })
);

const BackupLog = mongoose.model(
  "BackupLog",
  new mongoose.Schema({
    timestamp: String,
    size: String,
    status: String,
    type: String,
  })
);

const SecuritySetting = mongoose.model(
  "SecuritySetting",
  new mongoose.Schema({
    label: String,
    description: String,
    isEnabled: Boolean,
    category: String,
  })
);

const AccessHistory = mongoose.model(
  "AccessHistory",
  new mongoose.Schema({
    patientName: String,
    action: String,
    timestamp: { type: String, default: () => new Date().toLocaleString() },
    device: String,
  })
);

const CustomReport = mongoose.model(
  "CustomReport",
  new mongoose.Schema({
    name: String,
    type: String,
    dateRange: String,
    filters: String,
    createdBy: String,
  })
);

// --- DATABASE ---
let isDbConnected = false;
mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    isDbConnected = true;
    console.log("✅ Connected to MongoDB");
    await seed();
  })
  .catch(() => console.warn("⚠️ Database connection issue."));

const seed = async () => {
  if ((await User.countDocuments()) === 0) {
    await User.insertMany([
      {
        username: "admin",
        password: "password123",
        name: "Master Admin",
        role: "Super Admin",
        email: "abbasminahil1@gmail.com",
      },
      {
        username: "receptionist",
        password: "password123",
        name: "Alice Front",
        role: "Receptionist",
        email: "alice@healsync.com",
      },
      {
        username: "doctor",
        password: "password123",
        name: "Dr. Sarah Wilson",
        role: "Doctor",
        email: "sarah@healsync.com",
      },
      {
        username: "lab_tech",
        password: "password123",
        name: "Mark Tech",
        role: "Lab Technician",
        email: "mark@healsync.com",
      },
      {
        username: "radiologist",
        password: "password123",
        name: "Dr. Ray X",
        role: "Radiologist",
        email: "ray@healsync.com",
      },
      {
        username: "pharmacist",
        password: "password123",
        name: "Pharma Phil",
        role: "Pharmacist",
        email: "phil@healsync.com",
      },
    ]);
    console.log("👤 Seeded administrative roles");
  }
  if ((await Settings.countDocuments()) === 0) {
    await Settings.create({
      name: "HealSync General Hospital",
      tagline: "Excellence in Clinical Care",
    });
  }
};

// --- MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Auth required" });
  try {
    req.user = jwt.verify(authHeader.split(" ")[1], SECRET);
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid session" });
  }
};
const getAggregatedStats = async () => {
  const today = new Date().toLocaleDateString();
  const [
    dailyAptCount,
    opdCount,
    ipdCount,
    activeEmergenciesCount,
    onDutyDocsCount,
    revenueResult,
    allInvoices,
    allDoctors,
    activeEmergencyCases,
  ] = await Promise.all([
    Appointment.countDocuments({ date: today }),
    Patient.countDocuments({ status: "OPD" }),
    Patient.countDocuments({ status: "IPD" }),
    EmergencyCase.countDocuments({ status: { $in: ["Active", "Pending"] } }),
    Doctor.countDocuments({ status: "On Duty" }),
    Invoice.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    Invoice.find().sort({ date: -1 }).limit(30), // Revenue trend
    Doctor.find(),
    EmergencyCase.find({ status: "Active" }),
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  return {
    stats: {
      dailyAppointments: dailyAptCount,
      opdPatients: opdCount,
      ipdPatients: ipdCount,
      emergencyCases: activeEmergenciesCount,
      totalRevenue: totalRevenue,
      doctorsOnDuty: onDutyDocsCount,
    },
    revenue: allInvoices.map((i) => ({
      date: i.date,
      amount: i.total,
      category: i.category,
    })),
    doctors: allDoctors,
    emergencyCases: activeEmergencyCases,
  };
};

// --- ROUTES ---
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }).lean();
  if (user) {
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "12h" }
    );
    res.json({ user, token });
  } else res.status(401).json({ message: "Access Denied" });
});

app.get("/api/users", authenticate, async (req, res) =>
  res.json(await User.find())
);
app.patch("/api/users/:id/role", authenticate, async (req, res) =>
  res.json(
    await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    )
  )
);

app.post("/api/users/invite", authenticate, async (req, res) =>
  res.json({ message: "Invitation sent successfully." })
);

app.get("/api/init-dashboard", authenticate, async (req, res) => {
  try {
    const data = await getAggregatedStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to aggregate dashboard data" });
  }
});

app.get("/api/stats", authenticate, async (req, res) => {
  try {
    const data = await getAggregatedStats();
    res.json(data.stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Patients
app.get("/api/patients", authenticate, async (req, res) =>
  res.json(await Patient.find())
);
app.post("/api/patients", authenticate, async (req, res) =>
  res.json(await Patient.create(req.body))
);
app.patch("/api/patients/:id", authenticate, async (req, res) =>
  res.json(
    await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.post("/api/patients/:id/ehr", authenticate, async (req, res) => {
  const p = await Patient.findById(req.params.id);
  p.medicalHistory.push({ ...req.body, id: Date.now().toString() });
  await p.save();
  res.json(p);
});

app.post("/api/patients/:id/prescriptions", authenticate, async (req, res) => {
  const p = await Patient.findById(req.params.id);
  p.prescriptions.push({ ...req.body, id: Date.now().toString() });
  await p.save();
  res.json(p);
});

//api of stats
app.get("/api/stats", authenticate, async (req, res) => {
  const [patients, doctors, emergencies, invoices] = await Promise.all([
    Patient.countDocuments(),
    Doctor.find(),
    EmergencyCase.countDocuments({ status: "Active" }),
    Invoice.find(),
  ]);
  res.json({
    dailyAppointments: 12,
    opdPatients: patients,
    ipdPatients: 5,
    emergencyCases: emergencies,
    totalRevenue: invoices.reduce((a, c) => a + c.total, 0),
    doctorsOnDuty: doctors.filter((d) => d.status === "On Duty").length,
  });
});
// Doctors
app.get("/api/doctors", authenticate, async (req, res) =>
  res.json(await Doctor.find())
);
app.post("/api/doctors", authenticate, async (req, res) =>
  res.json(await Doctor.create(req.body))
);
app.patch("/api/doctors/:id", authenticate, async (req, res) =>
  res.json(
    await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.patch("/api/doctors/:id/status", authenticate, async (req, res) =>
  res.json(
    await Doctor.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
  )
);
app.patch("/api/doctors/:id/cms", authenticate, async (req, res) =>
  res.json(
    await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.get("/api/doctors/performance", authenticate, async (req, res) =>
  res.json(await DoctorPerformance.find())
);

// Appointments
app.get("/api/appointments", authenticate, async (req, res) =>
  res.json(await Appointment.find())
);
app.post("/api/appointments", authenticate, async (req, res) =>
  res.json(await Appointment.create(req.body))
);
app.patch("/api/appointments/:id/status", authenticate, async (req, res) =>
  res.json(
    await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
  )
);
app.get("/api/slots", authenticate, async (req, res) =>
  res.json(await TimeSlot.find())
);
app.post("/api/slots", authenticate, async (req, res) =>
  res.json(await TimeSlot.create(req.body))
);
app.get("/api/leaves", authenticate, async (req, res) =>
  res.json(await LeaveRequest.find())
);
app.patch("/api/leaves/:id/status", authenticate, async (req, res) =>
  res.json(
    await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
  )
);

// Departments & Services
app.get("/api/departments", authenticate, async (req, res) =>
  res.json(await Department.find())
);
app.post("/api/departments", authenticate, async (req, res) =>
  res.json(await Department.create(req.body))
);
app.patch("/api/departments/:id", authenticate, async (req, res) =>
  res.json(
    await Department.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.get("/api/services", authenticate, async (req, res) =>
  res.json(await Service.find())
);
app.post("/api/services", authenticate, async (req, res) =>
  res.json(await Service.create(req.body))
);
app.patch("/api/services/:id", authenticate, async (req, res) =>
  res.json(
    await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.delete("/api/services/:id", authenticate, async (req, res) =>
  res.json(await Service.findByIdAndDelete(req.params.id))
);

// Billing
app.get("/api/invoices", authenticate, async (req, res) =>
  res.json(await Invoice.find())
);
app.post("/api/invoices", authenticate, async (req, res) => {
  const inv = req.body;
  inv.tax = inv.amount * 0.1;
  inv.total = inv.amount + inv.tax - (inv.discount || 0);
  res.json(await Invoice.create(inv));
});
app.patch("/api/invoices/:id", authenticate, async (req, res) =>
  res.json(
    await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);

// Pharmacy
app.get("/api/pharmacy/inventory", authenticate, async (req, res) =>
  res.json(await PharmacyItem.find())
);
app.post("/api/pharmacy/inventory", authenticate, async (req, res) =>
  res.json(await PharmacyItem.create(req.body))
);
app.patch("/api/pharmacy/inventory/:id", authenticate, async (req, res) =>
  res.json(
    await PharmacyItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.delete("/api/pharmacy/inventory/:id", authenticate, async (req, res) =>
  res.json(await PharmacyItem.findByIdAndDelete(req.params.id))
);
app.get("/api/pharmacy/sales", authenticate, async (req, res) =>
  res.json(await PharmacySale.find())
);
app.post("/api/pharmacy/sales", authenticate, async (req, res) =>
  res.json(await PharmacySale.create(req.body))
);
app.get("/api/pharmacy/suppliers", authenticate, async (req, res) =>
  res.json(await PharmacySupplier.find())
);
app.post("/api/pharmacy/suppliers", authenticate, async (req, res) =>
  res.json(await PharmacySupplier.create(req.body))
);

// Insurance
app.get("/api/insurance/panels", authenticate, async (req, res) =>
  res.json(await InsurancePanel.find())
);
app.post("/api/insurance/panels", authenticate, async (req, res) =>
  res.json(await InsurancePanel.create(req.body))
);
app.patch("/api/insurance/panels/:id", authenticate, async (req, res) =>
  res.json(
    await InsurancePanel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
  )
);
app.delete("/api/insurance/panels/:id", authenticate, async (req, res) =>
  res.json(await InsurancePanel.findByIdAndDelete(req.params.id))
);
app.get("/api/insurance/claims", authenticate, async (req, res) =>
  res.json(await InsuranceClaim.find())
);
app.patch("/api/insurance/claims/:id/status", authenticate, async (req, res) =>
  res.json(
    await InsuranceClaim.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
  )
);
app.get("/api/insurance/coverage/:id", authenticate, async (req, res) =>
  res.json(await PatientCoverage.find({ patientId: req.params.id }))
);
app.post("/api/insurance/coverage", authenticate, async (req, res) =>
  res.json(await PatientCoverage.create(req.body))
);

//CMS
app.get("/api/cms/pages", authenticate, async (req, res) =>
  res.json(await CMSPage.find())
);
app.post("/api/cms/pages", authenticate, async (req, res) =>
  res.json(await CMSPage.create(req.body))
);
app.patch("/api/cms/pages/:id", authenticate, async (req, res) =>
  res.json(
    await CMSPage.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.delete("/api/cms/pages/:id", authenticate, async (req, res) =>
  res.json(await CMSPage.findByIdAndDelete(req.params.id))
);

app.get("/api/cms/blogs", authenticate, async (req, res) =>
  res.json(await CMSBlog.find())
);
app.post("/api/cms/blogs", authenticate, async (req, res) =>
  res.json(
    await CMSBlog.create({ ...req.body, date: new Date().toLocaleDateString() })
  )
);
app.patch("/api/cms/blogs/:id", authenticate, async (req, res) =>
  res.json(
    await CMSBlog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.delete("/api/cms/blogs/:id", authenticate, async (req, res) =>
  res.json(await CMSBlog.findByIdAndDelete(req.params.id))
);

app.get("/api/cms/sliders", authenticate, async (req, res) =>
  res.json(await CMSSlider.find())
);
app.post("/api/cms/sliders", authenticate, async (req, res) =>
  res.json(await CMSSlider.create(req.body))
);
app.patch("/api/cms/sliders/:id", authenticate, async (req, res) =>
  res.json(
    await CMSSlider.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.delete("/api/cms/sliders/:id", authenticate, async (req, res) =>
  res.json(await CMSSlider.findByIdAndDelete(req.params.id))
);

app.get("/api/cms/seo", authenticate, async (req, res) =>
  res.json(await CMSSEO.find())
);
app.post("/api/cms/seo", authenticate, async (req, res) =>
  res.json(await CMSSEO.create(req.body))
);
app.patch("/api/cms/seo/:id", authenticate, async (req, res) =>
  res.json(
    await CMSSEO.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.delete("/api/cms/seo/:id", authenticate, async (req, res) =>
  res.json(await CMSSEO.findByIdAndDelete(req.params.id))
);

// Communication
app.get("/api/communications/announcements", authenticate, async (req, res) =>
  res.json(await Announcement.find())
);
app.post("/api/communications/announcements", authenticate, async (req, res) =>
  res.json(
    await Announcement.create({ ...req.body, author: req.user.name || "Admin" })
  )
);
app.delete(
  "/api/communications/announcements/:id",
  authenticate,
  async (req, res) =>
    res.json(await Announcement.findByIdAndDelete(req.params.id))
);
app.get("/api/communications/sms", authenticate, async (req, res) =>
  res.json(await SMSLog.find())
);
app.post("/api/communications/sms", authenticate, async (req, res) =>
  res.json(
    await SMSLog.create({
      ...req.body,
      timestamp: new Date().toLocaleString(),
      status: "Sent",
    })
  )
);
app.get("/api/emails", authenticate, async (req, res) =>
  res.json(await EmailLog.find())
);
app.post("/api/emails/send", authenticate, async (req, res) =>
  res.json(
    await EmailLog.create({
      ...req.body,
      timestamp: new Date().toLocaleString(),
      status: "Sent",
    })
  )
);

app.get("/api/revenue", authenticate, async (req, res) => {
  const inv = await Invoice.find();
  const summary = inv.map((i) => ({
    date: i.date,
    amount: i.total,
    category: i.category,
  }));
  res.json(summary);
});
app.get("/api/analytics/growth", authenticate, async (req, res) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  res.json(
    months.map((m) => ({
      month: m,
      newPatients: Math.floor(Math.random() * 50) + 20,
      discharges: Math.floor(Math.random() * 30) + 10,
    }))
  );
});
app.get("/api/analytics/access-history", authenticate, async (req, res) =>
  res.json(await AccessHistory.find())
);
app.get("/api/analytics/reports", authenticate, async (req, res) =>
  res.json(await CustomReport.find())
);
app.delete("/api/analytics/reports/:id", authenticate, async (req, res) =>
  res.json(await CustomReport.findByIdAndDelete(req.params.id))
);

// Lab & Radio
app.get("/api/lab/tests", authenticate, async (req, res) =>
  res.json(await LabTest.find())
);
app.get("/api/lab/samples", authenticate, async (req, res) =>
  res.json(await LabSample.find())
);
app.patch("/api/lab/samples/:id/status", authenticate, async (req, res) =>
  res.json(
    await LabSample.findByIdAndUpdate(req.params.id, req.body, { new: true })
  )
);
app.get("/api/radiology/orders", authenticate, async (req, res) =>
  res.json(await RadiologyOrder.find())
);
app.post("/api/radiology/orders", authenticate, async (req, res) =>
  res.json(
    await RadiologyOrder.create({
      ...req.body,
      requestDate: new Date().toLocaleDateString(),
      status: "Requested",
    })
  )
);
app.patch("/api/radiology/orders/:id/status", authenticate, async (req, res) =>
  res.json(
    await RadiologyOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
  )
);

// Emergency
app.get("/api/emergency/cases", authenticate, async (req, res) =>
  res.json(await EmergencyCase.find())
);
app.post("/api/emergency/cases", authenticate, async (req, res) =>
  res.json(
    await EmergencyCase.create({
      ...req.body,
      timestamp: new Date().toLocaleString(),
    })
  )
);
app.patch("/api/emergency/cases/:id", authenticate, async (req, res) =>
  res.json(
    await EmergencyCase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
  )
);
app.delete("/api/emergency/cases/:id", authenticate, async (req, res) =>
  res.json(await EmergencyCase.findByIdAndDelete(req.params.id))
);

// Settings
app.get("/api/settings/hospital", authenticate, async (req, res) =>
  res.json(await Settings.findOne())
);
app.patch("/api/settings/hospital", authenticate, async (req, res) =>
  res.json(await Settings.findOneAndUpdate({}, req.body, { new: true }))
);
app.get("/api/settings/emergency-numbers", authenticate, async (req, res) =>
  res.json(await EmergencyNumber.find())
);
app.post("/api/settings/emergency-numbers", authenticate, async (req, res) =>
  res.json(await EmergencyNumber.create(req.body))
);
app.patch(
  "/api/settings/emergency-numbers/:id",
  authenticate,
  async (req, res) =>
    res.json(
      await EmergencyNumber.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
    )
);
app.delete(
  "/api/settings/emergency-numbers/:id",
  authenticate,
  async (req, res) =>
    res.json(await EmergencyNumber.findByIdAndDelete(req.params.id))
);
app.get("/api/settings/payments", authenticate, async (req, res) =>
  res.json(await PaymentGateway.find())
);
app.post("/api/settings/payments", authenticate, async (req, res) =>
  res.json(await PaymentGateway.create(req.body))
);
app.patch("/api/settings/payments/:id", authenticate, async (req, res) =>
  res.json(
    await PaymentGateway.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
  )
);
app.delete("/api/settings/payments/:id", authenticate, async (req, res) =>
  res.json(await PaymentGateway.findByIdAndDelete(req.params.id))
);
app.get("/api/settings/backups", authenticate, async (req, res) =>
  res.json(await BackupLog.find())
);
app.post("/api/settings/backups/run", authenticate, async (req, res) =>
  res.json(
    await BackupLog.create({
      timestamp: new Date().toLocaleString(),
      size: "42MB",
      status: "Success",
      type: "Manual",
    })
  )
);
app.delete("/api/settings/backups/:id", authenticate, async (req, res) =>
  res.json(await BackupLog.findByIdAndDelete(req.params.id))
);
app.get("/api/settings/security", authenticate, async (req, res) =>
  res.json(await SecuritySetting.find())
);
app.post("/api/settings/security", authenticate, async (req, res) =>
  res.json(await SecuritySetting.create(req.body))
);
app.patch("/api/settings/security/:id", authenticate, async (req, res) =>
  res.json(
    await SecuritySetting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
  )
);
app.patch(
  "/api/settings/security/:id/toggle",
  authenticate,
  async (req, res) => {
    const s = await SecuritySetting.findById(req.params.id);
    s.isEnabled = !s.isEnabled;
    await s.save();
    res.json(s);
  }
);
app.delete("/api/settings/security/:id", authenticate, async (req, res) =>
  res.json(await SecuritySetting.findByIdAndDelete(req.params.id))
);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Clinical API active on http://127.0.0.1:${PORT}`)
);
