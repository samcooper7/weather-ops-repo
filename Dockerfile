FROM node:22-slim
WORKDIR /app
COPY package*.json
RUN npm ci
COPY . .
ENV PORT=5010
EXPOSE 5010
CMD ["node", "app.js"]
