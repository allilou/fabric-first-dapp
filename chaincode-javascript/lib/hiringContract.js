/*
 * Ali BENAHMED DAHO
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class HiringContract extends Contract {

    async InitLedger(ctx) {
        const hires = [
            {
                ID: 'hire1',
                ConsultantName: 'name1',
                HiringOrganization : 'org1',
                Duration: 3,
            },
            {
                ID: 'hire2',
                ConsultantName: 'name2',
                HiringOrganization : 'org2',
                Duration: 3,
            },
        ];

        for (const hire of hires) {
            hire.docType = 'hire';
            await ctx.stub.putState(hire.ID, Buffer.from(JSON.stringify(hire)));
            console.info(`HiringContract ${hire.ID} initialized`);
        }
    }

    // CreateHiringContract issues a new hire to the world state with given details.
    async CreateHiringContract(ctx, id, consultantName, hiringOrganization, duration) {
        const hire = {
            ID: id,
            ConsultantName: consultantName,
            HiringOrganization : hiringOrganization,
            Duration: duration,
    };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(hire)));
        return JSON.stringify(hire);
    }

    // ReadHiringContract returns the hire stored in the world state with given id.
    async ReadHiringContract(ctx, id) {
        const hireJSON = await ctx.stub.getState(id); // get the hire from chaincode state
        if (!hireJSON || hireJSON.length === 0) {
            throw new Error(`The hire ${id} does not exist`);
        }
        return hireJSON.toString();
    }

    // UpdateHiringContract updates an existing hire in the world state with provided parameters.
    async UpdateHiringContract(ctx, id, consultantName, hiringOrganization, duration) {
        const exists = await this.HiringContractExists(ctx, id);
        if (!exists) {
            throw new Error(`The hire ${id} does not exist`);
        }

        // overwriting original hire with new hire
        const updatedHiringContract = {
            ID: id,
            ConsultantName: consultantName,
            HiringOrganization : hiringOrganization,
            Duration: duration,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedHiringContract)));
    }

    // DeleteHiringContract deletes an given hire from the world state.
    async DeleteHiringContract(ctx, id) {
        const exists = await this.HiringContractExists(ctx, id);
        if (!exists) {
            throw new Error(`The hire ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // HiringContractExists returns true when hire with given ID exists in world state.
    async HiringContractExists(ctx, id) {
        const hireJSON = await ctx.stub.getState(id);
        return hireJSON && hireJSON.length > 0;
    }

    // TransferHiringContract updates the owner field of hire with given id in the world state.
    // async TransferHiringContract(ctx, id, newOwner) {
    //     const hireString = await this.ReadHiringContract(ctx, id);
    //     const hire = JSON.parse(hireString);
    //     hire.Owner = newOwner;
    //     return ctx.stub.putState(id, Buffer.from(JSON.stringify(hire)));
    // }

    // GetAllHiringContracts returns all hires found in the world state.
    async GetAllHiringContracts(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all hires in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


}

module.exports = HiringContract;
