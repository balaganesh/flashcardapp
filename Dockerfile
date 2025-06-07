# Use the official Node.js LTS image
FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]