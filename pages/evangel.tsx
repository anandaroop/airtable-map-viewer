import Head from "next/head";
import { StoreProvider } from "easy-peasy";

import { Authenticated, LayoutWithUserHeader } from "../components/common";
import { EvangelMap } from "../components/EvangelMap";
import { store } from "../components/EvangelMap/store";

const AIRTABLE_IDS = {
  DRIVERS_TABLE: process.env.NEXT_PUBLIC_AIRTABLE_DRIVERS_TABLE_ID,
  DRIVERS_VIEW: process.env.NEXT_PUBLIC_AIRTABLE_DRIVERS_MAP_VIEW_ID,
  RECIPIENTS_TABLE: process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_TABLE_ID,
  RECIPIENTS_VIEW: process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_MAP_VIEW_ID,
};

export default function Evangel() {
  return (
    <>
      <Head>
        <title>QDSAMA: Evangel</title>
      </Head>

      <Authenticated onSuccessRedirectTo="/evangel">
        <LayoutWithUserHeader
          additionalLinks={
            <div className="airtable">
              Airtable: &nbsp;
              <a
                href={`https://airtable.com/${AIRTABLE_IDS.RECIPIENTS_TABLE}/${AIRTABLE_IDS.RECIPIENTS_VIEW}?blocks=hide`}
                target="_airtable"
              >
                Deliveries
              </a>
              &nbsp;|&nbsp;
              <a
                href={`https://airtable.com/${AIRTABLE_IDS.DRIVERS_TABLE}/${AIRTABLE_IDS.DRIVERS_VIEW}?blocks=hide`}
                target="_airtable"
              >
                Drivers
              </a>
              <style jsx>{`
                .airtable {
                  opacity: 0.75;
                  padding: 0.75em;
                }

                .airtable:hover {
                  opacity: 1;
                }

                a {
                  color: white;
                }
              `}</style>
            </div>
          }
        >
          <StoreProvider store={store}>
            <EvangelMap
              driversViewID={AIRTABLE_IDS.DRIVERS_VIEW}
              recipientsViewID={AIRTABLE_IDS.RECIPIENTS_VIEW}
            />
          </StoreProvider>
        </LayoutWithUserHeader>
      </Authenticated>
    </>
  );
}
