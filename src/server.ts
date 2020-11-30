import fastify from 'fastify';
import { toFinite } from 'lodash';
import { resolve } from 'path';

import routeV1 from './server/route/v1';
import routeV2 from './server/route/v2';

const server = fastify();

// Plugins
server.register(require('fastify-compress'), { threshold: 0 });
server.register(require('fastify-static'), { root: resolve(__dirname, 'public') });

// Routes
server.register(routeV1, { prefix: '/v1' }); // http://localhost:3000/v1/test
server.register(routeV2, { prefix: '/v2' }); // http://localhost:3000/v2/test

// Public Route
server.get('/', (req, res: any) => res.sendFile('index.html'));

// Start Server
const PORT = toFinite(process.env.PORT) || 3000;

server.listen(PORT, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
