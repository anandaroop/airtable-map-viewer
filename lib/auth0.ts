import { initAuth0 } from "@auth0/nextjs-auth0";

// see https://github.com/auth0/nextjs-auth0
// for configuration options

const defaultSettings = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: "openid profile",
  redirectUri: "http://localhost:3000/api/callback",
  postLogoutRedirectUri: "http://localhost:3000/",
  session: {
    cookieSecret: "process.env.RANDOMLY_GENERATED_SECRET lolololol",
  },
  oidcClient: {
    httpTimeout: 2500,
    clockTolerance: 10000,
  },
};

export const preAuth0 = (req) => {
  const deploymentUrl = req.headers
    ? req.headers["x-custom-host"] || req.headers?.host || null
    : null;

  const settings = {
    redirectUri:
      process.env.REDIRECT_URI || "https://" + deploymentUrl + "/api/callback",
    postLogoutRedirectUri:
      process.env.POST_LOGOUT_REDIRECT_URI || "https://" + deploymentUrl + "/",
  };

  return initAuth0({
    ...defaultSettings,
    ...settings,
  });
};

/**
 *
 */
export function getUser(): Promise<UserProfile> {
  return new Promise((resolve, reject) => {
    fetch(`/api/me`)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          response.text().then((message) => {
            reject(message);
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export interface UserProfile {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  sub: string;
}
