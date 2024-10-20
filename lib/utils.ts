import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatDateTime = (
  dateString: Date | string,
  timeZone: string = "Asia/Jakarta" // Zona waktu Indonesia
) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // nama bulan singkat (contoh: 'Okt')
    day: "numeric", // angka hari dalam bulan (contoh: '25')
    year: "numeric", // angka tahun (contoh: '2023')
    hour: "numeric", // angka jam (contoh: '8')
    minute: "numeric", // angka menit (contoh: '30')
    hour12: false, // menggunakan format 24 jam
    timeZone: timeZone, // gunakan zona waktu yang disediakan
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // nama hari singkat (contoh: 'Sen')
    year: "numeric", // angka tahun (contoh: '2023')
    month: "2-digit", // bulan dalam dua digit (contoh: '10')
    day: "2-digit", // angka hari dalam dua digit (contoh: '25')
    timeZone: timeZone, // gunakan zona waktu yang disediakan
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // nama bulan singkat (contoh: 'Okt')
    year: "numeric", // angka tahun (contoh: '2023')
    day: "numeric", // angka hari (contoh: '25')
    timeZone: timeZone, // gunakan zona waktu yang disediakan
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // angka jam (contoh: '8')
    minute: "numeric", // angka menit (contoh: '30')
    hour12: false, // menggunakan format 24 jam
    timeZone: timeZone, // gunakan zona waktu yang disediakan
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "id-ID", // format dalam bahasa Indonesia
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "id-ID", // format dalam bahasa Indonesia
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "id-ID", // format dalam bahasa Indonesia
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "id-ID", // format dalam bahasa Indonesia
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
