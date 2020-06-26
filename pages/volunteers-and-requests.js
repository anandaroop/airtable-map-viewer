import Head from 'next/head'
import { StoreProvider } from 'easy-peasy';

import { Authenticated } from "../components/Authenticated";
import { Layout } from "../components/Layout";

import { MapViewer } from "../components/MapViewer";
import { store } from "../store";

export default function VolunteersAndRequests() {
  return (
    <>
      <Head>
        <title>QDSAMA: Volunteers and Requests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Authenticated redirectTo="/evangel">
        <Layout>
          <StoreProvider store={store}>
            <MapViewer />
          </StoreProvider>
        </Layout>
      </Authenticated>
    </>
  )
}
