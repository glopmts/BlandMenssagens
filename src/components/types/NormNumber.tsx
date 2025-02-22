export function normalizePhoneNumber(phone: string): string {
  let normalizedPhone = phone.replace(/\D/g, "");


  if (normalizedPhone.length === 12) {
    normalizedPhone = "9" + normalizedPhone.slice(2);
  }

  return normalizedPhone;
}
