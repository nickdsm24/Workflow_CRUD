import type { User } from './interfaces.js';

export type CreateUserInput = Omit<User, 'age'>;

export type UpdateUserInput = Partial<Omit<User, 'cpf' | 'age'>>;
