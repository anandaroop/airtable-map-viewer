export const Main = ({ children, direction = "row" }) => {
  return (
    <>
      <main>{children}</main>

      <style jsx>
        {`
          main {
            display: flex;
            flex-direction: ${direction};
            width: 100%;
            height: 100vh;
          }
        `}
      </style>
    </>
  );
};
