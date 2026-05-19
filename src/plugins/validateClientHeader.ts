import { getOperationAST, GraphQLError } from 'graphql'
import { Plugin } from 'graphql-yoga'
import { ContextType } from '../types'
 
export const validateClient = (): Plugin<ContextType> => {
  return {
    onRequest({ request, fetchAPI, endResponse }) {
      if (!request.headers.get('client')) {
        endResponse(
          new fetchAPI.Response(null, {
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          })
        )
      }
    },
    onExecute({ args, setResultAndStopExecution }){
        const client = args.contextValue.request.headers.get('client');
        const operation = getOperationAST(args.document)?.operation;
        if (!operation) throw new GraphQLError("Could not determine operation");

        if (client === "strata" && operation === 'mutation'){
            setResultAndStopExecution({
                errors: [new GraphQLError("Mutations are not permitted if client is strata")]
            })
        }
    }
  }
}