import mongoose from "mongoose";

const defineModel = (name, schema) =>
  mongoose.models[name] || mongoose.model(name, new mongoose.Schema(schema));

export const User = defineModel("User", {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  email: String,
  role: String,
  avatar: String,
});
export const Patient = defineModel("Patient", {
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
});
export const Doctor = defineModel("Doctor", {
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
});
export const Appointment = defineModel("Appointment", {
  patientName: String,
  doctorId: String,
  doctorName: String,
  time: String,
  date: String,
  type: String,
  source: String,
  status: String,
});
export const TimeSlot = defineModel("TimeSlot", {
  doctorId: String,
  day: String,
  startTime: String,
  endTime: String,
  isAvailable: { type: Boolean, default: true },
});
export const LeaveRequest = defineModel("LeaveRequest", {
  doctorId: String,
  doctorName: String,
  type: String,
  startDate: String,
  endDate: String,
  reason: String,
  status: { type: String, default: "Pending" },
});
export const DoctorPerformance = defineModel("DoctorPerformance", {
  doctorId: String,
  patientsSeen: Number,
  surgeriesPerformed: Number,
  rating: Number,
  attendanceRate: Number,
});
export const Department = defineModel("Department", {
  name: String,
  description: String,
  headDoctorId: String,
  staffCount: { type: Number, default: 0 },
  status: String,
});
export const Service = defineModel("Service", {
  name: String,
  description: String,
  cost: Number,
  category: String,
  isAvailable: { type: Boolean, default: true },
});
export const LabTest = defineModel("LabTest", {
  name: String,
  category: String,
  price: Number,
  description: String,
});
export const PharmacySale = defineModel("PharmacySale", {
  patientName: String,
  items: Array,
  totalAmount: Number,
  date: { type: String, default: () => new Date().toLocaleDateString() },
  paymentStatus: String,
});
export const PharmacySupplier = defineModel("PharmacySupplier", {
  name: String,
  contactPerson: String,
  phone: String,
  email: String,
  address: String,
});
export const Invoice = defineModel("Invoice", {
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
});
export const InsurancePanel = defineModel("InsurancePanel", {
  name: String,
  code: String,
  contactPerson: String,
  email: String,
  phone: String,
  settlementPeriod: Number,
  status: String,
});
export const InsuranceClaim = defineModel("InsuranceClaim", {
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
});
export const PatientCoverage = defineModel("PatientCoverage", {
  patientId: String,
  panelId: String,
  policyNumber: String,
  totalLimit: Number,
  consumedLimit: Number,
  expiryDate: String,
  status: { type: String, default: "Verified" },
});
export const CMSPage = defineModel("CMSPage", {
  title: String,
  slug: String,
  content: String,
  status: String,
  lastUpdated: {
    type: String,
    default: () => new Date().toLocaleDateString(),
  },
});
export const CMSBlog = defineModel("CMSBlog", {
  title: String,
  author: String,
  category: String,
  date: String,
  image: String,
  excerpt: String,
  status: String,
});
export const CMSSlider = defineModel("CMSSlider", {
  title: String,
  subTitle: String,
  imageUrl: String,
  buttonText: String,
  buttonLink: String,
  order: Number,
  isActive: Boolean,
});
export const CMSSEO = defineModel("CMSSEO", {
  pageName: String,
  titleTag: String,
  metaDescription: String,
  keywords: String,
});
export const Announcement = defineModel("Announcement", {
  title: String,
  content: String,
  priority: String,
  targetAudience: String,
  date: { type: String, default: () => new Date().toLocaleDateString() },
  author: String,
});
export const SMSLog = defineModel("SMSLog", {
  patientName: String,
  phoneNumber: String,
  message: String,
  status: String,
  timestamp: String,
  type: String,
});
export const EmailLog = defineModel("EmailLog", {
  senderEmail: String,
  recipientEmail: String,
  patientName: String,
  subject: String,
  content: String,
  status: String,
  timestamp: String,
  direction: String,
  type: String,
});
export const LabSample = defineModel("LabSample", {
  patientId: String,
  patientName: String,
  testId: String,
  testName: String,
  collectionDate: String,
  status: String,
  result: String,
});
export const RadiologyOrder = defineModel("RadiologyOrder", {
  patientId: String,
  patientName: String,
  type: String,
  bodyPart: String,
  priority: String,
  status: String,
  requestDate: String,
  radiologistNotes: String,
});
export const PharmacyItem = defineModel("PharmacyItem", {
  name: String,
  category: String,
  stock: Number,
  minStockLevel: Number,
  price: Number,
  expiryDate: String,
  supplierId: String,
});
export const EmergencyCase = defineModel("EmergencyCase", {
  patientName: String,
  arrivalType: String,
  priority: String,
  timestamp: String,
  assignedDoctor: String,
  status: String,
});
export const Email = defineModel("Email", {
  senderEmail: String,
  recipientEmail: String,
  patientName: String,
  subject: String,
  content: String,
  status: String,
  timestamp: { type: String, default: () => new Date().toLocaleString() },
  direction: String,
  type: String,
});
export const Invitation = defineModel("Invitation", {
  email: String,
  role: String,
  status: { type: String, default: "Sent" },
  timestamp: String,
});
export const Settings = defineModel("Settings", {
  name: String,
  tagline: String,
  address: String,
  email: String,
  phone: String,
  website: String,
  opdTimings: String,
});
export const EmergencyNumber = defineModel("EmergencyNumber", {
  label: String,
  number: String,
  department: String,
});
export const PaymentGateway = defineModel("PaymentGateway", {
  provider: String,
  merchantId: String,
  status: String,
  methods: Array,
});
export const BackupLog = defineModel("BackupLog", {
  timestamp: String,
  size: String,
  status: String,
  type: String,
});
export const SecuritySetting = defineModel("SecuritySetting", {
  label: String,
  description: String,
  isEnabled: Boolean,
  category: String,
});
export const AccessHistory = defineModel("AccessHistory", {
  patientName: String,
  action: String,
  timestamp: { type: String, default: () => new Date().toLocaleString() },
  device: String,
});
export const CustomReport = defineModel("CustomReport", {
  name: String,
  type: String,
  dateRange: String,
  filters: String,
  createdBy: String,
});
