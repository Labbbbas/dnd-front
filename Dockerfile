# Use a base Node.js image with Alpine Linux for a lightweight environment
FROM node:22.11.0-alpine3.20

# Install 'curl' for health checks
RUN apk add --no-cache curl

# Create a non-root group and user named 'dnd' with ID 1001
RUN addgroup -g 1001 dnd && adduser -D -u 1001 -G dnd dnd

# Set the working directory inside the container
WORKDIR /app

# Copy the package configuration files
COPY --chown=dnd package*.json ./

# Install production dependencies and allow legacy peer dependency resolution
RUN npm install --only=production --legacy-peer-deps

# Copy all application files to the container
COPY --chown=dnd . .

# Set environment variables needed for the application
ENV NODE_ENV=production
ENV PORT=3000

# Switch to the non-root user 'dnd' for better security
USER dnd

# Expose port 3000 so the application is accessible
EXPOSE 3000

# Configure a health check to verify the application is running
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:3000 || exit 1

# Command to start the application
CMD ["npm", "run", "dev"]
