import { assertFails, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { FieldValue, setLogLevel, Timestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import path from "path";

export type AddServerTimestamps<T1> = T1 extends { createdAt: Timestamp; updatedAt: Timestamp }
  ? Omit<T1, "createdAt" | "updatedAt"> & { createdAt: FieldValue; updatedAt: FieldValue }
  : never;

export const setDefaultLogLevel = () => setLogLevel("silent");

export const createTestEnvironment = async () => {
  return initializeTestEnvironment({
    projectId: "demo-contently-2c50b-test",
    firestore: {
      rules: readFileSync(path.resolve(__dirname, "./firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
};

export async function expectFirestorePermissionDenied(promise: Promise<unknown>) {
  return new Promise<void>(async (resolve) => {
    const errorResult = await assertFails(promise);
    expect(["permission-denied", "PERMISSION_DENIED"].includes(errorResult.code)).toBe(true);
    resolve(undefined);
  });
}
