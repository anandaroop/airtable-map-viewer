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

export interface DriversModel {
  // STATE

  items: {
    [recordId: string]: DriverRecord;
  };

  /** Meta info from Airtable's Meta table */
  metadata: MetaFields;

  /** Memoized GeoJSON representation of records */
  geojson: Computed<DriversModel, FeatureCollection<Point, any>>;

  // ACTIONS

  /** Set an individual item in the store by key/value */
  set: Action<DriversModel, { recordId: string; data: DriverRecord }>;

  /** Set all items in the store by key/value */
  setAll: Action<DriversModel, { data: DriverRecord[] }>;

  /** Set metadata from Meta table */
  setMetadata: Action<DriversModel, { data: MetaFields }>;

  // LISTENERS
}

type DriverRecord = any;

export const driversModel: DriversModel = {
  // STATE

  items: {},

  metadata: null,

  geojson: computed((state) => {
    const drivers = Object.values(state.items);
    if (drivers.length > 0) {
      const {
        "Table ID": tableId,
        "View ID": viewId,
        "Primary field name": primaryFieldName,
      } = state.metadata;
      return toGeoJSONFeatureCollection(drivers, {
        tableId,
        viewId,
        primaryFieldName,
      });
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
