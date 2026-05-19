import { handleStreamOrSingleExecutionResult, type Plugin } from '@envelop/core';
import { ContextType } from '../types';

export const appendRequestId = (): Plugin<ContextType> => {
  return {
    onExecute({ args, context }){
        return {
            onExecuteDone(payload){
                return handleStreamOrSingleExecutionResult(payload, ({ result, setResult }) => {
                    const extendedResult = {
                        ...result,
                        metadata:{
                            requestId: context.requestId
                        }
                    }
                    setResult(extendedResult);
                })
            }
        }
    }
  };
};
