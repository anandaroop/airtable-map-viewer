import { preAuth0 } from "../../lib/auth0";

export default async function logout(req, res) {
  try {
    await preAuth0(req).handleLogout(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
