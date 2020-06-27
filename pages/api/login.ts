import { preAuth0 } from "../../lib/auth0";

export default async function login(req, res) {
  try {
    await preAuth0(req).handleLogin(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
