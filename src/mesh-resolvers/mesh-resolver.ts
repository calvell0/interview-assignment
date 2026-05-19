import { NearEarthObjectFeed } from "../../.mesh";

module.exports = {
    resolvers:{
        NearEarthObjectFeed: {
            objects: {
                resolve: (root: any, args: any, context: any) => {
                    context.logger.info("Attempting to resolve NEO objects ")
                    return Object.values(root.near_earth_objects);
                }
            }
        }
    }

}