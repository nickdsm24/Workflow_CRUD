# Imagem base oficial leve do Node.js
FROM node:22-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de manifesto de dependências
COPY package*.json ./

# Instala todas as dependências
RUN npm install

# Copia o código-fonte da aplicação
COPY . .

# Expõe a porta 3000 onde a API roda
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]