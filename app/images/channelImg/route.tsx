"use server";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: NextRequest) {
  noStore();
  const urlObject = new URL(req.url);
  const user = urlObject.searchParams.get("user") || "DefaultStream";
  const pfp = urlObject.searchParams.get("pfp") || "https://i.imgur.com/tWXF6qY.png";
  const category = urlObject.searchParams.get("category") || "1";
  let url="https://i.imgur.com/Xvf6Z2A.png";

  if (category=="2"){
    url="https://i.imgur.com/aVsphTQ.png"
  }
  
  if (category=="3"){
    url="https://i.imgur.com/3PMyFIi.png"
  }

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
        fontSize: "24px",
        position: "relative",
      }}
    >
      <img
        src={pfp}
        alt="Profile Picture"
        style={{
          width: "330px",
          height: "330px",
          borderRadius: "50%",
          objectFit: "cover",
          position: "absolute",
          top: "15%", // Center the image vertically
          left: "34.25%", // Center the image horizontally
          //transform: "translate(-50%, -50%)", // Adjust the image position correctly
          border: "10px white", // Add a white circular border
        }}
      />
      <p
        style={{
          position: "absolute",
          top: "610px",
          left: "50%",
          fontSize: "60px",
          fontFamily: "Geist",
          fontWeight: "bold",
          margin: "0 0 20px 0",
          textAlign: "center",
          color: "blue",
          transform: "translateX(-50%)",
          fontStyle: "italic",
        }}
      >{`@${user}'s channel`}</p>
    </div>
  );

  const options = {
    width: 955, // Set the desired width for the output image
    height: 955, // Set the desired height for the output image
  };

  return new ImageResponse(element, options);
}
