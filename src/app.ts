import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { userRoutes } from './routes/user.routes.js';

export const app = express();

app.use(express.json());

// Serve os arquivos estáticos do frontend (public/index.html)
app.use(express.static('public'));

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve('src/docs/swagger.json'), 'utf-8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', userRoutes);
