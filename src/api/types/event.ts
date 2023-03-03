import { etag as Etag } from "./etag"
import { Reminder } from "./reminder"

export interface InsertParams {
    /**
     * Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. 
     */
    calendarId: string
    /**
     * Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables support for copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. The default is 0. Acceptable values are 0 to 1, inclusive. 
     */
    conferenceDataVersion?: 0 | 1
    /**
     * The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned.
     */
    maxAttendees?: number
    /**
     * Whether to send notifications about the creation of the new event. Note that some emails might still be sent. The default is false. 
     * Acceptable values are:

        `all`: Notifications are sent to all guests.
        
        `externalOnly`: Notifications are sent to non-Google Calendar guests only.
        
        `none`: No notifications are sent. 
     */
    sendUpdates?: "all" | "externalOnly" | "none"
    /**
     * Whether API client performing operation supports event attachments. The default is False.
     */
    supportsAttachments?: boolean
}

export class DateTime {
    /**
         * The date, in the format "yyyy-mm-dd", if this is an all-day event.
         */
    date?: string
    /**
     * The time, as a combined date-time value (formatted according to [RFC3339](https://tools.ietf.org/html/rfc3339)). A time zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string
    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".) For recurring events this field is required and specifies the time zone in which the recurrence is expanded. For single events this field is optional and indicates a custom time zone for the event start/end.
     */
    timeZone?: string

    constructor(date?: string, dateTime?: string, timeZone?: string) {
        this.date = date;
        this.dateTime = dateTime;
        this.timeZone = timeZone;

        // TODO: Validation checks for date formats
    }

    // TODO: Conversion methods, getters/setters for day, month, year, hour, minute, second, etc.
}

export interface InsertBody {
    /**
     * The (exclusive) end time of the event. For a recurring event, this is the end time of the first instance.
     */
    end: DateTime
    /**
     * The (inclusive) start time of the event. For a recurring event, this is the start time of the first instance.
     */
    start: DateTime

    // Optional properties

    attachments?: [{
        /**
         * URL link to the attachment.
         * 
         * For adding Google Drive file attachments use the same format as in alternateLink property of the Files resource in the Drive API.
         * 
         * Required when adding an attachment.
         */
        fileUrl: string
    }]
    /**
     * The attendees of the event. See the [Events with attendees](https://developers.google.com/calendar/concepts/sharing) guide for more information on scheduling events with other calendar users. Service accounts need to use [domain-wide delegation of authority](https://developers.google.com/calendar/auth#perform-g-suite-domain-wide-delegation-of-authority) to populate the attendee list.
     */
    attendees?: [{
        /**
         * Number of additional guests. The default is 0.
         */
        additionalGuests?: number
        /**
         * The attendee's response comment.
         */
        comment?: string
        /**
         * The attendee's name, if available.
         */
        displayName?: string
        /**
         * The attendee's email address, if available. This field must be present when adding an attendee. It must be a valid email address as per [RFC5322](https://tools.ietf.org/html/rfc5322#section-3.4).
         * 
         * Required when adding an attendee.
         */
        email: string
        /**
         * Whether this is an optional attendee. The default is False.
         */
        optional?: boolean
        /**
         *  	Whether the attendee is a resource. Can only be set when the attendee is added to the event for the first time. Subsequent modifications are ignored. The default is False.
         */
        resource?: boolean
        /**
         * The attendee's response status. Possible values are:
         * 
         * `needsAction` - The attendee has not responded to the invitation (recommended for new events).
         * 
         * `declined` - The attendee has declined the invitation.
         * 
         * `tentative` - The attendee has tentatively accepted the invitation.
         * 
         * `accepted` - The attendee has accepted the invitation.
         */
        responseStatus: "needsAction" | "declined" | "tentative" | "accepted"
    }]
    /**
     * The color of the event. This is an ID referring to an entry in the event section of the colors definition (see the [colors endpoint](https://developers.google.com/calendar/v3/reference/colors)).
     */
    colorId?: string
    /**
     * The conference-related information, such as details of a Google Meet conference. To create new conference details use the createRequest field. To persist your changes, remember to set the conferenceDataVersion request parameter to 1 for all event modification requests.
     */
    conferenceData?: any
    /**
     * Description of the event. Can contain HTML.
     */
    description?: string

    extendedProperties?: {
        /**
         * Properties that are private to the copy of the event that appears on this calendar.
         */
        private?: any
        /**
         * Properties that are shared between copies of the event on other attendees' calendars.
         */
        shared?: any
    }
    /**
     * Whether attendees other than the organizer can invite others to the event. The default is True.
     */
    guestsCanInviteOthers?: boolean
    /**
     * Whether attendees other than the organizer can modify the event. The default is False.
     */
    guestsCanModify?: boolean
    /**
     * Whether attendees other than the organizer can see who the event's attendees are. Optional. The default is True.
     */
    guestsCanSeeOtherGuests?: boolean
    /**
     * Opaque identifier of the event. When creating new single or recurring events, you can specify their IDs. Provided IDs must follow these rules:

        characters allowed in the ID are those used in base32hex encoding, i.e. lowercase letters a-v and digits 0-9, see section 3.1.2 in [RFC2938](http://tools.ietf.org/html/rfc2938#section-3.1.2)
        the length of the ID must be between 5 and 1024 characters
        the ID must be unique per calendar

        Due to the globally distributed nature of the system, we cannot guarantee that ID collisions will be detected at event creation time. To minimize the risk of collisions we recommend using an established UUID algorithm such as one described in [RFC4122](https://tools.ietf.org/html/rfc4122).

        If you do not specify an ID, it will be automatically generated by the server.

        Note that the icalUID and the id are not identical and only one of them should be supplied at event creation time. One difference in their semantics is that in recurring events, all occurrences of one event have different ids while they all share the same icalUIDs.
     */
    id?: string
    /**
     * Geographic location of the event as free-form text. 
     */
    location?: string

    originalStartTime?: {
        /**
         * The date, in the format "yyyy-mm-dd", if this is an all-day event.
         */
        date?: string
        /**
         * The time, as a combined date-time value (formatted according to [RFC3339](https://tools.ietf.org/html/rfc3339)). A time zone offset is required unless a time zone is explicitly specified in timeZone.
         */
        dateTime?: string
        /**
         * The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".) For recurring events this field is required and specifies the time zone in which the recurrence is expanded. For single events this field is optional and indicates a custom time zone for the event start/end.
         */
        timeZone?: string
    }
    /**
     * List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in [RFC5545](http://tools.ietf.org/html/rfc5545#section-3.8.5). Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events.
     */
    recurrence?: string[]
    
    reminders?: {
        /**
         * If the event doesn't use the default reminders, this lists the reminders specific to the event, or, if not set, indicates that no reminders are set for this event. The maximum number of override reminders is 5.
         */
        overrides?: Reminder[]
        /**
         * Whether the default reminders of the calendar apply to the event.
         */
        useDefault: boolean
    }
    /**
     * Sequence number as per iCalendar.
     */
    sequence?: number
    
    source?: {
        /**
         * Title of the source; for example a title of a web page or an email subject.
         */
        title: string
        /**
         * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
         */
        source: string
    }

    /**
     * Status of the event. Optional. Possible values are:

        `confirmed` - The event is confirmed. This is the default status.
        
        `tentative` - The event is tentatively confirmed.
        
        `cancelled` - The event is cancelled (deleted). The [list](https://developers.google.com/calendar/v3/reference/events/list) method returns cancelled events only on incremental sync (when syncToken or updatedMin are specified) or if the showDeleted flag is set to true. The [get](https://developers.google.com/calendar/v3/reference/events/get) method always returns them.

        A cancelled status represents two different states depending on the event type:
            Cancelled exceptions of an uncancelled recurring event indicate that this instance should no longer be presented to the user. Clients should store these events for the lifetime of the parent recurring event.

            Cancelled exceptions are only guaranteed to have values for the id, recurringEventId and originalStartTime fields populated. The other fields might be empty.
            All other cancelled events represent deleted events. Clients should remove their locally synced copies. Such cancelled events will eventually disappear, so do not rely on them being available indefinitely.

            Deleted events are only guaranteed to have the id field populated.
        On the organizer's calendar, cancelled events continue to expose event details (summary, location, etc.) so that they can be restored (undeleted). Similarly, the events to which the user was invited and that they manually removed continue to provide details. However, incremental sync requests with showDeleted set to false will not return these details.

        If an event changes its organizer (for example via the [move](https://developers.google.com/calendar/v3/reference/events/move) operation) and the original organizer is not on the attendee list, it will leave behind a cancelled event where only the id field is guaranteed to be populated.
     */
    status?: "confirmed" | "tentative" | "cancelled"
    /**
     * Title of the event
     */
    summary?: string
    /**
     * Whether the event blocks time on the calendar. Optional. Possible values are:

        `opaque` - Default value. The event does block time on the calendar. This is equivalent to setting **Show me** as to **Busy** in the Calendar UI.
        
        `transparent` - The event does not block time on the calendar. This is equivalent to setting **Show me** as to **Available** in the Calendar UI.
     */
    transparency?: "opaque" | "transparent"
    /**
     * Visibility of the event. Optional. Possible values are:

        `default` - Uses the default visibility for events on the calendar. This is the default value.

        `public` - The event is public and event details are visible to all readers of the calendar.
        
        `private` - The event is private and only event attendees may view event details.
        
        `confidential` - The event is private. This value is provided for compatibility reasons.
     */
    visibility?: "default" | "public" | "private" | "confidential"
}

export interface Event {
    kind: "calendar#event"
    etag: Etag
    // TODO: Fill out the rest of the properties from https://developers.google.com/calendar/api/v3/reference/events#resource
}