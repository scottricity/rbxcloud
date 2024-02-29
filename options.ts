export type ListDataStore = {
    cursor?: string;
    limit?: number|string;
    prefix?: string;
}

export type ListDataStoreEntries = {
    datastoreName: string;
    scope?: string;
    allScope?: boolean;
    prefix?: string;
    cursor?: string;
    limit?: number|string
}

export type GetDataStoreEntry = {
    datastoreName: string;
    entryKey: string,
    scope?: string
}

export type ListOrderedStoreEntries = {
    orderedDataStore: string;
    scope: string;
    max_page_size?: number;
    page_token?: string;
    order_by?: string;
    filter?: string;
}