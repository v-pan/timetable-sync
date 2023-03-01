export interface ListParams {
    /**
     * Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries.
     */
    maxResults?: number,
    /**
     * The minimum access role for the user in the returned entries. The default is no restriction.
     * 
     * Acceptable values are:

        `freeBusyReader`: The user can read free/busy information.

        `owner`: The user can read and modify events and access control lists.

        `reader`: The user can read events that are not private.

        `writer`: The user can read and modify events.

     */
    minAccessRole?: "freeBusyReader" | "owner" | "reader" | "writer",
    /**
     * Token specifying which result page to return.
     */
    pageToken?: string,
    /**
     * Whether to include deleted calendar list entries in the result. The default is False.
     */
    showDeleted?: boolean,
    /**
     * Whether to show hidden entries. The default is False. 
     */
    showHidden?: boolean,
    /**
     * Token obtained from the `nextSyncToken` field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then.
     */
    syncToken?: string
}

export interface CalendarList {
    kind: string
    etag: string

}