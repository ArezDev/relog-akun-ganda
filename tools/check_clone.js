const myHeaders = new Headers();
myHeaders.append('content-type','application/x-www-form-urlencoded');
const data_payloads = {
    'fb_api_req_friendly_name': 'CometProfileSwitcherListQuery',
    'variables': '{"scale":2}',
    'server_timestamps': true,
    'doc_id': '9039782136148253',
    ...require('getAsyncParams')('POST')
};
const requestOptions = {
    headers: myHeaders,
    method: "POST",
    body: new URLSearchParams(data_payloads)
};
return new Promise(resolve => {
    fetch("/api/graphql/", requestOptions).then(async(a)=>{
        var b = await a.json();
        if (b.data.viewer.additional_profile_creation_eligibility.single_owner.can_create === true){
            setTimeout(() => {
                resolve("Akun ganda bisa dibuat, silahkan tunggu...");
                if (sessionStorage.foto_sampul_gw && sessionStorage.foto_profil_gw) {
                    createClone();
                    resolve("Akun ganda berhasil dibuat!");
                }
            }, 5000);
        } else if (b.data.viewer.additional_profile_creation_eligibility.single_owner.can_create === false){
            resolve("Tidak bisa membuat akun ganda, silahkan coba lagi nanti");
        } else if (b.data.viewer.actor.profile_switcher_eligible_profiles.nodes.length > 0) {
            resolve("Akun ganda sudah ada, silahkan gunakan akun tersebut");
        }
    });
});

function createClone(){
    var uidku = require("CurrentUserInitialData").USER_ID;
    function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function pick(arr) {
    return arr[randomInt(0, arr.length - 1)];
    }
    function randomUSMaleName() {
        const firstNames = [
            "Michael","David","James","Robert","John",
            "William","Richard","Thomas","Charles","Mark",
            "Steven","Daniel","Paul","Brian","Kevin",
            "Scott","Timothy","Jeffrey","George","Edward"
        ];
        
        const middleNames = [
            "Allen","Lee","Joseph","Patrick","Ray","Wayne",
            "Anthony","Christopher","Frank","Martin","Douglas"
        ];
        
        const lastNames = [
            "Smith","Johnson","Williams","Brown","Jones",
            "Miller","Davis","Garcia","Rodriguez","Wilson",
            "Martinez","Anderson","Taylor","Thomas","Harris",
            "Clark","Lewis","Walker","Hall","Allen"
        ];
        const first = pick(firstNames);
        const last = pick(lastNames);
        // 50% ada middle name
        if (Math.random() < 0.5) {
            return `${first} ${pick(middleNames)} ${last}`;
        } else {
            return `${first} ${last}`;
        }
    }
    function randomUSFemaleName() {
        const firstNames = [
            "Jessica","Ashley","Emily","Sarah","Amanda",
            "Jennifer","Elizabeth","Lauren","Megan","Hannah",
            "Rachel","Samantha","Nicole","Stephanie","Rebecca",
            "Michelle","Melissa","Amber","Brittany","Heather"
        ];
        
        const middleNames = [
            "Marie","Ann","Lynn","Grace","Jane",
            "Rose","Nicole","Elizabeth","Faith","Louise"
        ];
        
        const lastNames = [
            "Smith","Johnson","Williams","Brown","Jones",
            "Miller","Davis","Garcia","Rodriguez","Wilson",
            "Martinez","Anderson","Taylor","Thomas","Harris",
            "Clark","Lewis","Walker","Hall","Allen"
        ];

        const first = pick(firstNames);
        const last = pick(lastNames);

        // 50% ada middle name
        if (Math.random() < 0.5) {
            return `${first} ${pick(middleNames)} ${last}`;
        } else {
            return `${first} ${last}`;
        }
    }
    //MALE
    // let nameMale = randomUSMaleName();
    // let ngaran = nameMale.split(" ")[0];
    //FEMALE
    let nameFemale = randomUSFemaleName();
    let ngaran = nameFemale.split(" ")[0];

    var jvars = JSON.stringify({
        "input": {
            "name": nameFemale,
            "source": "PROFILE_SWITCHER_UNIFIED_CREATION",
            "user_name": ngaran + "." + ngarangNomer(6),
            "cover_photo": {
                "existing_cover_photo_id": sessionStorage.foto_sampul_gw,
                "focus": {
                    "x": 0.5,
                    "y": 0.5000720149791156
                }
            },
            "profile_photo": {
                "existing_photo_id": sessionStorage.foto_profil_gw
            },
            "actor_id": uidku,
            "client_mutation_id": "2"
        }
    });
    const myHeaders = new Headers();
    myHeaders.append('content-type','application/x-www-form-urlencoded');
    const data_payloads = {
        'fb_api_req_friendly_name': 'AdditionalProfileCreateMutation',
        'variables': jvars,
        'server_timestamps': true,
        'doc_id': '4699419010168408',
        ...require('getAsyncParams')('POST')
    };
    const requestOptions = {
        headers: myHeaders,
        method: "POST",
        body: new URLSearchParams(data_payloads)
    };
    return new Promise(resolve => {
        fetch("/api/graphql/", requestOptions).then(async (r) => {
            var d = await r.json();
            if (d.data.additional_profile_create.additional_profile.id) {
                resolve("Akun ganda berhasil dibuat!");
            } else {
                resolve("Error saat membuat akun ganda: " + d.errors[0].message);
            }
        });
    });

    function ngarangNomer(length) {
        var result = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

function startpost(fbid,kata){
    var uidku = require("CurrentUserInitialData").USER_ID;
    var jsV = JSON.stringify({"input":{"composer_entry_point":"inline_composer","composer_source_surface":"timeline","idempotence_token":hexc(8)+"-"+hexc(4)+"-"+hexc(4)+"-"+hexc(4)+"-"+hexc(12)+"_FEED","source":"WWW","attachments":[],"audience":{"privacy":{"allow":[],"base_state":"EVERYONE","deny":[],"tag_expansion_state":"UNSPECIFIED"}},"message":{"ranges":[],"text":kata},"with_tags_ids":null,"inline_activities":[],"text_format_preset_id":"0","publishing_flow":{"supported_flows":["ASYNC_SILENT","ASYNC_NOTIF","FALLBACK"]},"logging":{"composer_session_id":hexc(8)+"-"+hexc(4)+"-"+hexc(4)+"-"+hexc(4)+"-"+hexc(12)},"navigation_data":{"attribution_id_v2":"ProfileCometTimelineListViewRoot.react,comet.profile.timeline.list,unexpected,1734667527262,41441,190055527696468,,;FriendingCometFriendRequestsRoot.react,comet.friending.friendrequests,unexpected,1734667510763,494914,2356318349,,;FriendingCometRoot.react,comet.friending,tap_tabbar,1734667509478,938444,2356318349,,"},"tracking":[null],"event_share_metadata":{"surface":"timeline"},"actor_id":uidku,"client_mutation_id":"8"},"feedLocation":"TIMELINE","feedbackSource":0,"focusCommentID":null,"gridMediaWidth":230,"groupID":null,"scale":1,"privacySelectorRenderLocation":"COMET_STREAM","checkPhotosToReelsUpsellEligibility":true,"renderLocation":"timeline","useDefaultActor":false,"inviteShortLinkKey":null,"isFeed":false,"isFundraiser":false,"isFunFactPost":false,"isGroup":false,"isEvent":false,"isTimeline":true,"isSocialLearning":false,"isPageNewsFeed":false,"isProfileReviews":false,"isWorkSharedDraft":false,"hashtag":null,"canUserManageOffers":false,"__relay_internal__pv__CometUFIShareActionMigrationrelayprovider":true,"__relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider":false,"__relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider":false,"__relay_internal__pv__IsWorkUserrelayprovider":false,"__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider":false,"__relay_internal__pv__CometFeedStoryDynamicResolutionPhotoAttachmentRenderer_experimentWidthrelayprovider":500,"__relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider":false,"__relay_internal__pv__IsMergQAPollsrelayprovider":false,"__relay_internal__pv__FBReelsMediaFooter_comet_enable_reels_ads_gkrelayprovider":false,"__relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider":false,"__relay_internal__pv__EventCometCardImage_prefetchEventImagerelayprovider":true,"__relay_internal__pv__GHLShouldChangeSponsoredAuctionDistanceFieldNamerelayprovider":false});
    const dataQuery = {
      'variables': jsV,
      'doc_id': '9797715060256360',
      ...require('getAsyncParams')('POST')
    };
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let a = xhr.responseText;
            var data = JSON.parse(a.replace('for (;;);',''));
            console.log(data);
            if(data.data.story_create.story.url){
              //window.open(data.data.story_create.story.url,"_self");
              console.log("Post Berhasil");
            }
        }
    };
    xhr.open("POST", "/api/graphql/");
    xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
    xhr.send(new URLSearchParams(dataQuery));
}

const hexc = size => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  
    for (let n = 0; n < size; n++) {
      result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
  }