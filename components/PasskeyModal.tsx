"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";
import { getPatientByEmail, login } from "@/lib/actions/patient.action";

interface PatientFormProps {
  userData?: { email: string | undefined };
}

const PasskeyModal: React.FC<PatientFormProps> = ({ userData }) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [passKey, setPassKey] = useState("");
  const [error, setError] = useState("");

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (!userData?.email) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
        setPassKey("");
        setError("");
      }
    } else {
      setOpen(true);
      setPassKey("");
      setError("");
    }
  }, [encryptedKey, userData, router]);

  const closeModal = () => {
    setOpen(false);
    setPassKey("");
    setError("");
  };

  const validatePasskey = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (userData?.email) {
      const response = await login(userData.email);

      if (response.success) {
        if (passKey === response.passcode) {
          const patient = await getPatientByEmail(userData.email);
          if (patient) {
            router.push(`/patients/${patient.userId}/new-appointment`);
            setOpen(false);
            setPassKey("");
            setError("");
          }
        } else {
          setError("Kode verifikasi salah. Silakan coba lagi.");
        }
      } else {
        setError(response.message);
      }
    } else {
      if (passKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        const encryptedKey = encryptKey(passKey);
        localStorage.setItem("accessKey", encryptedKey);
        setOpen(false);
        router.push("/admin");
      } else {
        setError("Kode verifikasi salah. Silakan coba lagi.");
      }
    }
  };

  const handleChange = (value: string) => {
    setPassKey(value);

    if (value === "" || value.length === 0) {
      setError("");
      return;
    }

    if (value.length > 0 && value.length < 6) {
      setError("Kode verifikasi harus 6 digit");
    } else {
      setError("");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            {userData?.email ? "Verifikasi Login" : "Verifikasi Akses Admin"}
            <Image
              src="/assets/icons/close.svg"
              width={20}
              height={20}
              alt="close"
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            {userData?.email
              ? `Masukkan kode verifikasi yang telah dikirim ke ${userData.email}`
              : "Untuk mengakses halaman Admin, tolong masukkan kode verifikasi"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passKey}
            onChange={(value) => handleChange(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
          >
            Masukkan Kode Verifikasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
