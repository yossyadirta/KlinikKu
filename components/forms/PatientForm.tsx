"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { UserFormValidation, UserLoginFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, sendLoginPasscode } from "@/lib/actions/patient.action";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface PatientFormProps {
  setIsUserData: React.Dispatch<React.SetStateAction<{ email: string }>>;
}

const PatientForm: React.FC<PatientFormProps> = ({ setIsUserData }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const form = useForm<
    z.infer<typeof UserFormValidation | typeof UserLoginFormValidation>
  >({
    resolver: zodResolver(
      isLogin ? UserLoginFormValidation : UserFormValidation
    ),
    defaultValues: isLogin ? { email: "" } : { name: "", email: "", phone: "" },
  });

  async function onSubmit(
    data: z.infer<typeof UserFormValidation | typeof UserLoginFormValidation>
  ) {
    setIsLoading(true);

    if (isLogin) {
      try {
        await sendLoginPasscode(data.email);
        if (setIsUserData) {
          setIsUserData({
            email: data.email,
          });
        }
      } catch (error) {
        console.log("Login failed:", error);
      }
    } else {
      try {
        const userData = {
          name: (data as z.infer<typeof UserFormValidation>).name,
          email: data.email,
          phone: (data as z.infer<typeof UserFormValidation>).phone,
        };

        const user = await createUser(userData);

        if (user) {
          router.push(`/patients/${user.$id}/register`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">
            {isLogin ? "Selamat Datang Kembali," : "Selamat Datang,"}
          </h1>
          <p className="text-dark-700">
            {isLogin
              ? "Masukkan email Anda untuk login"
              : "Jadwalkan Janji Temu Kesehatan Pertama Anda"}
          </p>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="johndoe@example.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        {!isLogin && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="name"
              label="Nama Lengkap"
              placeholder="John Doe"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="phone"
              label="Nomor Telepon"
              placeholder="(555) 123-4567"
            />
          </>
        )}

        <SubmitButton isLoading={isLoading}>
          {isLogin ? "Login" : "Daftar"}
        </SubmitButton>

        <div className="text-center mt-4">
          <p className="text-sm text-dark-700">
            {isLogin ? (
              <>
                Belum memiliki akun?{" "}
                <button
                  type="button"
                  className="text-green-500  underline-offset-4 hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Daftar sekarang
                </button>
              </>
            ) : (
              <>
                Sudah memiliki akun?{" "}
                <button
                  type="button"
                  className="text-green-500  underline-offset-4 hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Login sekarang
                </button>
              </>
            )}
          </p>
        </div>
      </form>
    </Form>
  );
};

export default PatientForm;
