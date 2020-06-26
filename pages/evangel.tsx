import Head from "next/head";
import { StoreProvider } from "easy-peasy";

import { Authenticated } from "../components/Authenticated";
import { Layout } from "../components/Layout";

import { EvangelMap } from "../components/EvangelMap";
import { store } from "../components/EvangelMap/store";

export default function Evangel() {
  return (
    <>
      <Head>
        <title>QDSAMA: Evangel</title>
      </Head>

      <Authenticated redirectTo="/evangel">
        <Layout>
          <StoreProvider store={store}>
            <EvangelMap />
          </StoreProvider>
        </Layout>
      </Authenticated>
    </>
  );
}
