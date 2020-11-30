import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

async function handleRequests(req: FastifyRequest, res: FastifyReply) {
  return res.send({ response: 'v1 api!' });
}

export default (server: FastifyInstance, opts: any, done: any): void => {
  server.get('/test', handleRequests);
  done();
};
