FROM timbru31/java-node:11

# Make a working directory
WORKDIR /usr/src/repo

# Install the necessary CLI packages
RUN npm install -g @nrwl/cli

# Install app dependencies
# COPY both package.json AND package-lock.json
COPY biogrid/package*.json ./

# Install all required packages for build
RUN npm install --ignore-scripts

# Copy in the necessary files for tsoa
COPY biogrid/apps apps
COPY biogrid/tsconfig.json .

# Build tsoa 
RUN npm run build:tsoa

COPY biogrid/babel.config.json .
COPY biogrid/nx.json .
COPY biogrid/workspace.json .

COPY biogrid/libs libs
COPY biogrid/tools tools

# Build production instances of the mvp
# Nx seg faults after building, so an or statement negates the issue
RUN nx build biogrid-mvp --prod || echo 'continuing'
RUN nx build api --prod || echo 'continuing'

# Remove dev deps
RUN npm prune --production

RUN chmod 777 /usr/local/bin/docker-entrypoint.sh \
  && ln -s /usr/local/bin/docker-entrypoint.sh 
EXPOSE 8080

CMD ["node", "dist/apps/api/main.js"]
