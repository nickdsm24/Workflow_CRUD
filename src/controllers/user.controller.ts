import type { Request, Response } from 'express';
import { calculateAge } from '../domain/calculate-age.js';
import type { CreateUserInput, UpdateUserInput, User } from '../domain/contracts/index.js';
import { userRepository } from '../repositories/user.repository.js';

export function createUser(req: Request, res: Response) {
  try {
    const { cpf, name, birthDate }: CreateUserInput = req.body;

    if (!cpf || !name || !birthDate) {
      return res.status(400).json({ error: 'CPF, nome e data de nascimento são obrigatórios' });
    }

    const userExists = userRepository.findByCpf(cpf);
    if (userExists) {
      return res.status(409).json({ error: 'Usuário com este CPF já cadastrado' });
    }

    let age: number;
    try {
      age = calculateAge(birthDate);
    } catch (validationError: unknown) {
      const message =
        validationError instanceof Error ? validationError.message : 'Data de nascimento inválida';
      return res.status(400).json({ error: message });
    }

    const newUser: User = {
      cpf,
      name,
      birthDate,
      age,
    };

    userRepository.create(newUser);
    return res.status(201).json(newUser);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno do servidor';
    return res.status(500).json({ error: message });
  }
}

export function findAllUsers(_req: Request, res: Response) {
  try {
    const users = userRepository.findAll();
    return res.status(200).json(users);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno do servidor';
    return res.status(500).json({ error: message });
  }
}

export function findUserByCpf(req: Request<{ cpf: string }>, res: Response) {
  try {
    const { cpf } = req.params;
    const user = userRepository.findByCpf(cpf);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno do servidor';
    return res.status(500).json({ error: message });
  }
}

export function updateUser(req: Request<{ cpf: string }>, res: Response) {
  try {
    const { cpf } = req.params;
    const { name, birthDate }: UpdateUserInput = req.body;

    const existingUser = userRepository.findByCpf(cpf);
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const updatedFields: Partial<User> = {};

    if (name) {
      updatedFields.name = name;
    }

    if (birthDate) {
      try {
        updatedFields.birthDate = birthDate;
        updatedFields.age = calculateAge(birthDate);
      } catch (validationError: unknown) {
        const message =
          validationError instanceof Error
            ? validationError.message
            : 'Data de nascimento inválida';
        return res.status(400).json({ error: message });
      }
    }

    const updatedUser = userRepository.update(cpf, updatedFields);
    return res.status(200).json(updatedUser);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno do servidor';
    return res.status(500).json({ error: message });
  }
}

export function deleteUser(req: Request<{ cpf: string }>, res: Response) {
  try {
    const { cpf } = req.params;
    const deleted = userRepository.delete(cpf);

    if (!deleted) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno do servidor';
    return res.status(500).json({ error: message });
  }
}

export const userController = {
  createUser,
  findAllUsers,
  findUserByCpf,
  updateUser,
  deleteUser,
};
