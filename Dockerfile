# Usa la imagen base de Node.js

FROM node:14



# Establece el directorio de trabajo

WORKDIR /app



# Copia el package.json y el package-lock.json

COPY package*.json ./



# Instala las dependencias

RUN npm install



# Copia el resto de la aplicación

COPY . .



# Construye la aplicación para producción

RUN npm run build



# Usa la imagen base de Nginx para servir la aplicación

FROM nginx:alpine



# Copia los archivos de construcción al directorio de Nginx

COPY --from=0 /app/build /usr/share/nginx/html



# Exponer el puerto 80

EXPOSE 80



# Comando para ejecutar Nginx

CMD ["nginx", "-g", "daemon off;"]