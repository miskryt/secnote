FROM node:16
RUN mkdir -p /user/secnote
WORKDIR /user/secnote

COPY . .
RUN npm install --production

EXPOSE 3000

CMD [ "npm", "run" ]