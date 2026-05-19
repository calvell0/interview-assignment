import { createYoga } from 'graphql-yoga';
import { buildHTTPExecutor, HeadersConfig } from '@graphql-tools/executor-http';
import { genSchema } from '../src/schema';
import plugins from '../src/envelop/index';
import { getBuiltMesh } from '../.mesh'

console.profile = jest.fn();
const schema = genSchema();


const yoga = createYoga({ schema, plugins, context: async (initialContext) => {
  const mesh = await getBuiltMesh();
  const enveloped = mesh.getEnveloped(initialContext);
  return enveloped.contextFactory();
}});

export const executor = buildHTTPExecutor({
  fetch: yoga.fetch,
  headers: { client: "test"}
});

// for testing header-based validation
export const getExecutorWithHeaders = (headers: HeadersConfig) => {
  return buildHTTPExecutor({
    fetch: yoga.fetch,
    headers: headers
  });
}
