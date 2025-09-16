FROM node:20-alpine

WORKDIR /app

# Copia manifestos
COPY package*.json ./

# Usa npm ci se houver package-lock.json; senão, npm install
# --legacy-peer-deps ajuda a evitar conflito de peer deps em dev
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps ; \
    else \
      npm install --legacy-peer-deps ; \
    fi

# Código
COPY . .

ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000

# Next dev escutando $PORT e 0.0.0.0
CMD ["sh","-c","npm run dev -- -p ${PORT:-3000} -H 0.0.0.0"]
