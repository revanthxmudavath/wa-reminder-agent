FROM node:22-slim

# Install Chromium (Debian Bookworm apt — no snap, lands at /usr/bin/chromium)
RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to skip its own Chrome download and use the system one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

EXPOSE 3000
CMD ["node", "src/index.js"]
