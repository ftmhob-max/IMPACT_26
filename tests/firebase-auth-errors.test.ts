import test from "node:test";
import assert from "node:assert/strict";

import { AuthFlowError, buildGoogleSignInError } from "@/lib/firebase/auth";

test("buildGoogleSignInError annotates unauthorized domain failures with the active host", () => {
  const error = buildGoogleSignInError(
    {
      code: "auth/unauthorized-domain",
      message: "Firebase: Error (auth/unauthorized-domain).",
    },
    "127.0.0.1"
  );

  assert.ok(error instanceof AuthFlowError);
  assert.equal(error.kind, "provider");
  assert.equal(error.code, "auth/unauthorized-domain");
  assert.equal(error.host, "127.0.0.1");
  assert.match(error.message, /127\.0\.0\.1/);
});

test("buildGoogleSignInError preserves other Firebase provider failures", () => {
  const providerFailure = new Error("The popup was closed before completing sign in.") as Error & { code?: string };
  providerFailure.code = "auth/popup-closed-by-user";
  const error = buildGoogleSignInError(providerFailure, "localhost");

  assert.equal(error.kind, "provider");
  assert.equal(error.code, "auth/popup-closed-by-user");
  assert.equal(error.host, "localhost");
  assert.equal(error.message, "The popup was closed before completing sign in.");
});
