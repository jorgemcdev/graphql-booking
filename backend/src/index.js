import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import session from 'express-session';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

const RedisStore = require('connect-redis')(session);

require('dotenv').config();

const {
  PORT, NODE_ENV,
  DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME,
  REDIS_HOST, REDIS_PORT, REDIS_PASSWORD,
  SESSION_ISREDIS, SESSION_NAME, SESSION_SECRET, SESSION_LIFETIME,
} = process.env;

const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      { useNewUrlParser: true },
    );

    const app = express();

    app.disable('x-powered-by');

    const store = new RedisStore({
      host: REDIS_HOST,
      port: REDIS_PORT,
      pass: REDIS_PASSWORD,
      no_ready_check: true
    });

    let options = {
      name: SESSION_NAME,
      secret: SESSION_SECRET,
      resave: true,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        maxAge: parseInt(SESSION_LIFETIME, 10),
        sameSite: true,
        secure: NODE_ENV === 'production'
      }
    };

    if (SESSION_ISREDIS === '1') {
      options = { ...options, store };
    } else {
      options = { ...options, session };
    }

    app.use(session(options));

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cors: false,
      playground: NODE_ENV === 'production' ? false : { settings: { 'request.credentials': 'include' } },
      context: ({ req, res }) => ({ req, res })
    });

    server.applyMiddleware({ app, cors: false });

    app.listen({ port: PORT }, () => console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`));
  } catch (e) {
    console.log('Error DB', e);
  }
};

startServer();
