export const GenderOptions = ["Laki-Laki", "Perempuan"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Laki-Laki" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Akte Kelahiran",
  "SIM (Surat Izin Mengemudi)",
  "Kartu/Polis Asuransi Kesehatan",
  "Kartu Identitas Militer",
  "KTP (Kartu Tanda Penduduk)",
  "Paspor",
  "Kartu Izin Tinggal Tetap (KITAP)",
  "Kartu Jaminan Sosial",
  "Kartu Identitas Negara Bagian",
  "Kartu Pelajar",
  "Kartu Pemilih",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "dr. Budi Santoso",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "dr. Leila Andini",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "dr. David Pratama",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "dr. Evan Widodo",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "dr. Jane Kusuma",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "dr. Alex Siregar",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "dr. Jasmine Lestari",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "dr. Alyana Putri",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "dr. Hardik Wijaya",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
