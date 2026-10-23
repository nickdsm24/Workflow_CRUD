import { describe, expect, it } from 'vitest';
import { calculateAge } from '../../src/domain/calculate-age.js';

describe('calculateAge', () => {
  it('deve calcular a idade corretamente quando o aniversário já passou no ano', () => {
    const birthDate = new Date('2000-01-15');
    const referenceDate = new Date('2026-10-22');

    const age = calculateAge(birthDate, referenceDate);

    expect(age).toBe(26);
  });

  it('deve calcular a idade corretamente quando o aniversário ainda não chegou no ano', () => {
    const birthDate = new Date('2000-12-25');
    const referenceDate = new Date('2026-10-22');

    const age = calculateAge(birthDate, referenceDate);

    expect(age).toBe(25);
  });

  it('deve calcular a idade corretamente no dia exato do aniversário', () => {
    const birthDate = new Date('2000-10-22');
    const referenceDate = new Date('2026-10-22');

    const age = calculateAge(birthDate, referenceDate);

    expect(age).toBe(26);
  });

  it('deve lançar um erro caso a data de nascimento seja no futuro', () => {
    const birthDate = new Date('2030-10-22');
    const referenceDate = new Date('2026-10-22');

    expect(() => calculateAge(birthDate, referenceDate)).toThrowError(
      'A data de nascimento não pode ser posterior à data atual',
    );
  });
});
