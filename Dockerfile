FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production
ENV HUGO_DEVICE_HOST=0.0.0.0
ENV HUGO_DEVICE_PORT=8787

COPY package.json .env.example ./
COPY data ./data
COPY prompts ./prompts
COPY scripts ./scripts
COPY memory ./memory

RUN mkdir -p /app/.hugo /app/memory && chown -R node:node /app
USER node
EXPOSE 8787
CMD ["node", "scripts/hugo-start.js"]
