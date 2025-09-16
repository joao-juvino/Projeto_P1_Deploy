FROM node:20-alpine

WORKDIR /app

# deps
COPY package*.json ./
RUN npm ci

# código
COPY . .

ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000

# Render injeta $PORT. "-H 0.0.0.0" é obrigatório no container.
CMD ["sh","-c","npm run dev -- -p ${PORT:-3000} -H 0.0.0.0"]
