"use server";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { unstable_noStore as noStore } from "next/cache";

const imgStart="https://i.imgur.com/ABCs2R9.png"
const imgEnd="https://i.imgur.com/5lCt72O.png"

export async function GET(req: NextRequest) {
  noStore();
  const urlObject = new URL(req.url);
  const user1 = urlObject.searchParams.get("user1") || "Mikk";
  const user2 = urlObject.searchParams.get("user2") || "Vijay";
  const startOrEnd = urlObject.searchParams.get("startOrEnd") || "start";

  const img = startOrEnd === "start" ? imgStart : imgEnd;

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "24px",
      }}
    >
      <p
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          fontSize: "60px",
          fontFamily: "Caveat",
          fontWeight: "bold",
          fontStyle: "italic",
          textAlign: "center",
          color: "red",
          transform: "translate(-50%, -50%)",
        }}
      >{`@${user1}`}</p>
      <p
        style={{
          position: "absolute",
          top: "30 %",
          left: "50%",
          fontSize: "60px",
          fontFamily: "Caveat",
          fontWeight: "bold",
          fontStyle: "italic",
          textAlign: "center",
          color: "red",
          transform: "translate(-50%, -50%)",
        }}
      >{`@${user2}`}</p>

    </div>
  );

  const options = {
    width: 955, // Set the desired width for the output image
    height: 955, // Set the desired height for the output image
  };

  return new ImageResponse(element, options);
}
