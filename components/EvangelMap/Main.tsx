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

          p {
            margin: 1em 0;
          }
        `}
      </style>
    </>
  );
};
