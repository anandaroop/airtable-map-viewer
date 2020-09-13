import Head from "next/head";
import { FridgesMap } from "../components/FridgesMap";

export default function Fridges() {
  return (
    <>
      <Head>
        <title>QDSAMA: Community Fridges</title>
      </Head>

      <FridgesMap />
    </>
  );
}
