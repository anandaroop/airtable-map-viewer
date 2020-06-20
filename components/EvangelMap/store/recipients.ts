import {
  action,
  Action,
  actionOn,
  ActionOn,
  computed,
  Computed,
  debug,
  thunk,
  Thunk,
  thunkOn,
  ThunkOn,
} from "easy-peasy";

import { FeatureCollection, Feature, Point } from "geojson";
import { toGeoJSONFeatureCollection } from "../../../lib/geojson";
import { MetaFields } from "../../../lib/airtable";

export interface RecipientsModel {
  // STATE

  items: {
    [recordId: string]: RecipientRecord;
  };

  /** Meta info from Airtable's Meta table */
  metadata: MetaFields;

  /** Memoized GeoJSON representation of records */
  geojson: Computed<RecipientsModel, FeatureCollection<Point, any>>;

  // ACTIONS

  /** Set an individual item in the store by key/value */
  set: Action<RecipientsModel, { recordId: string; data: RecipientRecord }>;

  /** Set all items in the store by key/value */
  setAll: Action<RecipientsModel, { data: RecipientRecord[] }>;

  /** Set metadata from Meta table */
  setMetadata: Action<RecipientsModel, { data: MetaFields }>;

  // LISTENERS
}

type RecipientRecord = any;

export const recipientsModel: RecipientsModel = {
  // STATE

  items: {},

  metadata: null,

  geojson: computed((state) => {
    const recipients = Object.values(state.items);
    if (recipients.length > 0) {
      const { "Table ID": tableId, "View ID": viewId, "Primary field name": primaryFieldName } = state.metadata;
      return toGeoJSONFeatureCollection(recipients, { tableId, viewId, primaryFieldName });
    }
  }),

  // ACTIONS

  set: action((state, payload) => {
    const { recordId, data } = payload;
    state.items[recordId] = data;
  }),

  setAll: action((state, payload) => {
    const { data } = payload;
    data.forEach((record) => {
      state.items[record.id] = record;
    });
  }),

  setMetadata: action((state, payload) => {
    const { data } = payload;
    state.metadata = data;
  }),

  // LISTENERS
};
