export const formatPhoneNumber = (phone: string) => {
  if (!phone) return 'No number';
  const phoneNumber = phone.replace(/\D/g, '');
  if (phoneNumber.length >= 11) {
    return `+55 (${phoneNumber.substring(2, 4)}) ${phoneNumber.substring(4, 6)}${phoneNumber.substring(6, 11)}`;
  }

  return phone;
};
