import { preAuth0 } from "../../lib/auth0";

export default async function callback(req, res) {
  try {
    await preAuth0(req).handleCallback(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
