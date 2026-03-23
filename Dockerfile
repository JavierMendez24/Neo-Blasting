# Usamos la versión completa de Node 18 (basada en Debian Bookworm)
FROM node:18-bookworm

# Instalamos herramientas de compilación para que sqlite3 se compile bien
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# Forzamos la recompilación de sqlite3 dentro del contenedor
RUN npm install --build-from-source sqlite3
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]