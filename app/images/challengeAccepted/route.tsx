"use server";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { unstable_noStore as noStore } from "next/cache";

const startImg="https://i.imgur.com/9oKqHB8.png"
const endImg="https://i.imgur.com/lsLuKDK.png"

export async function GET(req: NextRequest) { // Background image URL
  const urlObject = new URL(req.url);
  const user1 = urlObject.searchParams.get("user1") || "Mikk";
  const user2 = urlObject.searchParams.get("user2") || "Vijay";
  const startOrEnd = urlObject.searchParams.get("startOrEnd") || "start";

  const img = startOrEnd === "start" ? startImg : endImg;
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
          top: "18%",
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
          top: "38 %",
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
