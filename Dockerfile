# 1. Usamos una imagen ligera de Node.js
FROM node:18-slim

# 2. Creamos el directorio de trabajo
WORKDIR /app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install --production

# 5. Copiamos el resto del código (el .gitignore evitará node_modules)
COPY . .

# 6. Exponemos el puerto que usa tu server.js (ejemplo: 3000)
EXPOSE 3000

# 7. Comando para arrancar la app
CMD ["node", "server.js"]