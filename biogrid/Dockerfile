FROM node:14

# Install the necessary CLI packages
RUN npm install -g @nrwl/cli

WORKDIR /usr/src/repo

COPY package.json .

# Install all required packages for build
RUN npm install --ignore-scripts

# Copy in the necessary files for tsoa
COPY apps apps
COPY tsconfig.json .

# Build tsoa 
RUN npm run build:tsoa

COPY babel.config.json .
COPY nx.json .
COPY workspace.json .

COPY libs libs
COPY tools tools

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
