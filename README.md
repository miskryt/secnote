# secnote
A test privnote-like node.js application with purpouse just to get started in field of Node.js.\

The application allows user to create an encrypted notes that will self-destruct after being read by another user.

How to start:

Development mode:
```
docker compose up -d\
&& npm install --save\
&& npm run migrate\
&& npm run dev
```

Production mode:
```
npm install --save\
&& npm run migrate\
&& npm run start
```

