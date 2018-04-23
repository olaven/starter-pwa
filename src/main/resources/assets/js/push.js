
// Components
const pushButton = document.getElementById("push-button");
const subscribeButton = document.getElementById("subscribe-button");
const subscribeStatus = document.getElementById("subscribe-status");
let swRegistration = null;

// State
let isSubscribed = false;
var subscriptionEndpoint = null;
var subscriptionKey = null;
var subscriptionAuth = null;


var publicKey = null;
var subscribeUrl = null;
var pushUrl = null;

// Setup service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    // Read core constants stored in DOM
    navigator.serviceWorker.ready
        .then(function(reg) {
            var subscrData = document.getElementById("push-subscription-data");
            subscribeUrl = subscrData.getAttribute("data-subscribe-url");
            pushUrl = subscrData.getAttribute("data-push-url");
            publicKey = subscrData.getAttribute("data-public-key");

        }, function() {
            console.log('Service Worker is not ready.');
        });


    // Register sw.js
    navigator.serviceWorker.register('sw.js')
        .then(function(swReg) {
            console.log('Service Worker is registered', swReg);

            swRegistration = swReg;
            initializeUI();
        })
        .catch(function(error) {
            console.error('Service Worker Error', error);
        });

} else {
    console.warn('Push messaging is not supported');
    subscribeButton.textContent = 'Push Not Supported';
}


function initializeUI() {

    // Add button click listeners
    subscribeButton.addEventListener('click', clickSubscriptionButton);
    pushButton.addEventListener('click', clickPushButton);

    // Get the initial subscription state and store itf
    swRegistration.pushManager.getSubscription()
        .then(function(subscr) {
            var subscription = JSON.parse(JSON.stringify(subscr || {}));
            var keys = subscription.keys || {};

            subscriptionEndpoint = subscription.endpoint;
            subscriptionKey = keys.p256dh;
            subscriptionAuth = keys.auth;

            isSubscribed = subscriptionEndpoint && subscriptionKey && subscriptionAuth;
            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }
            updateBtn();
        });
}



// -------------------------------------------------------------------------  Subscription section

function clickSubscriptionButton() {
    subscribeButton.disabled = true;
    if (isSubscribed) {
        unsubscribeUser();
    } else {
        subscribeUser();
    }
}

// What should the button look like
function updateBtn() {
    if (Notification.permission === 'denied') {
        subscribeStatus.textContent = 'Push Notifications are blocked';
        subscribeButton.disabled = true;
        return;
    }

    if (isSubscribed) {
        subscribeStatus.textContent = 'Subscribing to notifications';
        subscribeButton.textContent = 'Unsubscribe';
    } else {
        subscribeStatus.textContent = 'Not subscribing to notifications';
        subscribeButton.textContent = 'Subscribe';
    }

    subscribeButton.disabled = false;
}


function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


// Make a new subscription
function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(publicKey);
    swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
        .then(function(subscription) {
            updateSubscriptionOnServer(subscription);
        })
        .catch(function(err) {
            console.error('Failed to subscribe the user: ', err);
            updateBtn();
        });
}


// Remove the subscription from server
function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .then(removeSubscriptionOnServer)
        .catch(function(err) {
            console.error('Failed to unsubscribe the user: ', err);
            updateBtn();
        });
}


function removeSubscriptionOnServer() {
    if (isSubscribed && subscriptionEndpoint && subscriptionKey && subscriptionAuth) {

        const params = {
            cancelSubscription: true,
            endpoint: subscriptionEndpoint,
            key: subscriptionKey,
            auth: subscriptionAuth
        };

        var jquery = $ || wemjq;
        jquery.post({
            url: subscribeUrl,
            data: params,
            dataType: "json",

            success: function(data) {
                if (((data || {}).success === true)) {
                    console.log('Successfully unsubscribed from push notification');

                    isSubscribed = false;
                    subscriptionEndpoint = null;
                    subscriptionKey = null;
                    subscriptionAuth = null;

                } else {
                    console.warn("Server responded with status 200, but not with success=true");
                }

                if (data.message) {
                    console.log(data.message);
                }
                updateBtn();
            },

            error: function(data) {
                console.error('Failed to unsubscribe from push notification.');
                if (data.message) {
                    console.info(data.message);
                }
                updateBtn();
            }
        });


    } else {
        console.log("No subscription to remove");
    }
}

// Store the subscription on server
function updateSubscriptionOnServer(subscription) {
    if (!subscription) {
        console.log("No subscription object to update");
        return;
    }

    const subObj = JSON.parse(JSON.stringify(subscription));

    const params = {
        endpoint: subObj.endpoint,
        key: subObj.keys.p256dh,
        auth: subObj.keys.auth
    };

    var jquery = $ || wemjq;
    jquery.post({
        url: subscribeUrl,
        data: params,
        dataType: "json",

    }).then(
        function success(data) {
            if (((data || {}).success === true)) {
                console.log('Successfully subscribed to push notification');

                subscriptionEndpoint = params.endpoint;
                subscriptionKey = params.key;
                subscriptionAuth = params.auth;
                isSubscribed = true;

            } else {
                console.warn("Server responded with status 200, but not with success=true");
            }
            updateBtn();
        },

        function fail (error) {
            console.error('Failed to subscribe to push notification.');
            console.log({response:error});

            isSubscribed = false;
            updateBtn();
        }
    );
}



// -------------------------------------------------------------------------------- Push section

function clickPushButton() {
    var jquery = $ || wemjq;
    var form = jquery('#push-form');
    jquery.post({
        url: form.attr('action'),
        data: form.serialize(),
        dataType: "json",

    }).then(
        function success(data) {
            if ((data || {}).success === true) {
                console.log("Push succeeded");

            } else {
                console.log(data);
            }
        },

        function fail(error) {
            console.warn("Push failed");
            console.error(error);
        },
    );

    return false;
}

