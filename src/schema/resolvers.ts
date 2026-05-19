import { getAddress, createAddress } from "./address/address";
import { Address, Args, CreateAddressArgs, NEOFeedArgs } from "./address/types";
import { NearEarthObjectFeed } from "../../.mesh";
import { getNEOFeed } from "./nearEarthObject/nearEarthObject";

export const resolvers = {
  Query: {
    address: (parent: any, args: Args, context: any, info: any): Address => {
      return getAddress(parent, args, context);
    },
    nearEarthObjects: (parent: any, args: NEOFeedArgs, context: any, info: any): NearEarthObjectFeed => {
      return getNEOFeed(parent, args, context, info);
    }
  },
  Mutation: {
    createAddress: (parent: any, args: CreateAddressArgs, context: any, info: any): Address => {
      return createAddress(parent, args, context);
    }
  },
  NearEarthObjectFeed: {
    objects: (parent: any, args: any, context: any) => {
      return Object.values(parent.nearEarthObjects);
    }
  }
};
