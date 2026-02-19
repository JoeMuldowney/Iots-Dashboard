# Build stage
FROM node:18 as build
WORKDIR /app
COPY package-lock.json ./
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Creates the folder Nginx uses for temporary client requests
RUN mkdir -p /var/cache/nginx/client_temp \
    # Changes ownership of these folders to the nginx user and group.
    && chown -R nginx:nginx /var/cache/nginx /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx as non-root user
USER nginx

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]