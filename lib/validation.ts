import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Nama harus memiliki setidaknya 2 karakter")
    .max(50, "Nama tidak boleh lebih dari 50 karakter"),
  email: z.string().email("Alamat email tidak valid"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Nomor telepon tidak valid"
    ),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Nama harus memiliki setidaknya 2 karakter")
    .max(50, "Nama tidak boleh lebih dari 50 karakter"),
  email: z.string().email("Alamat email tidak valid"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Nomor telepon tidak valid"
    ),
  birthDate: z.coerce.date(),
  gender: z.enum(["Laki-Laki", "Perempuan"]),
  address: z
    .string()
    .min(5, "Alamat harus memiliki setidaknya 5 karakter")
    .max(500, "Alamat tidak boleh lebih dari 500 karakter"),
  occupation: z
    .string()
    .min(2, "Pekerjaan harus memiliki setidaknya 2 karakter")
    .max(500, "Pekerjaan tidak boleh lebih dari 500 karakter"),
  emergencyContactName: z
    .string()
    .min(2, "Nama kontak darurat harus memiliki setidaknya 2 karakter")
    .max(50, "Nama kontak darurat tidak boleh lebih dari 50 karakter"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Nomor telepon tidak valid"
    ),
  primaryPhysician: z.string().min(2, "Pilih setidaknya satu dokter utama"),
  insuranceProvider: z
    .string()
    .min(2, "Nama asuransi harus memiliki setidaknya 2 karakter")
    .max(50, "Nama asuransi tidak boleh lebih dari 50 karakter"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Nomor polis harus memiliki setidaknya 2 karakter")
    .max(50, "Nomor polis tidak boleh lebih dari 50 karakter"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message:
        "Anda harus memberikan persetujuan untuk perawatan agar dapat melanjutkan",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message:
        "Anda harus memberikan persetujuan untuk pengungkapan agar dapat melanjutkan",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message:
        "Anda harus memberikan persetujuan privasi agar dapat melanjutkan",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Pilih setidaknya satu dokter"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Alasan harus memiliki setidaknya 2 karakter")
    .max(500, "Alasan tidak boleh lebih dari 500 karakter"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Pilih setidaknya satu dokter"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Pilih setidaknya satu dokter"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Alasan harus memiliki setidaknya 2 karakter")
    .max(500, "Alasan tidak boleh lebih dari 500 karakter"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
