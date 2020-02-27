// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  firebaseConfig: {
    apiKey: 'AIzaSyDCo6jnn2pbiXmRIpoDCgysJ7XWP38MJi4',
    authDomain: 'jean-subtitle-editor.firebaseapp.com',
    databaseURL: 'https://jean-subtitle-editor.firebaseio.com',
    projectId: 'jean-subtitle-editor',
    storageBucket: 'jean-subtitle-editor.appspot.com',
    messagingSenderId: '440951111450',
    appId: '1:440951111450:web:05db1d97cf7773f7b936a3',
    measurementId: 'G-0NXMB8NBQ2'
  },
  googleAPIKey: 'AIzaSyD-UaCYKoMx8etVNrsYEr2hrep44vu5BgI',
  version: require('../../package.json').version,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
