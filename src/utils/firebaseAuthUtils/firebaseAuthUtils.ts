import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const createFirebaseUser = async (p: {
  auth: Auth;
  userEmail: string;
  userPassword: string;
}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      p.auth,
      p.userEmail,
      p.userPassword,
    );

    const user = userCredential.user;
    if (!user) throw new Error("user has not been created");
    return { success: true, data: user } as const;
  } catch (e) {
    const err = e as { code?: string; message?: string };
    const message = !!err.code ? err.code : err.message;
    return { success: false, error: { message } } as const;
  }
};
export const loginFirebaseUser = async (p: {
  auth: Auth;
  userEmail: string;
  userPassword: string;
}) => {
  try {
    const userCredential = await signInWithEmailAndPassword(p.auth, p.userEmail, p.userPassword);

    const user = userCredential.user;
    if (!user) throw new Error("user login unsuccessful");
    return { success: true, data: user } as const;
  } catch (e) {
    const err = e as { code?: string; message?: string };
    const message = !!err.code ? err.code : err.message;
    return { success: false, error: { message } } as const;
  }
};

export const logoutFirebaseUser = async (p: { auth: Auth }) => {
  try {
    await signOut(p.auth);
    return { success: true } as const;
  } catch (e) {
    const message = (e as { message?: string }).message;
    return { success: false, error: { message } } as const;
  }
};
