import { useContext, ReactElement } from "react";

import { UserContext } from "./Authenticated";
import Head from "next/head";

/**
 * Wrap a component with this in order to provide a standard fixed
 * header and content area suitable for a SPA type of layout.
 *
 * `<header>` will include the current username and a logout link.
 *
 * `<main>` will include the children passed into the component.
 *
 */
export const LayoutWithUserHeader: React.FC<{
  additionalLinks?: ReactElement;
}> = ({ children, additionalLinks }) => {
  const user = useContext(UserContext);
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="container">
        <header>
          <nav className="links">
            <a href="https://www.queensdsamutualaid.org/">
              <div className="logo"></div>
            </a>
            <div className="additional-links">{additionalLinks}</div>
          </nav>
          <div className="user">
            <span className="name">{user.nickname}</span>
            <span className="logout">
              <a href="/api/logout">Logout</a>
            </span>
          </div>
        </header>

        <main>{children}</main>
      </div>

      <style jsx global>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: "Fira Sans", sans-serif;
            font-variation-settings: "wght" 600;
          }
        `}
      </style>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
        }

        header {
          background-color: #e7212f;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1em;
          flex: 1 0 3rem;
        }

        header .logo {
          width: 8rem;
          height: 3rem;
          background-image: url(/queens-dsa.png);
          background-position: left;
          background-size: auto 4rem;
          background-repeat: no-repeat;
          background-color: #e7212f;
          margin-right: 2em;
        }

        header .links {
          display: flex;
          align-items: center;
        }

        header .user .name {
          margin-right: 1em;
        }

        header .user {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        header .user .logout a {
          color: white;
        }

        main {
          flex: 1 0 calc(100vh - 3rem);
          overflow: hidden;
        }
      `}</style>
    </>
  );
};
