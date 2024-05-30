const axios = require('axios');

const registrationUrl = "http://20.244.56.144/test/register";
const registrationData = {
    "companyName": "goMart",
    "ownerName": "Thirukkumaran D",
    "rollNo": "927621BIT119",
    "ownerEmail": "dthirukkumaran28@gmail.com",
    "accessCode": "sFmNjQ"  
};

axios.post(registrationUrl, registrationData)
    .then(response => {
        const credentials = response.data;
        console.log(credentials);

        const authUrl = "http://20.244.56.144/test/auth";
        const authData = {
            "companyName": credentials.companyName,
            "clientID": credentials.clientID,
            "clientSecret": credentials.clientSecret,
            "ownerName": credentials.ownerName,
            "ownerEmail": credentials.ownerEmail,
            "rollNo": credentials.rollNo
        };

        return axios.post(authUrl, authData);
    })
    .then(response => {
        const authToken = response.data.access_token;
        console.log(authToken);
    })
    .catch(error => {
        console.error(error.response ? error.response.data : error.message);
    });
