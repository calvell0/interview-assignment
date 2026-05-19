import { Plugin, useEngine } from '@envelop/core';
import { parse, validate, specifiedRules, execute, subscribe } from 'graphql';
import { useParserCache } from '@envelop/parser-cache';
import { useValidationCache } from '@envelop/validation-cache';
import { buildHeaders } from './buildHeaders';
import { useLogger } from './useLogger';
import { ContextType } from '../types';
import { validateClient } from '../plugins/validateClientHeader';
import { appendRequestId } from './appendRequestId';

const plugins: Plugin<ContextType>[] = [
  validateClient() as Plugin<ContextType>,
  useEngine({ parse, validate, specifiedRules, execute, subscribe }) as Plugin<ContextType>,
  buildHeaders(),
  useLogger(),
  useParserCache() as Plugin<ContextType>,
  useValidationCache() as Plugin<ContextType>,
  appendRequestId(),
];

export default plugins;
