import Head from 'next/head'
import { StoreProvider } from 'easy-peasy';

import { Authenticated, LayoutWithUserHeader } from "../components/common";

import { MapViewer } from "../components/OldVolunteersAndRequests/MapViewer";
import { store } from "../components/OldVolunteersAndRequests/store";

export default function VolunteersAndRequests() {
  return (
    <>
      <Head>
        <title>QDSAMA: Volunteers and Requests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Authenticated onSuccessRedirectTo="/volunteers-and-requests">
        <LayoutWithUserHeader>
          <StoreProvider store={store}>
            <MapViewer />
          </StoreProvider>
        </LayoutWithUserHeader>
      </Authenticated>
    </>
  )
}
