import { createStore, createTypedHooks } from "easy-peasy";
import { ViewsModel, viewsModel } from "./views";

interface StoreModel {
  views: ViewsModel;
}

const storeModel: StoreModel = {
  views: viewsModel,
};

export const store = createStore(storeModel);

// typed hooks for use in the app
const typedHooks = createTypedHooks<StoreModel>()
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;


