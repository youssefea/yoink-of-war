export const runtime = "edge";
import { channel } from "diagnostics_channel";
import { URL, DEBUGGER_HUB_URL } from "../../../constants";

const imageDefault = "https://i.imgur.com/vmNf5PJ.png";


export default async function Home({ params }: { params: { user: string } }) {
  const userHandle = params.user;

  return (
    <div>
      <html lang="en">
        <head>
          <meta
            httpEquiv="refresh"
            content={`0; https://www.alfafrens.com?your_daddy=${userHandle}`}
          />
        </head>
      </html>
      <a href="https://alfafrens.com" target="_blank" rel="no-opener">
        <img
          src={imageDefault}
          width={400}
          height={400}
          alt="Alfafrens Invite Frame"
          style={{ marginBottom: "20px" }}
        />
      </a>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { user: string };
}) {
  const userHandle = params.user;

  const image = `${URL}/images/inviteImg?user=${userHandle}`;

  const meta = {
    "og:image": image,
    "fc:frame": "vNext",
    "fc:frame:image": image,
    "fc:frame:image:aspect_ratio": "1:1",
    "fc:frame:button:1": `🫂 Join ${userHandle}`,
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": `https://www.alfafrens.com?your_daddy=${userHandle}`,
  };

  return {
    openGraph: {
      images: [
        {
          url: image,
          width: "1000",
          height: "1000",
        },
      ],
    },
    other: {
      ...meta,
    },
  };
}
