export type AuthFlowErrorKind = "provider" | "session";

type AuthFlowErrorOptions = {
  code?: string;
  cause?: unknown;
  host?: string;
};

export class AuthFlowError extends Error {
  kind: AuthFlowErrorKind;
  code?: string;
  cause?: unknown;
  host?: string;

  constructor(kind: AuthFlowErrorKind, message: string, options?: AuthFlowErrorOptions) {
    super(message);
    this.name = "AuthFlowError";
    this.kind = kind;
    this.code = options?.code;
    this.cause = options?.cause;
    this.host = options?.host;
  }
}

function getCurrentHost(): string | undefined {
  return typeof window !== "undefined" ? window.location.hostname : undefined;
}

function getErrorCode(err: unknown): string | undefined {
  return typeof err === "object" && err !== null && "code" in err && typeof err.code === "string"
    ? err.code
    : undefined;
}

export function buildGoogleSignInError(err: unknown, host = getCurrentHost()): AuthFlowError {
  const code = getErrorCode(err);

  if (code === "auth/unauthorized-domain") {
    const hostLabel = host ? ` for ${host}` : "";
    return new AuthFlowError(
      "provider",
      `Google sign-in is not authorized in Firebase Auth${hostLabel}.`,
      { code, cause: err, host }
    );
  }

  return new AuthFlowError(
    "provider",
    err instanceof Error ? err.message : "Google sign-in failed",
    { code, cause: err, host }
  );
}
