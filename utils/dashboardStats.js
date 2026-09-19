import mongoose from "mongoose";

export const getAggregatedStats = async () => {
  const Appointment = mongoose.model("Appointment");
  const Patient = mongoose.model("Patient");
  const EmergencyCase = mongoose.model("EmergencyCase");
  const Doctor = mongoose.model("Doctor");
  const Invoice = mongoose.model("Invoice");
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
    Invoice.find().sort({ date: -1 }).limit(30),
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
      totalRevenue,
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
