import type { User } from '../domain/contracts/index.js';

export class UserRepository {
  private users: Map<string, User> = new Map();

  create(user: User): User {
    this.users.set(user.cpf, user);
    return user;
  }

  findByCpf(cpf: string): User | undefined {
    return this.users.get(cpf);
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  update(cpf: string, updatedData: Partial<User>): User | undefined {
    const existingUser = this.findByCpf(cpf);
    if (!existingUser) {
      return undefined;
    }

    const updatedUser = {
      ...existingUser,
      ...updatedData,
    };

    this.users.set(cpf, updatedUser);
    return updatedUser;
  }

  delete(cpf: string): boolean {
    return this.users.delete(cpf);
  }

  clear(): void {
    this.users.clear();
  }
}

export const userRepository = new UserRepository();
