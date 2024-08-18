# Use the official Node.js image as the base image
FROM node:19-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json yarn.lock ./

# Install the project dependencies
RUN yarn install
RUN yarn global add ts-node

# Copy the rest of the application code to the working directory
COPY . .

# RUN yarn migration:show

# Expose the port on which the app will run
# EXPOSE 3000

# Start the application
# CMD ["npm", "run", "dev"]
