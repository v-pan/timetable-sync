# Timetable sync
A small browser extension to read a student's timetable from an Azure site and automatically add those entries as events on their Google calendar.

## Dev setup
A correctly setup Google cloud application is required.
    1. The steps [here](https://developers.google.com/calendar/api/quickstart/js#enable_the_api) were followed. 
    2. A `keys.ts` file was created exporting two variables, `CLIENT_ID` and `API_KEY`. This could be done with js or json as well.
    3. The browser's redirect URL needs to be added to the list of authorised redirect URLs. This setting can be found in the OAuth credentials.
    4. In testing mode, the email of the account being used to test needs to be added to the list of test users. This setting can be found in the OAuth Consent Screen page.

To setup the dev environment, run `yarn install` (or the equivalent in your preferred package manager).
A dev server can then be started with `yarn start`.