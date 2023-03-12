export interface IdentityResponse {
    /**
     * Email
     */
    "NameIdentifier": string,
    /**
     * Real name
     */
    "Name": string,
    /**
     * Student email
     */
    "Email": string,
    "AvatarUri": null,
    "InstitutionIdentity": string,
    "InstitutionName": string,
    /**
     * UUIDs for requesting resources.
     */
    "ResourceIdentities": string[],
    "Roles": string[],
    /**
     * Has info on registration, undergrad, multi-factor authentication
     */
    "Groups": string[],
    /**
     * Has info like being part of the "All Students" group
     */
    "UserGroups": [{
        "Identity": string,
        "Name": string
    }],
    /**
     * Locale, was en-US
     */
    "UserLanguage": string,
    "UserTimeZone": "",
    "NotificationsEnabled": false,
    "NotificationsEmail": string, // TODO: See if we can make requests to edit user data?
    /**
     * Was ["PB"]
     */
    "Scopes": string[],
    "VisibleStatuses": [],
    "ActivityManagerIncludeOccurrencesOutsideDateFilter": boolean,
    "ActivityManagerIsTableCompact": boolean,
    "ActivityManagerIsTableExpanded": boolean,
    "ActivityManagerIsManageStatusesCompact": boolean,
    /**
     * Was null
     */
    "ImportExportPermissions": any,
    "CanViewMyPermissions": boolean
}

export interface ViewOptionsResponse {
    /**
     * One of these has description "All Day"
     */
    "TimePeriods": [
        {
            "Description": string,
            "StartTime": string,
            "EndTime": string,
            "IsDefault": false
        }
    ]
    /**
     * Index 0 has the description "All Year", there's also "Semester 1" and "Semester 2". Is lacking the Weeks property when making requests
     */
    "DatePeriods": [{
        "Description": string,
        /**
         * ISO String
         */
        "StartDateTime": string,
        /**
         * ISO String
         */
        "EndDateTime": string,
        "IsDefault": boolean,
        /**
         * Was null
         */
        "Type": any
    }]

    "Weeks" : [{
        "WeekNumber": number,
        "WeekLabel": string,
        /**
         * ISO String
         */
        "FirstDayInWeek": string
    }]
    "Days": [{
        /**
         * Monday, Tuesday, etc...
         */
        "Name": string,
        /**
         * Starts from 0
         */
        "DayOfWeek": number,
        /**
         * Was false
         */
        "IsDefault": boolean
    }]
    /**
     * Was [{ "Name": "Lec", "DisplayName": "Lecture", "Icon": "pattern-19" }]
     */
    "LegendItems": [{
        "Name": string,
        "DisplayName": string,
        "Icon": string
    }]
}

export interface EventResponse {
    BookingRequests: null
    CategoryRequests: null
    PersonalEvents: {
        Results: [{
            /**
             * Same as personal identity
             */
            Identity: string
            ResourceEvents: [{
                BookingInfo: null
                Description: string
                /**
                 * ISO String
                 */
                EndDateTime: string
                EventIdentity: string
                EventType: string
                ExtraProperties: []
                HostKey: string
                Identity: string
                IsBooking: boolean
                IsDeleted: boolean
                IsEdtied: boolean
                IsPublished: boolean
                LastModified: string
                Location: string
                Name: string
                Owner: string
                ParentKey: null
                ResourceInfo: null
                Source: null
                /**
                 * ISO String
                 */
                StartDateTime: string
                Status: string
                StatusBackgroundColour: string
                StatusIdentity: string
                StatusName: null
                StatusTextColor: string
                UserManuallyAddedEvent: boolean
            }]
        }]
    }
}