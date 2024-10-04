'use strict'
const {CloudEvent} = require("cloudevents")
let {getOrderWorkflowId} = require('./orderService')
let {completeTask} = require('./workflowService')

async function handler(event) {
  try {
    console.log(`Event: ${JSON.stringify(event)}`)
    let eventData = getRequestInputDataFromCloudEvent(event)
    const orderWorkflowId = await getOrderWorkflowId(eventData?.tBiId)

    await completeTask(orderWorkflowId, "wait_partner_trial_external_trigger")

    return new CloudEvent({
      type: 'io.viax.function.PartnerTrialCompleteWaitTaskFS',
      source: 'fun/partner-trial-complete-wait-task-fs',
      data: {
        status: "SUCCESS",
        message: "WAIT Task \"wait_partner_trial_external_trigger\" COMPLETED"
      }
    })
  } catch(error) {
    return new CloudEvent({
      type: 'io.viax.function.PartnerTrialCompleteWaitTaskFS',
      source: 'fun/partner-trial-complete-wait-task-fs',
      data: {
        status: "FAILURE",
        message: error
      }
    })
  }  
}

function getRequestInputDataFromCloudEvent(event) {
  return isCalledFromMutation(event)
    ? (JSON.parse(event.data).input)
    : (event.data);
};

function isCalledFromMutation(event) {
  return typeof event.data === "string";
};

module.exports = {handler}