"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./client";

type AuthFlowErrorKind = "provider" | "session";

export class AuthFlowError extends Error {
  kind: AuthFlowErrorKind;
  code?: string;
  cause?: unknown;

  constructor(kind: AuthFlowErrorKind, message: string, options?: { code?: string; cause?: unknown }) {
    super(message);
    this.name = "AuthFlowError";
    this.kind = kind;
    this.code = options?.code;
    this.cause = options?.cause;
  }
}

async function syncSession(idToken: string, fullName?: string | null): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/auth/sync-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ fullName }),
    });
  } catch (err) {
    throw new AuthFlowError("session", "We signed you in, but could not reach the app session service.", {
      code: "session/network-error",
      cause: err,
    });
  }

  if (response.ok) return;

  const payload = await response.json().catch(() => ({}));
  const message =
    typeof payload?.error === "string" && payload.error.length > 0
      ? payload.error
      : "We signed you in, but could not start your app session.";
  const stage = typeof payload?.stage === "string" ? payload.stage : undefined;

  throw new AuthFlowError("session", message, {
    code: stage ? `session/${stage}` : "session/sync-failed",
  });
}

export async function completeAppSignIn(user: User): Promise<User> {
  const idToken = await user.getIdToken(true);
  await syncSession(idToken, user.displayName);
  return user;
}

export async function signUp(email: string, password: string, fullName: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: fullName });
  const idToken = await credential.user.getIdToken(true);
  await syncSession(idToken, fullName);
  return credential.user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  let credential: UserCredential;
  try {
    credential = await signInWithPopup(auth, provider);
  } catch (err: any) {
    console.error("[Firebase Auth] Google popup sign-in failed:", err?.code, err?.message);
    throw new AuthFlowError(
      "provider",
      err instanceof Error ? err.message : "Google sign-in failed",
      { code: err?.code, cause: err },
    );
  }
  return completeAppSignIn(credential.user);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
