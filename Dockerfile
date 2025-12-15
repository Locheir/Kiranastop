# Using Official Node image
FROM node:18-alpine

# Create app directory 
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Dependencies
RUN npm ci --omit=dev

# Copy the rest of the project
COPY . .

# Expose the port (your app probably runs on 3000)
EXPOSE 3000

# Start the server
CMD ["node", "app.js"]