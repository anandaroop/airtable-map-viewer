import React, { useState, useEffect } from "react";

import { getUser, UserProfile } from "../lib/auth0";

export const UserContext: React.Context<UserProfile> = React.createContext(
  null
);

interface AuthenticatedProps {
  /**
   * Where to redirect after successful login.
   * Should correspond to the URL where the component
   * being wrapped by <Authenticated> is going to be accessible.
   */
  redirectTo: string;
}
export const Authenticated: React.FC<AuthenticatedProps> = ({
  redirectTo,
  children,
}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkForUser() {
      const user = await getUser();
      setUser(user);
    }

    checkForUser();
  }, []);

  return (
    <>
      {user && (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
      )}

      {!user && (
        <>
          <div className="login">
            <a href={`/api/login?redirectTo=${redirectTo}`}>
              Please login to continue
            </a>
          </div>

          <style jsx>{`
            .login {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 80vh;
              font-size: 2em;
            }

            .login a {
              font-family: sans-serif;
              color: #e7212f;
            }
          `}</style>
        </>
      )}
    </>
  );
};
