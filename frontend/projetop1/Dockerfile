FROM node:20-alpine

WORKDIR /app

# Copia manifestos
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Código
COPY . .

ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000

# Next dev escutando $PORT e 0.0.0.0
CMD ["sh","-c","npm run dev -- -p ${PORT:-3000} -H 0.0.0.0"]
