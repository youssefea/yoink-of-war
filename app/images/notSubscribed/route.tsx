"use server";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: NextRequest) { // Background image URL
  const urlObject = new URL(req.url);
  const user = urlObject.searchParams.get("user") || "DefaultStream";
  const url = "https://i.imgur.com/PtBjqxn.png";

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${url})`,
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
          top: "720",
          left: "50%",
          fontSize: "50px",
          fontFamily: "Geist Mono",
          fontWeight: "bold",
          margin: "0 0 20px 0",
          textAlign: "center",
          color: "blue",
          transform: "translate(-50%, -50%)",
        }}
      >{`@${user}`}</p>
    </div>
  );

  const options = {
    width: 955, // Set the desired width for the output image
    height: 955, // Set the desired height for the output image
  };

  return new ImageResponse(element, options);
}
