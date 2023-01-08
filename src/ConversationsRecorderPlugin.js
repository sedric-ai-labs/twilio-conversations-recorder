import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';

const PLUGIN_NAME = 'ConversationsRecorderPlugin';

export default class ConversationsRecorderPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex1-ui') }
   */
  async init(flex, manager) {
    flex.Actions.addListener("beforeAcceptTask", (payload) => {
      payload.conferenceOptions.record = 'true';

      const task = payload.task._task;
      const workerSID = task._worker.sid;
      const direction = task.attributes.direction;

      let caller = "";
      let called = "";
      if (direction === "outbound") {
        caller = task.attributes.from.replace("+", "@");
        called = task.attributes.outbound_to.replace("+", "@");
      } else {
        caller = task.attributes.caller.replace("+", "@");
        called = task.attributes.called.replace("+", "@");
      }
      
      const callbackURL = `https://us-central1-sedric-prod.cloudfunctions.net/flex_api?workerSID=${workerSID}&direction=${direction}&called=${called}&caller=${caller}`;
      payload.conferenceOptions.recordingStatusCallback = callbackURL;
    });
  }
}
