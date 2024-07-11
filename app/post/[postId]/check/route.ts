import { NextResponse } from "next/server";
import { URL, DEBUGGER_HUB_URL } from "../../../../constants";
import { getFrameMessage } from "frames.js";

// USDC contract address on Base
const contractAddress: any = process.env.STREAMYOINK_CONTRACT_ADDRESS;
const superTokenAddress = process.env.SUPER_TOKEN_ADDRESS as `0x${string}`;

const notSignedUp = "https://i.imgur.com/37jDYJq.png";
const notSubscribed = "https://i.imgur.com/PtBjqxn.png";
const notOnAlfafrens = "https://i.imgur.com/gSPd0wf.png";

const messageInvalid = "https://i.imgur.com/PtbnKV8.png";
const _html = (img, msg1, action1, url1, msg2, action2, url2) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Frame</title>
    <meta property="og:image" content="${img}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${img}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="${msg1}" />
    <meta property="fc:frame:button:1:action" content="${action1}" />
    <meta property="fc:frame:button:1:target" content="${url1}" />
    <meta property="fc:frame:button:2" content="${msg2}" />
    <meta property="fc:frame:button:2:action" content="${action2}" />
    <meta property="fc:frame:button:2:target" content="${url2}" />
    <meta property="fc:frame:post_url" content="${url1}" />
  </head>
</html>
`;
const _html1 = (img, msg1, action1, url1, msg2, action2, url2) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Frame</title>
    <meta property="og:image" content="${img}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${img}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="${msg1}" />
    <meta property="fc:frame:button:1:action" content="${action1}" />
    <meta property="fc:frame:button:1:target" content="${url1}" />
    <meta property="fc:frame:button:2" content="${msg2}" />
    <meta property="fc:frame:button:2:action" content="${action2}" />
    <meta property="fc:frame:button:2:target" content="${url2}" />
  </head>
</html>
`;

function truncatePostText(postText: string): string {
  const maxLength = 270;
  const truncateLength = 250;
  const suffix = " [...]";

  if (postText != null) {
    if (postText.length > maxLength) {
      return postText.slice(0, truncateLength) + suffix;
    }
  }

  return postText;
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const data = await req.json();

  const frameMessage = await getFrameMessage(data, {
    hubHttpUrl: DEBUGGER_HUB_URL,
  });

  if (!frameMessage || !frameMessage.isValid) {
    return new NextResponse(
      _html(
        messageInvalid,
        "🎩 Retry",
        "post",
        `${URL}/post/${params.postId}`,
        "🫂 Sign up to Alfafrens",
        "link",
        "https://alfafrens.com"
      )
    );
  }

  const postData = await fetch(
    `https://dev.alfafrens.com/api/trpc/services.post?postid=${params.postId}`,
    { headers: { Authorization: `Bearer ${process.env.ALFAFRENS_API_TOKEN}` } }
  );
  const postDataJson = await postData.json();
  const ownerFid = postDataJson.result?.data?.fid;

  const userInfoFetch = await fetch(
    `https://www.alfafrens.com/api/trpc/services.userInfo?fid=${ownerFid}`
  );
  if (!userInfoFetch || !userInfoFetch.ok) {
    return new NextResponse(
      _html(
        notSignedUp,
        "🎩 Retry",
        "post",
        `${URL}/post/${params.postId}`,
        "🫂 Sign up to Alfafrens",
        "link",
        "https://alfafrens.com"
      )
    );
  }
  const userInfoData = await userInfoFetch.json();
  const channelAddress = userInfoData.result.data.channels.channeladdress;

  const isSubscribedFetch: any = await fetch(
    `https://www.alfafrens.com/api/v0/isUserByFidSubscribedToChannel?fid=${frameMessage.requesterFid}&channelAddress=${channelAddress}`
  );
  if (!isSubscribedFetch || !isSubscribedFetch.ok) {
    return new NextResponse(
      _html(
        notOnAlfafrens,
        "🎩 Retry",
        "post",
        `${URL}/post/${params.postId}`,
        "🫂 Sign up to Alfafrens",
        "link",
        "https://alfafrens.com"
      )
    );
  }
  const isSubscribedData = await isSubscribedFetch.json();
  const isSubscribed = isSubscribedData;

  const userData = await fetch(
    `${DEBUGGER_HUB_URL}/v1/userDataByFid?fid=${ownerFid}&user_data_type=6`
  );
  const userDataJson = await userData.json();
  const userHandle = userDataJson.data.userDataBody.value;

  if (!isSubscribed && ownerFid !== frameMessage.requesterFid) {
    return new NextResponse(
      _html(
        `${URL}/images/notSubscribed?user=${userHandle}`,
        "🎩 Retry",
        "post",
        `${URL}/post/${params.postId}`,
        "🫂 Subscribe to channel",
        "link",
        `https://alfafrens.com/channel/${channelAddress}`
      )
    );
  }
  const postText = truncatePostText(postDataJson.result.data.content);
  const postImg = postDataJson.result.data.imageurl;

  let truncated = "false";

  if (postText != postDataJson.result.data.content) {
    truncated = "true";
  }

  if (postImg == null) {
    return new NextResponse(
      _html1(
        `${URL}/images/postContent?user=${userHandle}&text=${postText}&truncated=${truncated}`,
        "📋 Open Message Content",
        "link",
        `${URL}/post/display?text=${postDataJson.result.data.content}`,
        "🫂 Go to channel",
        "link",
        `https://alfafrens.com/channel/${channelAddress}`
      )
    );
  }

  if (
    !postImg.endsWith(".jpg") &&
    !postImg.endsWith(".png") &&
    !postImg.endsWith(".jpeg") &&
    !postImg.endsWith(".gif") &&
    !postImg.endsWith(".webp")
  ) {
    return new NextResponse(
      _html1(
        `${URL}/images/postContent?user=${userHandle}&text=${postText}&attachedOther=true&truncated=${truncated}`,
        "📋 Open Message Content",
        "link",
        `${URL}/post/display?text=${postDataJson.result.data.content}`,
        "🫂 Go to channel",
        "link",
        `https://alfafrens.com/channel/${channelAddress}`
      )
    );
  }

  return new NextResponse(
    _html1(
      `${URL}/images/postContent?user=${userHandle}&text=${postText}&image=${postImg}&truncated=${truncated}`,
      "📋 Open Message Content",
      "link",
      `${URL}/post/display?image=${postImg}&text=${postDataJson.result.data.content}`,
      "🫂 Go to channel",
      "link",
      `https://alfafrens.com/channel/${channelAddress}`
    )
  );
}

export const dynamic = "force-dynamic";
