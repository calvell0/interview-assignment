import * as addressTable from '../../../data/addresses.json';
import { Addresses, Address, Args, CreateAddressArgs } from './types';
import { GraphQLError } from 'graphql';
import fs from 'node:fs';

const DATA_FILENAME = './data/addresses.json'

const readAddresses = (): Addresses => {
  const addressFile = fs.readFileSync(DATA_FILENAME, 'utf-8');
  return JSON.parse(addressFile);
}

const _getAddress = (username: string): Address | null => {
  return readAddresses()[username];
};

export const getAddress = (_: any, args: Args, context: any): Address => {
  context.logger.info('getAddress', 'Enter resolver');
  const address = _getAddress(args.username);
  if (address) {
    context.logger.info('getAddress', 'Returning address');
    return address;
  }
  context.logger.error('getAddress', 'No address found');
  throw new GraphQLError('No address found in getAddress resolver');
};

export const createAddress = (_: any, args: CreateAddressArgs, context: any): Address => {
  context.logger.info('createAddress', 'Enter resolver');
  const { username, input } = args;
  
  const addresses = readAddresses();
  if (addresses[username]) throw new GraphQLError("User already has an address");

  addresses[username] = input;
  fs.writeFileSync(DATA_FILENAME, JSON.stringify(addresses));
  return addresses[username]; // normally a database would return the updated object so i re-read from the addresses object instead
}
