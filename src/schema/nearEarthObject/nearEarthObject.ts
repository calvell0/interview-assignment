import { NearEarthObjectFeed } from "../../../.mesh";
import { NEOFeedArgs } from "../address/types";


export const getNEOFeed = (parent: any, args: NEOFeedArgs, context: any, info: any): NearEarthObjectFeed => {
    console.info('getNEOFeed', 'Enter resolver');
    console.info(info);
    return context['NasaNEO'].Query.nearEarthObjects({ context, info, args });
}