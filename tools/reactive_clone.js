// const aku = require("CurrentUserInitialData").USER_ID
// const myHeaders = new Headers();
// myHeaders.append('content-type','application/x-www-form-urlencoded');
// const data_payloads = {
//     'fb_api_caller_class': 'RelayModern',
//     'fb_api_req_friendly_name': 'useFXVerifyReauthQuery',
//     'variables': `{"target_userid":"${aku}","device_id":"device_id_fetch_datr","account_type":"FACEBOOK","node_id":"REACTIVATION","web_auth":null,"reauth_initiator_flow":"NATIVE_PASSWORD_ENTRY_START","encrypted_password":{"sensitive_string_value":"#PWD_BROWSER:5:1759939039:AXZQACS/F1bKNzipn0nuFS3gl0UTjJSVJT3KWiGSMyuZ21tWoO6IUjFv3GYbYcGfGTJ7vRatuL2hXxFW+t9EZwFvrI2umSTFnIazbeJ/y65fxaeuN4iHsZrHc+GxOtS0iqUzYVEQkgIoycI2CZYa"},"use_fxcal_reauth_cadam":true,"reauth_content_type":null}`,
//     'server_timestamps': 'true',
//     'doc_id': '9039782136148253',
//     ...require('getAsyncParams')('POST')
// };
// const requestOptions = {
//     headers: myHeaders,
//     method: "POST",
//     body: new URLSearchParams(data_payloads)
// };

// fetch("/api/graphql/", requestOptions).then(async (r) => {
//     var d = await r.json();
// });



const aku = require("CurrentUserInitialData").USER_ID;
let jsvars = `{"identity_id":"${aku}","account_type":"FACEBOOK","interface":"FB_WEB"}`;
let jsvars1 = `{"target_userid":"${aku}","device_id":"device_id_fetch_datr","account_type":"FACEBOOK","node_id":null,"web_auth":null,"reauth_initiator_flow":"NATIVE_PASSWORD_ENTRY_START","encrypted_password":null,"use_fxcal_reauth_cadam":true,"reauth_content_type":null}`;
let jsvars2 = `{"account_type":"FACEBOOK","device_id":"device_id_fetch_datr","node_id":"REACTIVATION","reauth_content_type":null,"reauth_initiator_flow":"NATIVE_PASSWORD_ENTRY_START","target_userid":"${aku}","use_fxcal_reauth_cadam":true,"interface":"FB_WEB"}`;
let jsvars3 = `{"target_userid":"${aku}","device_id":"device_id_fetch_datr","account_type":"FACEBOOK","node_id":"REACTIVATION","web_auth":null,"reauth_initiator_flow":"NATIVE_PASSWORD_ENTRY_START","encrypted_password":{"sensitive_string_value":"#PWD_BROWSER:5:1759939616:AXZQAJAG+sC/wT13n9MQOcDfh5Qo0NuIa+O+04//OcmgJjtcJIjCVZyvVlg1avQwQQ8JJpQ9GIfsx2K+Lix72AxBdYuYc87D/YjW6qJ3xtBKgRuNkUes9+aS0mXBHgCl1NFjq62TvkZBRcn0Xnrd"},"use_fxcal_reauth_cadam":true,"reauth_content_type":null}`
function api_react_clone(fbapi, variables, doc){
    const myHeaders = new Headers();
    myHeaders.append('content-type','application/x-www-form-urlencoded');
    const data_payloads = {
        'av': aku,
        ...require('getAsyncParams')('POST'),
        'fb_api_caller_class': 'RelayModern',
        'fb_api_req_friendly_name': fbapi,
        'variables': variables,
        'server_timestamps': 'true',
        'doc_id': doc
    };
    const requestOptions = {
        headers: myHeaders,
        method: "POST",
        body: new URLSearchParams(data_payloads)
    };

    fetch("/api/graphql/", requestOptions).then(async (r) => {
        var d = await r.json();
        console.log(d);
    });
}

api_react_clone('useFXVerifyReauthQuery', jsvars, '10089221147776300');
await new Promise(r => setTimeout(r, 2000));
api_react_clone('useFXVerifyReauthQuery', jsvars1, '9513815222033111');
await new Promise(r => setTimeout(r, 3000));
api_react_clone('FXNativePasswordReauthDialogPageQuery', jsvars2, '31156683680647006');
await new Promise(r => setTimeout(r, 5000));
api_react_clone('FXNativePasswordReauthDialogPageQuery', jsvars3, '9513815222033111');
