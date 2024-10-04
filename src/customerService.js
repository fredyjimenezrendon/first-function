const {apiCall} = require("./apiRequest")

async function getToken() {
    let accessTokenResponse = await getTokenForServiceCustomer()
    const tokenObj = JSON.parse(accessTokenResponse)
    return tokenObj.token_type + " " + tokenObj.access_token
}

async function getTokenForServiceCustomer() {
    let vaultServiceCustomerClientSecret = process.env.VAULT_SERVICE_CUSTOMER_CLIENT_SECRET
    console.log(`VAULT_SERVICE_CUSTOMER_CLIENT_SECRET ${vaultServiceCustomerClientSecret}`)

    let vaultServiceCustomerClientId = process.env.VAULT_SERVICE_CUSTOMER_CLIENT_ID;
    console.log(`VAULT_SERVICE_CUSTOMER_CLIENT_ID ${vaultServiceCustomerClientId}`)

    const requestConfig = {
        "method": "POST",
        "url": process.env.IAM_URL,
        "async": true,
        "headers":
            {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        "data": `grant_type=client_credentials&client_id=${vaultServiceCustomerClientId}&client_secret=${vaultServiceCustomerClientSecret}`
    }
    return apiCall(null, null,requestConfig)
}

module.exports = {getTokenForServiceCustomer, getToken}