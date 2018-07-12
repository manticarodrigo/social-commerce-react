// import { google } from 'googleapis';

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
// const jwt = new google.auth.JWT(
//     process.env.REACT_APP_GA_CLIENT_EMAIL,
//     null,
//     process.env.REACT_APP_GA_CLIENT_PASSWORD,
//     scopes
// );

export function getData() {
    // const defaults = {
    //     'auth': jwt,
    //     'ids': 'ga:' + process.env.REACT_APP_GA_VIEW_ID,
    // }
    // const response = await jwt.authorize();

    // /* custom code goes here, using `response` */
    // const result = await google.analytics('v3').data.ga.get({
    //     ...defaults,
    //     'start-date': '30daysAgo',
    //     'end-date': 'today',
    //     'metrics': 'ga:itemQuantity,ga:localItemRevenue',
    //     'dimensions': 'ga:productSku,ga:dateHour',
    //     'filters': 'ga:productSku==245'
    // })
    // return result;
}
