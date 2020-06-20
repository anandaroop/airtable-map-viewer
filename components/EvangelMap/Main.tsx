export const Main = ({ children, direction = "row" }) => {
  return (
    <>
      <main>{children}</main>

      <style jsx>
        {`
          main {
            display: flex;
            flex-direction: ${direction};
          }
        `}
      </style>
      <style jsx global>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          h1,
          h2,
          h3,
          p,
          li {
            margin-top: 1em;
            margin-bottom: 1em;
          }

          li {
            margin-left: 1em;
          }

          ul {
          }

          body {
            font-family: sans-serif;
          }
        `}
      </style>
    </>
  );
};
