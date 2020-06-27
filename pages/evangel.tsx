import Head from "next/head";
import { StoreProvider } from "easy-peasy";

import { Authenticated, LayoutWithUserHeader } from "../components/common";
import { EvangelMap } from "../components/EvangelMap";
import { store } from "../components/EvangelMap/store";

export default function Evangel() {
  return (
    <>
      <Head>
        <title>QDSAMA: Evangel</title>
      </Head>

      <Authenticated onSuccessRedirectTo="/evangel">
        <LayoutWithUserHeader>
          <StoreProvider store={store}>
            <EvangelMap />
          </StoreProvider>
        </LayoutWithUserHeader>
      </Authenticated>
    </>
  );
}
