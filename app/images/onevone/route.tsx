"use server";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { unstable_noStore as noStore } from "next/cache";
import { url } from "inspector";

const img="https://i.imgur.com/cIFvtfH.png"

export async function GET(req: NextRequest) { // Background image URL
  const urlObject = new URL(req.url);
  const user = urlObject.searchParams.get("user") || "Mikk";
  const challengerBalance=urlObject.searchParams.get("challenger") || "0";
  const challengedBalance=urlObject.searchParams.get("challenged") || "0";

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
      >{`@${user}`}</p>
      <p
        style={{
          position: "absolute",
          top: "76%",
          left: "25%",
          fontSize: "60px",
          fontFamily: "Caveat",
          fontWeight: "bold",
          fontStyle: "italic",
          textAlign: "center",
          color: "red",
          transform: "translate(-50%, -50%)",
        }}
      >{`${challengerBalance}`}</p>
      <p
        style={{
          position: "absolute",
          top: "76%",
          left: "75%",
          fontSize: "60px",
          fontFamily: "Caveat",
          fontWeight: "bold",
          fontStyle: "italic",
          textAlign: "center",
          color: "red",
          transform: "translate(-50%, -50%)",
        }}
      >{`${challengedBalance}`}</p>
    </div>
  );

  const options = {
    width: 955, // Set the desired width for the output image
    height: 955, // Set the desired height for the output image
  };

  return new ImageResponse(element, options);
}