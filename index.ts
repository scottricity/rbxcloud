import got from "got"

import routes from "./routes.ts"

type Init = {
    apiKey: string;
}

type DSInit = Init&{
    universeId: number|string;
    dataStoreName: string;
}

type ODSInit = DSInit&{
    scope?: string
}

class DataStoreProvider {
    init: DSInit

    constructor (init: DSInit){
        this.init = init
    }

    async listEntries() {
        let init = this.init
        try {
            let request = await routes.datastores.listEntries(init.apiKey, init.universeId, {
                datastoreName: init.dataStoreName
            })
            return request
        } catch (error) {
            throw error   
        }
    }

    async getEntry(key: string) {
        let init = this.init
        try {
            let request = await routes.datastores.getEntry(init.apiKey, init.universeId, {
                datastoreName: init.dataStoreName,
                entryKey: key})
            return request
        } catch (error) {
            throw error
        }
    }
}

class OrderedStoreProvider {
    init: ODSInit

    constructor (init: ODSInit){
        this.init = init
    }

    async list(filter?: string) {
        let init = this.init
        try {
            let request = await routes.orderedstores.list(init.apiKey, init.universeId, {
                orderedDataStore: init.dataStoreName,
                scope: (init.scope ? init.scope : "global"),
                filter: filter
            })
            return request
        } catch (error) {
            throw error
        }
    }
}

class RobloxCloud {
    private init: Init

    constructor (init: Init) {
        this.init = init
    }

    async getServers(placeId: string|number,serverType: number, cursor?: string) {
        let init = this.init
        try {
            let request = await routes.games.servers(placeId, serverType, {limit: 100, cursor: cursor})
            return request
        } catch (error) {
            throw error
        }
    }

    async getStores() {
        let init = this.init
        try {
            let request = await routes.datastores.listDataStores(init.apiKey, 5698198619)
            return request.datastores
        } catch (error) {
            throw error
        }
    }
    
    getStore(universeId: number, name: string) {
        return new DataStoreProvider({apiKey: this.init.apiKey, universeId: universeId, dataStoreName: name})
    }

    getOrderedStore(universeId: number|string, name: string){
        return new OrderedStoreProvider({apiKey: this.init.apiKey, universeId: universeId, dataStoreName: name})
    }

    async publishMessage(universeId: number|string, topic: string, message: string) {
        let init = this.init
        try {
            let request = await routes.messaging.publish(init.apiKey, universeId, topic, message)
            return request
        }catch (err) {
            throw err
        }
    }

    async getInstance(universeId: string|number, placeId: string|number, instanceId: string) {
        let init = this.init
        try {
            let req = await routes.engine.getInstance(init.apiKey, universeId, placeId, instanceId)
            return req
        } catch (error) {
            throw error
        }
    }
}

export default {RobloxCloud, DataStoreProvider, OrderedStoreProvider, routes}
