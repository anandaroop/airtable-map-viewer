import {
  action,
  Action,
  actionOn,
  ActionOn,
  computed,
  Computed,
  thunk,
  Thunk,
  thunkOn,
  ThunkOn,
} from "easy-peasy";
import { FeatureCollection } from "geojson";

import { MetaFields } from "../lib/airtable";
import { toGeoJSONFeatureCollection } from "../lib/geojson";
import { API } from "../lib/api";
import palette from "../lib/palette";

export interface ViewsModel {
  // STATE

  /**
   * Main store of dynamically loaded View data from Airtable.
   * - Keys are record IDs from the "Meta" table that holds
   *   metadata for all of the Airtable Views
   * - Values are objects consisting of the View's metadata and
   *   (eventually) the View's actual geospatial record data.
   *
   */
  items: {
    [metaRecordId: string]: ViewsItem;
  };

  /** Has the initial View list been fetched? */
  isInitialized: Computed<ViewsModel, boolean>;

  /** IDs of View items currently selected for display */
  selectedIds: string[];

  /** Memoized list of Views that are both selected _and_ fetched  */
  displayable: Computed<ViewsModel, ViewsItem[]>;

  // ACTIONS

  /** Set an individual View item in the store by key/value */
  set: Action<ViewsModel, { metaRecordId: string; data: ViewsItem }>;

  /** Add a View item to the current selection */
  select: Action<ViewsModel, { metaRecordId: string }>;

  /** Remove a View item from the current selection */
  deselect: Action<ViewsModel, { metaRecordId: string }>;

  // THUNKS

  /** Given an ID, fetch the corresponding View data, then update the store */
  load: Thunk<ViewsModel, { metaRecordId: string }>;

  // LISTENERS

  /** When a view is selected, ensure the data gets fetched if it hasn't already */
  onSelectView: ThunkOn<ViewsModel>;

  /** When the views are update, ensure an appropriate color palette */
  onSetView: ActionOn<ViewsModel>;
}

export interface ViewsItem {
  metadata: MetaFields;
  data: null | FeatureCollection;
  defaultColor: string;
}

export const viewsModel: ViewsModel = {
  // STATE

  items: {},

  isInitialized: computed((state) => {
    return Object.keys(state.items).length > 0;
  }),

  selectedIds: [],

  displayable: computed((state) => {
    return (
      Object.entries(state.items)
        // view is selected
        .filter(([id, _item]) => state.selectedIds.includes(id))
        // and view data is available
        .filter(([_id, item]) => !!item.data)
        .map(([_id, item]) => item)
    );
  }),

  // ACTIONS

  set: action((state, payload) => {
    const { metaRecordId, data } = payload;
    state.items[metaRecordId] = data;
  }),

  select: action((state, payload) => {
    const { metaRecordId } = payload;
    if (state.selectedIds.includes(metaRecordId)) return;
    state.selectedIds.push(metaRecordId);
  }),

  deselect: action((state, payload) => {
    const { metaRecordId } = payload;
    state.selectedIds = state.selectedIds.filter((id) => id !== metaRecordId);
  }),

  // THUNKS

  load: thunk(async (actions, payload, helpers) => {
    const { metaRecordId } = payload;
    const { getState } = helpers;

    const viewItem = getState().items[metaRecordId];
    const isAlreadyLoaded = !!viewItem.data;
    if (isAlreadyLoaded) return;

    const tableId = viewItem.metadata["Table ID"];
    const tableName = viewItem.metadata["Table name"];
    const viewId = viewItem.metadata["View ID"];
    const viewName = viewItem.metadata["View name"];
    const primaryFieldName = viewItem.metadata["Primary field name"];

    const records = await API.fetchRecordsFromView({
      tableName,
      viewName,
      primaryFieldName,
    });

    const airtableLocation = {
      tableId,
      viewId,
    };

    const featureCollection = toGeoJSONFeatureCollection(
      records,
      airtableLocation
    );

    // only include geolocated features
    featureCollection.features = featureCollection.features.filter(
      (f) => f.geometry.coordinates[0] && f.geometry.coordinates[1]
    );

    const updatedItem = { ...viewItem, data: featureCollection };
    actions.set({ metaRecordId, data: updatedItem });
  }),

  // LISTENERS

  onSelectView: thunkOn(
    (actions) => actions.select,
    (actions, target) => {
      actions.load({ metaRecordId: target.payload.metaRecordId });
    }
  ),

  onSetView: actionOn(
    (actions) => actions.set,
    (state) => {
      // reassign colors from palette
      Object.entries(state.items).forEach(([id], idx) => {
        state.items[id].defaultColor = palette[idx];
      });
    }
  ),
};
