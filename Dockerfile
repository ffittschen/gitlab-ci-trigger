FROM node:7

RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs

USER nodejs

# Create app directory
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

# Install app dependencies
COPY package.json /home/nodejs/app/
RUN yarn install

# Bundle app source
COPY dist /home/nodejs/app

EXPOSE 3000
CMD ["node", "index.js"]