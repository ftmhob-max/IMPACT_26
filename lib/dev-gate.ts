// Front-end helper: gate dev-only seed/content fallbacks to local development.
export function isDevelopmentEnvironment() {
  return process.env.NODE_ENV === "development";
}
