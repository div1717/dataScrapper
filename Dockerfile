# Use the official Node.js image with the specified version
FROM node:16.15.1

# Set the working directory
WORKDIR /dataScrapper

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application files to the working directory
COPY . .

# Expose the port your app runs on (if applicable)
# EXPOSE 3000

# Command to run your application
CMD ["node", "app.js"]
