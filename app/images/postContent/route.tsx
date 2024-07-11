"use server";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: NextRequest) {
  noStore();
  const urlObject = new URL(req.url);
  const user = urlObject.searchParams.get("user") || "UserName";
  const text =
    urlObject.searchParams.get("text") ||
    "Pirate ipsum arrgh bounty warp jack. Piracy bounty ensign boat blimey pirate weigh pirate measured topmast. Shot tea no round swab o'nine hail-shot coxswain killick. Pay spanker six salmagundi tea o'nine. Yer scourge american tea of roger warp.n tea of roger warp.n tea of roger.";
  const imageUrl = urlObject.searchParams.get("image");
  const attachedOther = urlObject.searchParams.get("attachedOther") === "true";
  const truncated = urlObject.searchParams.get("truncated") === "true";

  const hasImage = imageUrl !== null;
  const boxPosition = hasImage ? "flex-end" : "center";
  const fontSize = hasImage ? "22px" : "40px";

  const element = (
    <div
      style={{
        width: "955px",
        height: "955px",
        display: "flex",
        flexDirection: "column",
        justifyContent: boxPosition,
        alignItems: "center",
        backgroundImage: 'url("https://i.imgur.com/3Ln9Auc.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: fontSize,
        color: "#4d4d4d",
        boxSizing: "border-box",
        position: "relative",
        paddingBottom: "40px", // Ensures some padding at the bottom
      }}
    >
      {hasImage && (
        <img
          src={imageUrl}
          alt="Background"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "80%",
            height: "80%",
            objectFit: "contain",
            transform: "translate(-50%, -50%)",
            zIndex: -1,
          }}
        />
      )}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.99)",
          borderRadius: "10px 10px 0 0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          width: "80%",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxSizing: "border-box",
          zIndex: 1,
          position: "relative",
        }}
      >
        <img
          src="https://i.imgur.com/Fi7H5GO.png"
          alt="User Icon"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            marginRight: "10px",
            position: "absolute",
            left: "-40px",
            top: "-40px",
            backgroundColor: "#E2ECFD",
            padding: "5px",
            boxSizing: "border-box",
            zIndex: 2,
          }}
        />
        <span style={{ marginLeft: "50px" }}>
          Message from{" "}
          <span style={{ fontWeight: "bold", color: "#0400F5", marginLeft: "10px" }}>{user}</span>:
        </span>
      </div>
      <div
        style={{
          backgroundColor: "rgba(226, 236, 253, 0.9)",
          borderRadius: "0 0 10px 10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          width: "80%",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        <p style={{ margin: 0, textAlign: "justify", color: "black" }}>{text}</p>
      </div>

      {attachedOther && (
        <p style={{ margin: 0, textAlign: "center", color: "blue", padding: "30px" }}>
          The message also contains some content that can't be rendered in a frame, go to owner's channel to take a peek 👀.
        </p>
      )}
      {truncated && (
        <p style={{ margin: 0, textAlign: "center", color: "blue", padding: "30px" }}>
          This message is long and has been truncated. Click on "Open Message Content" to see the remainder of this message 👀.
        </p>
      )}
    </div>
  );

  const options = {
    width: 955,
    height: 955,
  };

  return new ImageResponse(element, options);
}
