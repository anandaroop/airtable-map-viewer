import { action, Action } from "easy-peasy";

export interface AppModel {
  // STATE

  lastPolledAt: Date;

  isHelpVisible: boolean;

  // ACTIONS

  /** Update the lastPolledAt timestamp */
  touch: Action<AppModel>;

  /** Show the help modal */
  showHelp: Action<AppModel>;

  /** Hide the help modal */
  hideHelp: Action<AppModel>;

  // LISTENERS
}

export const appModel: AppModel = {
  // STATE

  lastPolledAt: null,

  isHelpVisible: false,

  // ACTIONS

  touch: action((state) => {
    state.lastPolledAt = new Date();
  }),

  hideHelp: action((state) => {
    state.isHelpVisible = false
  }),

  showHelp: action((state) => {
    state.isHelpVisible = true
  }),

  // LISTENERS
};
