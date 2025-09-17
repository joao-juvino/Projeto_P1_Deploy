# frontend/projetop1/Dockerfile
FROM node:20-alpine

# Evita telemetria do Next e deixa tudo previsível
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Copia os manifestos e instala deps (usa o lockfile)
COPY package*.json ./
RUN npm ci --no-audit --fund=false

# Copia o restante do código do front
COPY . .

# Rodando em modo dev (forçando sem build)
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Importante: escutar exatamente a $PORT definida pelo Vercel
CMD ["sh","-c","npm run dev -- -H ${HOST} -p ${PORT:-3000}"]
