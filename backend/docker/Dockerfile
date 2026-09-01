FROM node:22-alpine

WORKDIR /soul-backend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN chown -R node:node /soul-backend

USER node

EXPOSE 8000

CMD ["npm", "start"]