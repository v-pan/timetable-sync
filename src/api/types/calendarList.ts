import { etag } from "./etag";
import { Reminder } from "./reminder";

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
    /**
     * Type of the collection
     */
    kind: string
    /**
     * ETag of the collection.
     */
    etag: string
    /**
     * Token used to access the next page of this result. Omitted if no further results are available, in which case nextSyncToken is provided.
     */
    nextPageToken?: string,
    /**
     * Token used at a later point in time to retrieve only the entries that have changed since this result was returned. Omitted if further results are available, in which case nextPageToken is provided.
     */
    nextSyncToken?: string,
    /**
     * Calendars that are present on the user's calendar list.
     */
    items: CalendarListEntry[]
}

export interface CalendarListEntry {
    /**
     * Type of the resource
     */
    readonly kind: "calendar#calendarListEntry",
    /**
     * ETag of the resource.
     */
    readonly etag: etag,
    /**
     * Identifier of the calendar.
     */
    readonly id: string,
    /**
     * Title of the calendar.
     */
    summary: string,
    /**
     * Description of the calendar.
     */
    readonly description: string,
    /**
     * Geographic location of the calendar as free-form text.
     */
    readonly location?: string,
    /**
     * The time zone of the calendar.
     */
    readonly timeZone?: string,
    /**
     * The summary that the authenticated user has set for this calendar.
     */
    summaryOverride?: string,
    /**
     * The color of the calendar. This is an ID referring to an entry in the calendar section of the colors definition. This property is superseded by the backgroundColor and foregroundColor properties and can be ignored when using these properties.
     */
    colorId?: string,
    /**
     * The main color of the calendar in the hexadecimal format "#0088aa". This property supersedes the index-based colorId property.
     */
    backgroundColor?: string,
    /**
     * The foreground color of the calendar in the hexadecimal format "#ffffff". This property supersedes the index-based colorId property.
     */
    foregroundColor?: string,
    /**
     * Whether the calendar has been hidden from the list. The attribute is only returned when the calendar is hidden, in which case the value is true.
     */
    hidden?: true,
    /**
     * Whether the calendar content shows up in the calendar UI. The default is False.
     */
    selected?: boolean,
    /**
     * The effective access role that the authenticated user has on the calendar.
     */
    readonly accessRole: "freeBusyReader" | "owner" | "reader" | "writer",
    /**
     * The default reminders that the authenticated user has for this calendar.
     */
    defaultReminders: Reminder[],
    /**
     * The notifications that the authenticated user is receiving for this calendar.
     */
    notificationSettings: {
        /**
         * The list of notifications set for this calendar.
         */
        readonly notifications: [
            {
                /**
                 * The type of notification.  Required when adding a notification.
                 */
                type: "eventCreation" | "eventChange" | "eventCancellation" | "eventResponse" | "agenda",
                /**
                 * The method used to deliver the notification. Required when adding a notification.
                 */
                method: "email"
            }
        ]
    },
    /**
     * Whether the calendar is the primary calendar of the authenticated user. The default is False.
     */
    readonly primary?: boolean,
    /**
     * Whether this calendar list entry has been deleted from the calendar list. The default is False.
     */
    readonly deleted?: boolean,
    /**
     * Conferencing properties for this calendar, for example what types of conferences are allowed.
     */
    readonly conferenceProperties: {
        /**
         * The types of conference solutions that are supported for this calendar. 
         */
      readonly allowedConferenceSolutionTypes?: [
        "eventHangout" | "eventNamedHangout" | "hangoutsMeet"
      ]
    }
}