# Timetable sync
A small browser extension to read a student's timetable from an Azure site and automatically add those entries as events on their Google calendar.

## Dev setup
A correctly setup Google cloud application is required.
  1. Follow the steps [here](https://developers.google.com/calendar/api/quickstart/js#enable_the_api) to create the cloud application. 
  2. A `keys.ts` file was created exporting two variables, `CLIENT_ID` and `API_KEY`. This could be done with js or json as well.
  3. The extensions's redirect URL needs to be added to the list of authorised redirect URLs. This redirect URL is derived from the extension id, and can be obtained from the error details from attempting to request with an invalid redirect URI. The list of accepted redirect URLs can be changed in the OAuth credentials page of the cloud application settings.
  4. In testing mode, the email of the account being used to test needs to be added to the list of test users. This setting can be found in the OAuth Consent Screen page.

To setup the dev environment, run `yarn install` (or the equivalent in your preferred package manager).
A dev server can then be started with `yarn start`, after which you can load the temporary extension onto the browser.
The dev server will automatically reload the plugin as you save.