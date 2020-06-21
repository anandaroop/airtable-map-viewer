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
import { StoreModel } from "./index";
import { DriversModel } from "./drivers";
import { driverPalette } from "../../../lib/palette";
import { CircleMarker } from "leaflet";

export interface RecipientFields {
  /** Name lookup for the linked Request table record */
  NameLookup: string[];

  /** ID of the linked Volunteer table record for this driver */
  Driver: string[];

  /** True if point person has confirmed they want this delivery */
  "Confirmed?": boolean;

  /** Useful notes for driver */
  Notes: string;

  /** ID of the linked Neighborhood table record for this driver */
  Neighborhood: string[];

  /** Phone lookup for the linked Request table record */
  Phone: string[];

  /** WhatsApp lookup for the linked Request table record */
  "Whatsapp Only": boolean[];

  /** Best address */
  "Address (computed)": string;

  /** Geocoded address, encoded */
  "Geocode cache": string;
}

export type RecipientRecord = Airtable.Record<RecipientFields>;

export interface RecipientsModel {
  // STATE

  items: {
    [recordId: string]: RecipientRecord;
  };

  /** Computed tally of assigned/unassigned, etc */
  counts: Computed<
    RecipientsModel,
    {
      assigned: number;
      unassigned: number;
    }
  >;

  /** Meta info from Airtable's Meta table */
  metadata: MetaFields;

  /** Memoized GeoJSON representation of records */
  geojson: Computed<RecipientsModel, FeatureCollection<Point, any>>;

  /** Mapping of driver IDs to colors */
  colorMap: {
    [driverRecordId: string]: string;
  };

  /** Mapping of recipient IDs to instantiated Leaflet markers */
  markerMap: {
    [recordId: string]: CircleMarker;
  };

  /** True if Features have been assigned distinct "marker-color" per driver */
  isColorCoded: boolean;

  // ACTIONS

  /** Set an individual item in the store by key/value */
  set: Action<RecipientsModel, { recordId: string; data: RecipientRecord }>;

  /** Set all items in the store by key/value */
  setAll: Action<RecipientsModel, { data: RecipientRecord[] }>;

  /** Set metadata from Meta table */
  setMetadata: Action<RecipientsModel, { data: MetaFields }>;

  /** Color-code the recipients according to assigned driver */
  colorize: Action<RecipientsModel, { data: DriversModel["items"] }>;

  /** Color-code the recipients according to assigned driver */
  setMarker: Action<
    RecipientsModel,
    { recordId: string; marker: CircleMarker }
  >;

  // LISTENERS

  /** Listen for updates, in order to update itineraries */
  onItineraryUpdate: ThunkOn<RecipientsModel, any, StoreModel>;
}

export const recipientsModel: RecipientsModel = {
  // STATE

  items: {},

  counts: computed((state) => {
    const recipients = Object.values(state.items);
    const total = recipients.length;
    const assigned = recipients.filter((r) => r.fields.Driver?.length > 0)
      .length;
    const unassigned = total - assigned;
    return { assigned, unassigned };
  }),

  metadata: null,

  geojson: computed((state) => {
    const recipients = Object.values(state.items);
    if (recipients.length > 0) {
      const {
        "Table ID": tableId,
        "View ID": viewId,
        "Primary field name": primaryFieldName,
      } = state.metadata;
      return toGeoJSONFeatureCollection(recipients, {
        tableId,
        viewId,
        primaryFieldName,
        colorizer: (record: Airtable.Record<RecipientFields>) => {
          const driverId = record.fields.Driver?.[0];
          return state.colorMap[driverId];
        },
      });
    }
  }),

  colorMap: {},

  markerMap: {},

  isColorCoded: false,

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

  colorize: action((state, payload) => {
    const drivers = payload.data;
    const driverIds = Object.keys(drivers);
    const colorMap = driverIds.reduce((acc, val) => {
      acc[val] = driverPalette[driverIds.indexOf(val)];
      return acc;
    }, {});

    state.colorMap = colorMap;
    state.isColorCoded = true;
  }),

  setMarker: action((state, payload) => {
    const { recordId, marker } = payload;
    state.markerMap[recordId] = marker;
  }),

  // LISTENERS
  onItineraryUpdate: thunkOn(
    (_actions, storeActions) => [storeActions.drivers.updateItineraries],
    (actions, _target, { getStoreState }) => {
      const state = getStoreState();
      const drivers = state.drivers.items;

      actions.colorize({ data: drivers });
    }
  ),
};
