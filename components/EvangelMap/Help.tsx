import { useStoreState, useStoreActions } from "../EvangelMap/store";

export const Help = () => {
  const isHelpVisible = useStoreState((state) => state.app.isHelpVisible);
  const showHelp = useStoreActions((actions) => actions.app.showHelp);
  const hideHelp = useStoreActions((actions) => actions.app.hideHelp);

  return (
    <>
      <div className="help">
        {isHelpVisible ? (
          <div className="content">
            <div className="toggle" onClick={() => hideHelp()}>
              Close ✕
            </div>
            <div className="scrollable">
              <p>
                This map app provides a friendlier view into the Airtable tables
                we use to manage deliveries.
              </p>
              <p>
                All <em>updates</em> to driving assignments are still made in
                the Airtable interface, but this map interface should make it
                much easier to <em>visualize</em> what drivers are available,
                where they are coming from, which stops are assigned to them,
                which stops still need to be assigned, and so on.
              </p>
              <p>There are basically two different ways to get this done:</p>

              <ol>
                <li>
                  Keep the Airtable{" "}
                  <a
                    target="grid"
                    href="https://airtable.com/tbl8XAiO21AVgeuvw/viwJGcKgSrTDNX6DP"
                  >
                    grid view for this delivery
                  </a>{" "}
                  open in another window and make assignments row-by-row in the{" "}
                  <strong>Driver</strong> column. Refresh this map view
                  frequently, to see the current state of the assignments.
                </li>
                <li>
                  Hover over the map markers to see a link to the associated
                  Airtable record. Click through to open that invidual record
                  and assign a driver. (You'll have to scroll down to the{" "}
                  <strong>Driver</strong> field.) Refresh this map view
                  frequently, to see the current state of the assignments.
                </li>
              </ol>

              <p>
                Open rings represent drivers. Filled discs represent stops.
                Stops will be gray until they are assigned; then they will be
                color-coded to match their driver.
              </p>
              <p>
                For further questions, drop a note in the the{" "}
                <a href="https://queensdsa.slack.com/archives/C012THPS340">
                  #mutualaid-data
                </a>{" "}
                channel
              </p>
            </div>
          </div>
        ) : (
          <div className="toggle" onClick={() => showHelp()}>
            Need help?
          </div>
        )}
      </div>

      <style jsx>{`
        .help {
          position: absolute;
          left: 1em;
          bottom: 1em;
          z-index: 1000;
          background: #ffffffdd;
          box-shadow: 0 0 8px #00000033;
          border-radius: 0.5em;
          line-height: 1.4;
        }

        .content {
          padding: 1em;
          width: 20em;
        }

        .toggle {
          color: #e7212f;
          padding: 1em;
          cursor: pointer;
          text-align: right;
        }

        .scrollable {
          max-height: calc(100vh - 10rem - 80px);
          overflow: scroll;
        }
      `}</style>
    </>
  );
};
