# Build stage
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
# Use a lightweight Node.js-based server to serve the frontend
FROM node:14-alpine
WORKDIR /app

# Install 'serve' to serve static files
RUN npm install -g serve

# Copy build files from the build stage
COPY --from=build /app/build /app

# Expose port 3000
EXPOSE 3000

# Start the application using 'serve'
CMD ["serve", "-s", ".", "-l", "3000"]
