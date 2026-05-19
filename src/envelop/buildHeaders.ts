import type { Plugin } from '@envelop/core';
import { v4 as uuid } from 'uuid';
import { ContextType } from '../types';

export const buildHeaders = (): Plugin<ContextType> => {
  return {
    onParse({ extendContext, context }) {
      const requestId = uuid();
      // we can assert a truthy value here since the client header was already validated earlier
      const client = context.request.headers.get('client')!; 
      extendContext({ requestId: requestId, client:  client }); 
    },
  };
};
