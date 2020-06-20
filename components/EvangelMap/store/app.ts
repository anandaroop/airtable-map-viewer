import {
  action,
  Action,
} from "easy-peasy";


export interface AppModel {
  // STATE

  lastPolledAt: Date;

  // ACTIONS

  /** Update the lastPolledAt timestamp */
  touch: Action<AppModel>;

  // LISTENERS
}

export const appModel: AppModel = {
  // STATE

  lastPolledAt: null,

  // ACTIONS

  touch: action((state) => {
    state.lastPolledAt = new Date();
  }),

  // LISTENERS
};
