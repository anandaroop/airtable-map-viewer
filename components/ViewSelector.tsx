import { useEffect } from "react";

import { useStoreState, useStoreActions } from "../store";
import { API } from "../lib/api";
import { ViewToggle } from "./ViewToggle";
import { clusterPalette as palette } from "../lib/palette";

export const ViewSelector = () => {
  const DEBUG = useStoreState((state) => state.views.debug);
  const isInitialized = useStoreState((state) => state.views.isInitialized);
  const setViewItem = useStoreActions((actions) => actions.views.set);
  const viewItems = useStoreState((state) => state.views.items);

  useEffect(() => {
    async function fetchInitialViewList() {
      const records = await API.fetchMetaRecords();
      records.forEach((record) => {
        const { id, fields } = record;
        setViewItem({
          metaRecordId: id,
          data: { metadata: fields, data: null, defaultColor: null },
        });
      });
    }

    if (!isInitialized) fetchInitialViewList();
  }, []);

  return (
    <>
      <div className="viewSelector">
        {!isInitialized
          ? "Loading…"
          : Object.entries(viewItems).map(([metaRecordId, viewItem]) => (
              <ViewToggle
                key={metaRecordId}
                metaRecordId={metaRecordId}
                viewItem={viewItem}
              />
            ))}
      </div>

      <style jsx>{`
        .viewSelector {
          flex: 1 200px;
        }
      `}</style>

      {DEBUG && (
        <div
          style={{
            background: "white",
            bottom: 0,
            left: 0,
            padding: "1em",
            position: "absolute",
            zIndex: 1,
          }}
        >
          {palette.map((color) => (
            <span
              style={{
                display: "inline-block",
                background: color,
                width: 20,
                height: 20,
              }}
            ></span>
          ))}
        </div>
      )}
    </>
  );
};
