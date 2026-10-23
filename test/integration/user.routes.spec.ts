import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';
import { userRepository } from '../../src/repositories/user.repository.js';

describe('Testes de Integração - Rotas de Usuários (/users)', () => {
  beforeEach(() => {
    // Garante que a base em memória está limpa antes de cada teste
    userRepository.clear();
  });

  describe('POST /users', () => {
    it('deve cadastrar um novo usuário e retornar 201 com a idade calculada', async () => {
      const payload = {
        cpf: '12345678901',
        name: 'Maria Souza',
        birthDate: '2000-01-15',
      };

      const response = await request(app).post('/users').send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('cpf', payload.cpf);
      expect(response.body).toHaveProperty('name', payload.name);
      expect(response.body).toHaveProperty('birthDate', payload.birthDate);
      expect(response.body).toHaveProperty('age');
      expect(typeof response.body.age).toBe('number');
    });

    it('deve retornar 400 se faltarem campos obrigatórios', async () => {
      const payloadIncompleto = {
        cpf: '12345678901',
        // sem nome e sem data de nascimento
      };

      const response = await request(app).post('/users').send(payloadIncompleto);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 409 se tentar cadastrar um CPF já existente', async () => {
      const payload = {
        cpf: '11122233344',
        name: 'Carlos Lima',
        birthDate: '1995-05-20',
      };

      // Primeiro cadastro: sucesso
      await request(app).post('/users').send(payload);

      // Segundo cadastro com mesmo CPF: conflito
      const response = await request(app).post('/users').send(payload);

      expect(response.status).toBe(409);
      expect(response.body.error).toMatch(/CPF já cadastrado/);
    });

    it('deve retornar 400 se a data de nascimento for no futuro', async () => {
      const payloadFuturo = {
        cpf: '99988877766',
        name: 'Viajante do Futuro',
        birthDate: '2099-01-01',
      };

      const response = await request(app).post('/users').send(payloadFuturo);

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/data de nascimento/i);
    });
  });

  describe('GET /users', () => {
    it('deve retornar uma lista vazia quando não houver usuários', async () => {
      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar a lista de todos os usuários cadastrados', async () => {
      await request(app).post('/users').send({
        cpf: '111',
        name: 'User 1',
        birthDate: '1990-01-01',
      });
      await request(app).post('/users').send({
        cpf: '222',
        name: 'User 2',
        birthDate: '1992-02-02',
      });

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].cpf).toBe('111');
      expect(response.body[1].cpf).toBe('222');
    });
  });

  describe('GET /users/:cpf', () => {
    it('deve buscar e retornar o usuário pelo CPF', async () => {
      const user = {
        cpf: '123456',
        name: 'Ana Paula',
        birthDate: '1998-07-10',
      };
      await request(app).post('/users').send(user);

      const response = await request(app).get(`/users/${user.cpf}`);

      expect(response.status).toBe(200);
      expect(response.body.cpf).toBe(user.cpf);
      expect(response.body.name).toBe(user.name);
    });

    it('deve retornar 404 para CPF não encontrado', async () => {
      const response = await request(app).get('/users/cpf-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.error).toMatch(/não encontrado/i);
    });
  });

  describe('PUT /users/:cpf e PATCH /users/:cpf', () => {
    it('deve atualizar o nome e recalcular a idade ao atualizar a data de nascimento', async () => {
      const user = {
        cpf: '55566677788',
        name: 'Pedro Antigo',
        birthDate: '2000-01-01',
      };
      await request(app).post('/users').send(user);

      const updatePayload = {
        name: 'Pedro Atualizado',
        birthDate: '1990-01-01',
      };

      const response = await request(app).put(`/users/${user.cpf}`).send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Pedro Atualizado');
      expect(response.body.birthDate).toBe('1990-01-01');
      expect(response.body.age).toBeGreaterThan(20);
    });

    it('deve atualizar parcialmente com PATCH apenas o nome sem alterar a data', async () => {
      const user = {
        cpf: '77788899900',
        name: 'Lucas Inicial',
        birthDate: '2000-05-10',
      };
      await request(app).post('/users').send(user);

      const response = await request(app)
        .patch(`/users/${user.cpf}`)
        .send({ name: 'Lucas Modificado' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Lucas Modificado');
      expect(response.body.birthDate).toBe(user.birthDate);
    });

    it('deve retornar 404 ao tentar atualizar usuário inexistente', async () => {
      const response = await request(app).put('/users/00000000000').send({ name: 'Não Existe' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /users/:cpf', () => {
    it('deve deletar um usuário existente e retornar 204', async () => {
      const user = {
        cpf: '33344455566',
        name: 'Juliana Silva',
        birthDate: '2001-03-15',
      };
      await request(app).post('/users').send(user);

      const deleteResponse = await request(app).delete(`/users/${user.cpf}`);
      expect(deleteResponse.status).toBe(204);

      // Confere se realmente foi deletado
      const getResponse = await request(app).get(`/users/${user.cpf}`);
      expect(getResponse.status).toBe(404);
    });

    it('deve retornar 404 ao tentar deletar um usuário inexistente', async () => {
      const response = await request(app).delete('/users/cpf-inexistente');

      expect(response.status).toBe(404);
    });
  });
});
