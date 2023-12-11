# # Use the official Node.js image with the specified version
# FROM node:16.15.1

# # Set the working directory
# WORKDIR /dataScrapper

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install application dependencies
# RUN npm install

# # Copy the application files to the working directory
# COPY . .

# # Expose the port your app runs on (if applicable)
# # EXPOSE 3000

# # Command to run your application
# CMD ["node", "app.js"]


FROM ghcr.io/puppeteer/puppeteer:21.6.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "app.js" ]