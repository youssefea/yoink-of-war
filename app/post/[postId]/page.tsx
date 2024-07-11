export const runtime = "edge";
import { URL, DEBUGGER_HUB_URL } from "../../../constants";

const imageDefault = "https://i.imgur.com/9VypR9R.png";
const buttonText1 = "👀 See Alfa";
const buttonText2 = "🫂 Sign up to AlfaFrens";

export default async function Home({ params }: { params: { postId: string } }) {
  const postId = params.postId;
  const postData = await fetch(
    `https://dev.alfafrens.com/api/trpc/services.post?postid=${postId}`,
    { headers: { Authorization: `Bearer ${process.env.ALFAFRENS_API_TOKEN}` } }
  );
  const postDataJson = await postData.json();
  const channelAddress = postDataJson.result.data.channeladdress;

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
  params: { postId: string };
}) {
  const postId = params.postId;
  const postData = await fetch(
    `https://dev.alfafrens.com/api/trpc/services.post?postid=${postId}`,
    { headers: { Authorization: `Bearer ${process.env.ALFAFRENS_API_TOKEN}` } }
  );
  const postDataJson = await postData.json();
  const ownerFid = postDataJson.result.data.fid;
  console.log(ownerFid);

  const userData = await fetch(
    `https://hubble.x.superfluid.dev/v1/userDataByFid?fid=${ownerFid}&user_data_type=6`
  );
  const userDataJson = await userData.json();
  const userHandle = userDataJson.data.userDataBody.value;

  const image = `${URL}/images/postHomepage?user=${userHandle}`;

  const meta = {
    "og:image": imageDefault,
    "fc:frame": "vNext",
    "fc:frame:image": image,
    "fc:frame:image:aspect_ratio": "1:1",
    "fc:frame:button:1": buttonText1,
    "fc:frame:button:1:action": "post",
    "fc:frame:button:1:target": `${URL}/post/${postId}/check`,
    "fc:frame:post_url": `${URL}/post/${postId}/check`,
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
