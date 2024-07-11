"use server";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { unstable_noStore as noStore } from "next/cache";
import { url } from "inspector";
import {kv} from "@vercel/kv";

export async function GET(req: NextRequest) { // Background image URL
    noStore();
  const urlObject = new URL(req.url);
  const imgurl=urlObject.searchParams.get("url") || "https://i.imgur.com/Io6j5mY.png";
  const subsDate=urlObject.searchParams.get("subsDate") || "1969-04-20";
  const stakesDate=urlObject.searchParams.get("stakesDate") || "1969-04-20";

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${imgurl})`,
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
          top: "400",
          left: "25%",
          fontSize: "20px",
          fontFamily: "Geist Mono",
          fontWeight: "bold",
          margin: "0 0 20px 0",
          textAlign: "center",
          color: "blue",
          transform: "translate(-50%, -50%)",
        }}
      >{`Subs last export: ${subsDate} ago`}</p>
      <p
        style={{
          position: "absolute",
          top: "450",
          left: "25%",
          fontSize: "20px",
          fontFamily: "Geist Mono",
          fontWeight: "bold",
          margin: "0 0 20px 0",
          textAlign: "center",
          color: "blue",
          transform: "translate(-50%, -50%)",
        }}
      >{`Stakes last export: ${stakesDate} ago`}</p>
    </div>
  );

  const options = {
    width: 955, // Set the desired width for the output image
    height: 500, // Set the desired height for the output image
  };

  return new ImageResponse(element, options);
}
