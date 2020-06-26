import { useContext } from "react";

import { UserContext } from "./Authenticated";

export const Layout: React.FC = ({ children }) => {
  const user = useContext(UserContext);
  return (
    <>
      <div className="container">
        <header>
          <a href="https://www.queensdsamutualaid.org/">
            <div className="logo"></div>
          </a>
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

          flex: 1 0 2rem;
        }

        header .logo {
          width: 8rem;
          height: 2rem;
          background-image: url("https://static.wixstatic.com/media/8932f3_63ea4ef1df484e98a7b73a3fc6f02915~mv2.png/v1/fill/w_453,h_235,al_c,q_85,usm_0.66_1.00_0.01/queens-dsa.webp");
          background-position: left;
          background-size: auto 3rem;
          background-repeat: no-repeat;
          background-color: #e7212f;
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
          flex: 1 0 calc(100vh - 2rem);
        }
      `}</style>
    </>
  );
};
