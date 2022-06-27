FROM node:16
RUN mkdir -p /user/secnote
WORKDIR /user/secnote

COPY . .
RUN npm install

EXPOSE 80

CMD [ "npm", "run", "pm2" ]