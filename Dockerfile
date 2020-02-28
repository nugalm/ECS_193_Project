# Install version 12 for node
FROM node:12

# Creates the directory + subdirectories
RUN mkdir -p /usr/src/app

# Set as the current working directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /usr/src/app/

# Runs the command and installs the dependencies
RUN npm install

# Copies the entire local directory
COPY . /usr/src/app

# Exposes what port the container will listen on
EXPOSE 8080

# Executes the container
CMD [ "npm", "start" ]
