import Head from 'next/head'
import { StoreProvider } from 'easy-peasy';

import { MapViewer } from "../components/MapViewer";
import { store } from "../store";

export default function VolunteersAndRequests() {
  return (
    <>
      <Head>
        <title>QDSAMA: Volunteers and Requests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StoreProvider store={store}>
        <MapViewer />
      </StoreProvider>
    </>
  )
}
