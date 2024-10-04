const { apiCall } = require('./apiRequest')
const {getToken} = require("./customerService");

async function completeTask(workflowId, taskRefName, data) {

    const requestConfig = {
        "method": "POST",
        "url": `http://conductor.tracterra/api/queue/update/${workflowId}/${taskRefName}/COMPLETED`,
        "async": false,
        "headers":
            {
                "Authorization": await getToken(),
                "Content-Type": "application/json"
            },
        data: JSON.stringify(data ? data : {})
    }
    console.log(`Complete WF task: ${JSON.stringify(requestConfig)}`)
    return apiCall(null, null, requestConfig)
}

module.exports = {completeTask}