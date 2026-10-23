import express, { type Request, type Response } from 'express';
import { calculateAge } from './domain/calculate-age.js';
import type { CreateUserInput, UpdateUserInput, User } from './domain/contracts/index.js';
import { userRepository } from './repositories/user.repository.js';

export const app = express();

app.use(express.json());

app.post('/users', (req: Request, res: Response) => {
  const { cpf, name, birthDate }: CreateUserInput = req.body;

  if (!cpf || !name || !birthDate) {
    return res.status(400).json({ error: 'CPF, nome e data de nascimento são obrigatórios ' });
  }
  const userExists = userRepository.findByCpf(cpf);
  if (userExists) {
    return res.status(409).json({ error: 'Usuário com este CPF já cadastrado ' });
  }

  try {
    const age = calculateAge(birthDate);

    const newUser: User = {
      cpf,
      name,
      birthDate,
      age,
    };

    userRepository.create(newUser);
    return res.status(201).json(newUser);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao processar data';
    return res.status(400).json({ error: message });
  }
});

app.get('/users', (_req: Request, res: Response) => {
  const users = userRepository.findAll();
  return res.status(200).json(users);
});

app.get('/users/:cpf', (req: Request<{ cpf: string }>, res: Response) => {
  const { cpf } = req.params;
  const user = userRepository.findByCpf(cpf);

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado ' });
  }

  return res.status(200).json(user);
});

const handleUpdate = (req: Request<{ cpf: string }>, res: Response) => {
  const { cpf } = req.params;
  const { name, birthDate }: UpdateUserInput = req.body;

  const existingUser = userRepository.findByCpf(cpf);
  if (!existingUser) {
    return res.status(404).json({ error: 'Usuário não encontrado ' });
  }

  const updatedFields: Partial<User> = {};

  if (name) {
    updatedFields.name = name;
  }

  if (birthDate) {
    try {
      updatedFields.birthDate = birthDate;
      updatedFields.age = calculateAge(birthDate);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao processo data';
      return res.status(400).json({ error: message });
    }
  }

  const updatedUser = userRepository.update(cpf, updatedFields);
  return res.status(200).json(updatedUser);
};

app.put('/users/:cpf', handleUpdate);
app.patch('/users/:cpf', handleUpdate);

app.delete('/users/:cpf', (req: Request<{ cpf: string }>, res: Response) => {
  const { cpf } = req.params;
  const deleted = userRepository.delete(cpf);

  if (!deleted) {
    return res.status(404).json({ error: 'Usuário não encontrado ' });
  }

  return res.status(204).send();
});
