# Usar a imagem oficial do Node.js
FROM node:18

# Definir diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código para dentro do container
COPY . .

# Expor a porta
EXPOSE 3002

# Rodar o servidor
CMD ["node", "index.js"]