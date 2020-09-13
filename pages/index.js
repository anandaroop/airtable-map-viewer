import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>QDSAMA</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <nav>
        <a href="evangel">Route planning tool</a>

        {/*
          // BORKED
          <a href="volunteers-and-requests">Volunteers and requests</a>
         */}
      </nav>
      <style jsx>{`
        nav {
          font-family: "Fira Sans", sans-serif;
          font-weight: 500;
          font-size: 1.5em;

          padding: 2em;
          display: flex;
          flex-flow: row wrap;
          list-style-type: none;
        }
        a {
          width: 10em;
          border: solid 1px #e7212f;
          border-radius: 0.25em;
          margin: 0 2em 0 0;
          padding: 1em;
          line-height: 1.6;
          text-decoration: none;
          color: #e7212f;
        }
        a:hover {
          background: #e7212f;
          color: white;
        }
      `}</style>
    </>
  )
}
