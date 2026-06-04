export function isDevAdminFlowEnabled() {
  return process.env.EXPO_PUBLIC_ENABLE_DEV_ADMIN_FLOW === "true";
}
