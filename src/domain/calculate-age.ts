export function calculateAge(birthDateInput: Date | string, referenceDate = new Date()): number {
  const birthDate = new Date(birthDateInput);

  if (birthDate > referenceDate) {
    throw new Error('A data de nascimento não pode ser posterior à data atual');
  }

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
