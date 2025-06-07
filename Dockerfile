# Stage 1: The Build Stage (using Node.js)
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# IMPORTANT: Handle the API Key at build time
# The VITE_API_KEY must be available here to be bundled into the static files.
# We will pass this in from the cloudbuild.yaml file.
ARG VITE_API_KEY
ENV VITE_API_KEY=$VITE_API_KEY

# Run the build script to create the 'dist' folder
RUN npm run build


# Stage 2: The Serve Stage (using Nginx)
FROM nginx:1.25-alpine

# Copy the static files from the build stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will run on (matches our nginx.conf)
EXPOSE 8080

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]
