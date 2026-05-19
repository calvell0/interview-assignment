import { createServer } from 'node:http';
import { genSchema } from './schema';
import { createYoga } from 'graphql-yoga';
import { getBuiltMesh } from '../.mesh';


import plugins from './envelop';


const yogaPort = 4000;

(async () => {
  const schema = await genSchema();
  const mesh = await getBuiltMesh();
  
  
  
  const yoga = createYoga({ schema, plugins: plugins, context: async (initialContext) => {
    const enveloped = mesh.getEnveloped(initialContext);
    return enveloped.contextFactory();
  }});
  const server = createServer(yoga);

  server.listen(yogaPort, () => {
    console.log(`Server is listening at http://localhost:${yogaPort}/graphql`);
  });
})();
