import { analyticsService } from "./api/analytics/analytics.service";
import { appointmentsService } from "./api/appointments/appointments.service";
import { authService } from "./api/auth/auth.service";
import { billingService } from "./api/billing/billing.service";
import { cmsService } from "./api/cms/cms.service";
import { communicationsService } from "./api/communications/communications.service";
import { dashboardService } from "./api/dashboard/dashboard.service";
import { departmentsService } from "./api/departments/departments.service";
import { doctorsService } from "./api/doctors/doctors.service";
import { emergencyService } from "./api/emergency/emergency.service";
import { insuranceService } from "./api/insurance/insurance.service";
import { laboratoryService } from "./api/laboratory/laboratory.service";
import { patientsService } from "./api/patients/patients.service";
import { pharmacyService } from "./api/pharmacy/pharmacy.service";
import { settingsService } from "./api/settings/settings.service";
import { usersService } from "./api/users/users.service";

export const apiService = Object.assign(
    {},
    authService,
    dashboardService,
    usersService,
    patientsService,
    doctorsService,
    appointmentsService,
    departmentsService,
    billingService,
    laboratoryService,
    pharmacyService,
    insuranceService,
    cmsService,
    communicationsService,
    emergencyService,
    settingsService,
    analyticsService,
);
