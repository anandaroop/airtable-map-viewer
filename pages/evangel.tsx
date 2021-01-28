import Head from "next/head";

export default function Evangel() {
  return (
    <>
      <Head>
        <title>QDSAMA: Redirect</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <nav>
        Please use the new admin tool instead. Ask in #mutualaid-data-tech if
        you have questions.
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
          color: #666;
        }
      `}</style>
    </>
  );
}
