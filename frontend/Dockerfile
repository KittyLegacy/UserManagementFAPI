# Base image for building the React app
FROM node:18.3 AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy app files
COPY . .

# Build the app
RUN npm run build

# Production environment
FROM nginx:1.21-alpine AS production-stage

# Copy build output to NGINX
COPY --from=build-stage /app/build /usr/share/nginx/html

# Remove default NGINX configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d

# Expose port
EXPOSE 3000

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
