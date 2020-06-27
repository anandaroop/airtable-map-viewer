import React, { useState, useEffect } from "react";

import { getUser, UserProfile } from "../../lib/auth0";

/**
 * When there is a valid Auth0 session, `UserContext` will contain
 * the currently logged in user's profile. It can be accessed via
 * `UserContext.Consumer` or `useContext(UserContext)`.
 */
export const UserContext: React.Context<UserProfile> = React.createContext(
  null
);

interface AuthenticatedProps {
  /**
   * Where to redirect after successful login.
   * Should correspond to the URL where the component
   * being wrapped by <Authenticated> is going to be accessible.
   */
  onSuccessRedirectTo: string;
}

/**
 * Wrap a component with this in order to require a current Auth0 session.
 *
 * Upon finding an active session (via /api/me) the UserContext object will
 * contain the active user profile, and will be made available to any component
 * down the tree via `UserContext.Consumer` or `useContext(UserContext)`.
 */
export const Authenticated: React.FC<AuthenticatedProps> = ({
  onSuccessRedirectTo: redirectTo,
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
