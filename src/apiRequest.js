const {XMLHttpRequest} = require("xmlhttprequest");

const HTTP_REQUEST_STATUS_DONE = 4;
const DEFAULT_GRAPHQL_URL = process.env.API_GW_URL

async function apiCall(query, authToken, requestConfigOverride) {
    const defaultRequestConfig = {
        "method": "POST",
        "url": DEFAULT_GRAPHQL_URL,
        "async": true,
        "headers": addUserContextHeadersIfPresent(authToken),
        "data": JSON.stringify({query: query})
    }
    const config = null == requestConfigOverride ? defaultRequestConfig : requestConfigOverride;
    try {
        return await makeAPIRequest(config);
    } catch (e) {
        // catch reject promise scenario here
        throw e;
    }
}

function addUserContextHeadersIfPresent(authToken) {
    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": authToken
    }
    let viaxUserContext = global.viaxUserContext;
    if (viaxUserContext) {
        for (const additionalHeader in viaxUserContext) {
            const kebabProperty = additionalHeader.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
            const headerName = "X-Viax-User-" + kebabProperty;
            headers[headerName] = viaxUserContext[additionalHeader]
        }
    }
    return headers;
}

function makeAPIRequest(requestConfig) {
    const xhr = new XMLHttpRequest()
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function () {
            // Only run if the request is complete
            if (xhr.readyState !== HTTP_REQUEST_STATUS_DONE) {
                return;
            }
            console.log(`Response status ${xhr.status}`)
            console.log(`Response ${xhr.body}`)
            // Process the response
            if (xhr.status >= 200 && xhr.status < 300) {
                // If successful
                resolve(xhr.responseText);
            } else {
                // If failed
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    req: xhr.responseText,
                    xhr: xhr
                });
            }
        };
        xhr.open(requestConfig.method, requestConfig.url, requestConfig.async);
        Object.keys(requestConfig.headers).forEach(
            headerEntry => xhr.setRequestHeader(headerEntry, requestConfig.headers[headerEntry])
        );
        xhr.send(requestConfig.data);
    })
}

module.exports = {apiCall}