FROM node:15
WORKDIR /app
COPY package.json /app
RUN npm install

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

COPY . ./
ENV PORT 3000
EXPOSE 3000
CMD ["node", "index.js"]