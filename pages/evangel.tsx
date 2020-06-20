import Head from "next/head";
import { StoreProvider } from "easy-peasy";

import { EvangelMap } from "../components/EvangelMap";
import { store } from "../components/EvangelMap/store";

export default function Evangel() {
  return (
    <>
      <Head>
        <title>QDSAMA: Evangel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StoreProvider store={store}>
        <EvangelMap />
      </StoreProvider>
    </>
  );
}
