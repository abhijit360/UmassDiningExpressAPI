FROM node:20-alpine

# create the app directory for the container
WORKDIR /app

# installing all the dependencies and to cache them if no changes
COPY package*.json ./

# run to install
RUN npm install 

# bundle the app source
COPY . .

ENV PORT=5000

EXPOSE 5000

CMD ["npm" ,"start"]
