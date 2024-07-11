"use server";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: NextRequest) {
  noStore();
  const urlObject = new URL(req.url);
  const user = urlObject.searchParams.get("user") || "DefaultStream";
  const pfp = urlObject.searchParams.get("pfp") || "https://i.imgur.com/tWXF6qY.png";
  let url = "https://i.imgur.com/4gPNeLW.png";

  const element = (
    <div
      style={{
        width: "955px", // Set the desired width for the output image
        height: "955px", // Set the desired height for the output image
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        position: "relative",
      }}
    >
      <p
        style={{
          position: "absolute",
          top: "610px",
          left: "45%",
          transform: "translate(-50%, -60%)", // Center text horizontally and vertically around the specified position
          fontSize: "60px",
          fontFamily: "Geist",
          fontWeight: "bold",
          margin: "0",
          textAlign: "center",
          color: "blue",
          fontStyle: "italic",
        }}
      >{`@${user}`}</p>
    </div>
  );

  const options = {
    width: 955,
    height: 955, 
  };

  return new ImageResponse(element, options);
}
