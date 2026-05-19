import { describe, test, expect } from '@jest/globals';
import { ExecutionResult, parse } from 'graphql';
import { executor, getExecutorWithHeaders } from '../executor';
import fs from 'node:fs';
import { createAddress } from '../../src/schema/address/address';


// need a custom type since we add requestId to the result obj
type ResultWithMetadata = ExecutionResult & {metadata: { requestId: string }} 

const DATA_FILENAME = './data/addresses.json'

describe('getAddress', () => {
  test('Success', async () => {
    const query = `
            query GetAddress($username: String!) {
                address(username: $username) {
                    street
                    city
                    zipcode
                }
            }
        `;

    const variables = { username: 'jack' };

    const result = await executor({
      document: parse(query),
      variables,
    }) as ResultWithMetadata;

    expect(result).toEqual(
      expect.objectContaining({
      "data": {
        "address": {
          street: '123 Street St.',
          city: 'Sometown',
          zipcode: '43215',
        }
      }
    }));

    expect(result.metadata?.requestId).toBeTruthy();


    const strataHeaderExecutor = getExecutorWithHeaders({ client: "strata" });
    const result2 = await strataHeaderExecutor({
      document: parse(query),
      variables,
    }) as ResultWithMetadata;

    expect(result2).toEqual(
      expect.objectContaining({
      "data": {
        "address": {
          street: '123 Street St.',
          city: 'Sometown',
          zipcode: '43215',
        }
      }
    }));

  });

  test('Error', async () => {
    const query = `
            query GetAddress($username: String!) {
                address(username: $username) {
                    street
                    city
                    zipcode
                }
            }
        `;

    const variables = { username: 'john' };

    const result = await executor({
      document: parse(query),
      variables,
    });
    
    expect(result).toEqual(
    expect.objectContaining(
      {
        "errors": expect.arrayContaining([expect.objectContaining({
          "message": "No address found in getAddress resolver"
        })])
      }
    )
    );
  });
});


describe("createAddress", () => {
  test("Success", async () => {
    const query = `
    mutation CreateAddress($username: String!, $input: AddressInput!) {
      createAddress(username: $username, input: $input){ 
        street
        city
        zipcode
        state
      }
    }`

    // manual cleanup of test data so multiple runs still pass, this is obviously not ideal in a real system
    const file = fs.readFileSync(DATA_FILENAME, 'utf-8');
    const addresses = JSON.parse(file);
    if (addresses["matt"]) {
      delete addresses.matt;
      fs.writeFileSync(DATA_FILENAME, JSON.stringify(addresses));
    }

    const variables = { username: "matt", input: { street: "1000 W Elm St", city: "Charlotte", state: "NC", zipcode: "28203" }}

    const result = await executor({
      document: parse(query),
      variables
    });

    expect(result).toEqual(expect.objectContaining(
      {
        data: { 
          createAddress: 
            { 
              street: "1000 W Elm St",
              city: "Charlotte",
              state: "NC",
              zipcode: "28203" 
            }
          }
        }
    ));
  });

  test("Error", async() => {

    const query = `
    mutation CreateAddress($username: String!, $input: AddressInput!) {
      createAddress(username: $username, input: $input){ 
        street
        city
        zipcode
        state
      }
    }`;

    const variables = { username: "matt", input: { street: "1000 W Elm St", city: "Charlotte", state: "NC", zipcode: "28203" }}


    const result = await executor({
      document: parse(query),
      variables
    });

    const strataHeaderExecutor = getExecutorWithHeaders({ client: "strata" });

    const strataResult = await strataHeaderExecutor({
      document: parse(query),
      variables
    });

    expect(result).toEqual(expect.objectContaining(
      {
        data: {
          createAddress: null
        },
        errors: expect.arrayContaining([
          expect.objectContaining({ message: "User already has an address" })
        ])
      }
    ));

    expect(strataResult).toEqual(expect.objectContaining(
      {
        errors: expect.arrayContaining([
          expect.objectContaining({ message: "Mutations are not permitted if client is strata" })
        ])
      }
    ));
  })
});

describe("getNEOFeed", () => {
  test('Success', async () => {
    const query = `
            query GetNEOs($startDate: String!, $endDate: String!) {
                nearEarthObjects(startDate: $startDate, endDate: $endDate) {
                  elementCount
                  objects {
                    id
                    name
                    isPotentiallyHazardousAsteroid
                    estimatedDiameterMinKm
                    estimatedDiameterMaxKm
                    closeApproachDate
                    relativeVelocityKph
                    missDistanceKm
                  }
                }
            }
        `;

    const variables = { startDate: '2015-09-07', endDate: '2015-09-08' };

    const result = await executor({
      document: parse(query),
      variables,
    }) as ResultWithMetadata;

    // console.log(result);
    expect(result?.data?.nearEarthObjects).toBeTruthy();

  });
})
