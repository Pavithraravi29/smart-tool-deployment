# Build stage
FROM node:14 as build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install missing FontAwesome dependencies
RUN npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

# Install @babel/plugin-proposal-private-property-in-object to address the warning
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copy the rest of the application code
COPY . ./

# Build the application
RUN npm run build

# Production stage
FROM node:14-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]