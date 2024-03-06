import models from "./models.json"
import {
    GetDataStoreEntry,
    ListDataStore,
    ListDataStoreEntries,
    ListOrderedStoreEntries
} from "./options.ts"

let baseURL = "https://BASE.roblox.com/"

let routes: any

interface Defaults {
    [t: string]: string | number
}

var withRoute = (route: string, data: string) => {
    return `${baseURL.replace("BASE", route)}${data.replace(/^\//m, "")}`
}

var makeRequest = async (route: string, endpoint: string, data?: { headers?: Headers | {}, body?: any, method?: string }) => {
    try {
        let requestURL = new URL(withRoute(route, endpoint))
        let requestData = new Request(requestURL, data)
        requestData.headers.set("Content-Type", "application/json")
        let request = await fetch(requestData, {body: data.body, method: data.method})
        return requestData.method == "GET" ? request.text() : request.json()
    } catch (error) {
        throw error
    }
}

var buildQuery = (o: object | any, withDefault?: Defaults) => {
    let qR = withDefault ? Object.assign(withDefault, o) : o
    let q = new URLSearchParams(qR)
    if (q.has("filter")) q.set('filter', o.filter)
    return (q && q.size > 0) ? `?${q.toString()}` : ""
}

export default {
    games: {
        ['servers']: async (placeId: string | number, serverType: string | number, query?: { sortOrder?: string | number, excludeFullGames?: boolean, limit?: string | number, cursor?: string }) => {
            let req = await makeRequest('games', `v1/games/${placeId}/servers/${serverType}${buildQuery(query)}`)
            return <typeof models.games.servers> JSON.parse(req)
        }
    },

    datastores: {
        ['listDataStores']: async (apiKey: string, universeId: string | number, options?: ListDataStore) => {
            let req = await makeRequest('apis', `datastores/v1/universes/${universeId}/standard-datastores${buildQuery(options, { limit: 50 })}`, { headers: { "x-api-key": apiKey } })
            return <typeof models.datastores.listDataStores> JSON.parse(req)
        },
        ['listEntries']: async (apiKey: string, universeId: string | number, options: ListDataStoreEntries) => {
            let req = await makeRequest('apis', `datastores/v1/universes/${universeId}/standard-datastores/datastore/entries${buildQuery(options, {limit: 50})}`, { headers: { "x-api-key": apiKey }})
            return <typeof models.datastores.listDataStoreEntries> JSON.parse(req)
        },
        ['getEntry']: async (apiKey: string, universeId: string | number, options: GetDataStoreEntry) => {
            let req = await makeRequest('apis', `datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry${buildQuery(options)}`, { headers: { "x-api-key": apiKey } })
            return <typeof models.datastores.getDataStoreEntry> JSON.parse(req)
        }
    },

    orderedstores: {
        ['list']: async (apiKey: string, universeId: string|number, options: ListOrderedStoreEntries) => {
            let req = await makeRequest('apis', `ordered-data-stores/v1/universes/${universeId}/orderedDataStores/${options.orderedDataStore}/scopes/${options.scope}/entries${buildQuery(options, {scope: "global"})}`, {headers: {"x-api-key": apiKey}})
            return <typeof models.orderedstore.listEntries> JSON.parse(req)
        }
    },

    messaging: {
        ['publish']: async (apiKey: string, universeId: string|number, topic: string, message: string) => {
            let req = await makeRequest('apis', `messaging-service/v1/universes/${universeId}/topics/${topic}`, {headers: {"x-api-key": apiKey}, body: JSON.stringify({message: message}), method: "POST"})
            return req
        }
    },

    engine: {
        ['getInstance']: async (apiKey: string, universeId: string|number, placeId: number|string, instanceId: string) => {
            let req = await makeRequest('apis', `cloud/v2/universes/${universeId}/places/${placeId}/instances/${instanceId}`, {headers: {'x-api-key': apiKey}})
            return <typeof models.engine.getInstance> JSON.parse(req)
        }
    },

    users: {
        ['multiGetUsers']: async (userIds: number[], excludeBannedUsers?: boolean) => {
            let req = await makeRequest('users', 'v1/users', {
                body: {
                    userIds: userIds,
                    excludeBannedUsers: excludeBannedUsers
                },
                method: "POST"
            })
            return <typeof models.users.multiGetUsers> req
        },

        ['getUser']: async (userId: number) => {
            let req = await makeRequest('users', `v1/users/${userId}`)
            return <typeof models.users.userInformation> JSON.parse(req)
        }
    }
}