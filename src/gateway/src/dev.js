import fastify from "fastify";
import cors from '@fastify/cors';

const server = fastify({
  logger: true,
});

server.register(cors, {
  origin: "*",
});

await server.register(import("./app/index.js"));

server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err !== null) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});