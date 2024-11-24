"use server";

import { ID, Query } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  AUTH_SESSION_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

import { InputFile } from "node-appwrite/file";
import { sendEmail } from "./appointment.action";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", userId)]
    );
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getPatientByEmail = async (email: string) => {
  try {
    const patient = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("email", email)]
    );

    if (patient.documents.length > 0) {
      return parseStringify(patient.documents[0]);
    } else {
      console.log("Pasien dengan email ini tidak ditemukan.");
      return null;
    }
  } catch (error) {
    console.log("Terjadi kesalahan saat mencari pasien:", error);
    return null;
  }
};

function generatePasscode() {
  let passcode = "";
  for (let i = 0; i < 6; i++) {
    passcode += Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
  }
  return passcode;
}

export const sendLoginPasscode = async (email: string) => {
  try {
    const existingUser = await users.list([Query.equal("email", [email])]);

    if (existingUser.total === 0) {
      throw new Error("Email not registered");
    }

    const userId = existingUser.users[0].$id;
    const passcode = generatePasscode();
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const existingSessionData = await databases.listDocuments(
      DATABASE_ID!,
      AUTH_SESSION_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    if (existingSessionData.total > 0) {
      const sessionId = existingSessionData.documents[0].$id;
      await databases.updateDocument(
        DATABASE_ID!,
        AUTH_SESSION_COLLECTION_ID!,
        sessionId,
        {
          passcode,
          expiredAt,
        }
      );
    } else {
      await databases.createDocument(
        DATABASE_ID!,
        AUTH_SESSION_COLLECTION_ID!,
        ID.unique(),
        {
          userId,
          email,
          passcode,
          expiredAt,
        }
      );
    }

    await sendEmail(
      userId,
      "Authentikasi Login Janji Temu",
      `Passcode Login Anda adalah: ${passcode}`
    );

    return { success: true, message: "Passcode sent to your email" };
  } catch (error) {
    console.error("Error sending passcode:", error);
    throw error;
  }
};

export const login = async (email: string) => {
  try {
    const authSessionDoc = await databases
      .listDocuments(process.env.DATABASE_ID!, AUTH_SESSION_COLLECTION_ID!, [
        Query.equal("email", [email]),
      ])
      .then((response) => response.documents[0]);

    if (!authSessionDoc) {
      return {
        success: false,
        message: "Tidak ditemukan sesi login untuk email ini.",
      };
    }

    const { passcode: storedPasscode, expiresAt } = authSessionDoc;

    const isExpired = new Date(expiresAt) < new Date();

    if (isExpired) {
      return {
        success: false,
        message: "Passcode sudah kedaluwarsa. Silakan coba lagi.",
      };
    }

    return {
      success: true,
      message: "Passcode valid",
      passcode: storedPasscode,
    };
  } catch (error) {
    console.error("Error saat login:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat login. Silakan coba lagi.",
    };
  }
};
