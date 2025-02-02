# Use the official Node.js image as a base
FROM node:22.13.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 50051

# Command to run the application
CMD ["node", "src/server.js"]