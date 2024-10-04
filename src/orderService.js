const {apiCall} = require('./apiRequest')
let {getToken} = require('./customerService')

async function getOrderWorkflowId(biId) {
  const authToken = await getToken();

  let mutation = `
    query getOrder {
      getOrder(biId: "${biId}") {
        biId
        bpBusinessProcess {
          bprId
          ... on WorkflowBusinessProcess {
            bprwWorkflow {
              ... on ConductorWorkflow {
                externalWorkflowId
              }
            }
          }
        }
      }
  }`

  console.log(mutation)
  let getOrderResult = await apiCall(mutation, authToken);

  console.log("Get order resp:" +  getOrderResult);
  let getOrderResultObj = JSON.parse(getOrderResult);
  if (getOrderResultObj.errors) {
    throw `There are some issues during getting the order {biId=${biId}, response=${JSON.stringify(getOrderResultObj)}}`
  }
  if (getOrderResultObj.data.getOrder === null) {
    throw `Order of {biId=${biId} not found - response=${JSON.stringify(getOrderResultObj)}}`
  }
  return getOrderResultObj.data.getOrder?.bpBusinessProcess?.bprwWorkflow?.externalWorkflowId;
}

module.exports = {getOrderWorkflowId}