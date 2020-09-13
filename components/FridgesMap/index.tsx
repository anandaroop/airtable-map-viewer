import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("./Map"), { ssr: false });

export const FridgesMap = () => {
  return (
    <>
      <MapWithNoSSR />

      <style jsx global>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}
      </style>
    </>
  );
};
