"use client";

import Image from "next/image";
import React, { useState } from "react";

import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import PasskeyModal from "@/components/PasskeyModal";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";
  const [userData, setIsUserData] = useState({ email: "" });

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}
      {userData && userData?.email && <PasskeyModal userData={userData} />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h10 w-fit"
          />
          <PatientForm setIsUserData={setIsUserData} />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600">
              &copy; 2024 Janji Sehat
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.jpg"
        height={1000}
        width={1000}
        alt="patient-bg"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
