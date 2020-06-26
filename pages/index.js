import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>QDSAMA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul>
        <li>
          <a href="evangel">Evangel Map</a>
        </li>
        {/* <li>
          // BORKED
          <a href="volunteers-and-requests">Volunteers and requests</a>
        </li> */}
      </ul>
    </>

  )
}
