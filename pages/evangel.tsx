import Head from "next/head";
import { StoreProvider } from "easy-peasy";

import { Authenticated, LayoutWithUserHeader } from "../components/common";
import { EvangelMap } from "../components/EvangelMap";
import { store } from "../components/EvangelMap/store";

const AIRTABLE_IDS = {
  // real
  DRIVERS_VIEW: "viwI5p69OfCsAjEE6",
  RECIPIENTS_VIEW: "viwJGcKgSrTDNX6DP",

  // // fake
  // DRIVERS_VIEW: "viwP640WQnuetMCx6",
  // RECIPIENTS_VIEW: "viwQHRE3UzLpGq4wP",
};

export default function Evangel() {
  return (
    <>
      <Head>
        <title>QDSAMA: Evangel</title>
      </Head>

      <Authenticated onSuccessRedirectTo="/evangel">
        <LayoutWithUserHeader>
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
