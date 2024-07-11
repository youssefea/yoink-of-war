export const runtime = "edge";
import { channel } from "diagnostics_channel";
import { URL, DEBUGGER_HUB_URL } from "../../../constants";

const imageDefault = "https://i.imgur.com/vmNf5PJ.png";
const buttonText1 = "🎩 Subscribe";
const buttonText2 = "🫂 Go to AlfaFrens";

export default async function Home({ params }: { params: { channelAddress: string } }) {
  const channelAddress = params.channelAddress;

  return (
    <div>
      <html lang="en">
        <head>
          <meta
            httpEquiv="refresh"
            content={`0; https://www.alfafrens.com/channel/${channelAddress}`}
          />
        </head>
      </html>
      <a href="https://alfafrens.com" target="_blank" rel="no-opener">
        <img
          src={imageDefault}
          width={400}
          height={400}
          alt="Alfafrens Post Frame"
          style={{ marginBottom: "20px" }}
        />
      </a>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { channelAddress: string };
}) {
  const channelAddress = params.channelAddress;
  const postData = await fetch(
    `https://www.alfafrens.com/api/v0/getChannelOwner?channelAddress=${channelAddress.toLocaleLowerCase()}`
  );
  const postDataJson = await postData.json();
  const ownerFid = postDataJson.users.fid;

  const [usernameData, imgData, channelData] = await Promise.all([
    fetch(`https://hubble.x.superfluid.dev/v1/userDataByFid?fid=${ownerFid}&user_data_type=6`),
    fetch(`https://hubble.x.superfluid.dev/v1/userDataByFid?fid=${ownerFid}&user_data_type=1`),
    fetch(`https://www.alfafrens.com/api/v0/getChannel?channelAddress=${channelAddress}`)
  ]);
  
  const usernameJson = await usernameData.json();
  const imgJson = await imgData.json();
  const userHandle = usernameJson.data.userDataBody.value;
  const userImage = imgJson.data.userDataBody.value;

  const channelJson = await channelData.json();
  const channelCategory=Math.floor((channelJson.totalSubscriptionFlowRate/channelJson.numberOfSubscribers)/190258751902587);

  const image = `${URL}/images/channelImg?user=${userHandle}&category=${channelCategory}&pfp=${userImage}`;

  const meta = {
    "og:image": imageDefault,
    "fc:frame": "vNext",
    "fc:frame:image": image,
    "fc:frame:image:aspect_ratio": "1:1",
    "fc:frame:button:1": buttonText1,
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": `https://www.alfafrens.com/channel/${channelAddress}`,
    "fc:frame:button:2": buttonText2,
    "fc:frame:button:2:action": "link",
    "fc:frame:button:2:target": "https://alfafrens.com",
  };

  return {
    openGraph: {
      images: [
        {
          url: imageDefault,
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
