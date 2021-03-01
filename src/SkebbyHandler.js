import {useContext} from 'react';
import {AppConfiguration} from './App';

const BASEURL = 'https://api.skebby.it/API/v1.0/REST/';
const MESSAGE_MEDIUM_QUALITY = "TI";

function login(username, password) {
    return fetch(BASEURL + 'login?username=' + username + '&password=' + password)
    .then(res => res.text())
    .then((response) => {
        var auth = response.split(';');
        return {
            user_key: auth[0],
            session_key: auth[1]
        };
    });
}


function sendSMS(auth, sendsms) {
    return fetch(BASEURL + 'sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'user_key': auth.user_key, 'Session_key': auth.session_key },
        body: JSON.stringify(sendsms),
    });
}

async function fetchUserStatus(auth) {
    let status = await fetch(BASEURL + 'status?getMoney=true&typeAliases=true', {
        headers: { 'Content-Type': 'application/json', 'user_key': auth.user_key, 'Session_key': auth.session_key },
    });
    console.log('status', status);
    return status;
}

function sendSms(username, password, recipient, text){
    var smsData = {
        recipient,
        "sender": "Velvet",
        "message": text,
        "message_type": MESSAGE_MEDIUM_QUALITY
    };

    return login(username, password)
    .then(auth => {
        return sendSMS(auth, smsData);
    });
}

export const useSmsSender = function(){
    const { config } = useContext(AppConfiguration);
    return (recipients, message) => {
        return sendSms(config.skebbyUsername, config.skebbyPassword, recipients, message);
    }
};

export const useSmsStatus = function(){
    const { config } = useContext(AppConfiguration);

    return () => login(config.skebbyUsername, config.skebbyPassword)
    .then(auth => {
        return fetchUserStatus(auth);
    });
};
