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

# Install open api for combined both back and front end
RUN npm install @openapitools/openapi-generator-cli -g

# Install open api for combined both back and front end
# RUN npm install @openapitools/openapi-generator-cli -g

# Copy in the necessary files for tsoa
COPY biogrid/apps apps
COPY biogrid/tsconfig.json .

# ENV PORT=8080

COPY biogrid/babel.config.json biogrid/nx.json biogrid/workspace.json ./

# copy all the other dependent files
COPY biogrid/libs libs
COPY biogrid/tools tools

# Build tsoa 
RUN npm run build:tsoa

# Make output directories for api and frontend
RUN mkdir -p /usr/src/repo/dist/apps/biogrid-mvp
RUN mkdir -p /usr/src/repo/dist/apps/api
RUN mkdir -p /usr/src/repo/apps/biogrid-mvp/src/app/dist

# Build production instances of the mvp
# Nx seg faults after building, so an or statement negates the issue
RUN npm run build-api-client
RUN nx build api --prod || echo 'continuing'
RUN nx build biogrid-mvp --prod || echo 'continuing'

# Remove dev deps
# TODO: Pruning removes the node_modules and everything. This is going to be fixed
# RUN npm prune --production

EXPOSE 8080

CMD ["node", "dist/apps/api/main.js"]
