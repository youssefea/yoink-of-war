import { NextResponse } from "next/server";
import { init } from "@airstack/node";
import { URL, DEBUGGER_HUB_URL } from "./../../../constants";
import { getFrameMessage } from "frames.js";
import lists from "./../lists.json";

init(process.env.AIRSTACK_KEY || "");

const didNotRecast = "https://i.imgur.com/9rQX6Wc.png";
const messageInvalid = "https://i.imgur.com/tyfcDKu.png";
const notSignedUp = "https://i.imgur.com/EwLoFLD.png";
const dontQualify="https://i.imgur.com/z3Vmu1q.png";

const creatorsList= lists.creatorsChannels;
const subscribersList= lists.subscribersWallets;

const _html = (img, msg1, action1, url1, msg2, action2, url2) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Frame</title>
    <meta property="og:image" content="${img}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${img}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="${msg1}" />
    <meta property="fc:frame:button:1:action" content="${action1}" />
    <meta property="fc:frame:button:1:target" content="${url1}" />
    <meta property="fc:frame:button:2" content="${msg2}" />
    <meta property="fc:frame:button:2:action" content="${action2}" />
    <meta property="fc:frame:button:2:target" content="${url2}" />
    <meta property="fc:frame:button:1:post_url	" content="${url1}" />
    <meta property="fc:frame:button:2:post_url	" content="${url2}" />
  </head>
</html>
`;

export async function POST(req: Request) {
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
        `${URL}/airdrop1`,
        "🫂 Sign up to Alfafrens",
        "link",
        "https://alfafrens.com"
      )
    );
  }

  if (!frameMessage.recastedCast) {
    return new NextResponse(
      _html(
        didNotRecast,
        "🎩 Retry",
        "post",
        `${URL}/airdrop1`,
        "Sign up to Alfafrens",
        "link",
        "https://alfafrens.com"
      )
    );
  }
  const userInfoFetch: any = await fetch(
    `https://dev.alfafrens.com/api/trpc/data.getUserByFid?fid=${frameMessage.requesterFid}`
  );
  
  if (!userInfoFetch || !userInfoFetch.ok) {
    return new NextResponse(
      _html(
        notSignedUp,
        "🎩 Retry",
        "post",
        `${URL}/airdrop1`,
        "Sign up to Alfafrens",
        "link",
        "https://alfafrens.com"
      )
    );
  }
  const userInfoData = await userInfoFetch.json();
  const userWallet= userInfoData?.result.data?.aa_address?.toLowerCase();
  const userChannel= userInfoData?.result.data?.channels?.channeladdress?.toLowerCase();

  const isCreatorAirdrop=creatorsList.includes(userChannel);
  const isSubscriberAirdrop=subscribersList.includes(userWallet);

  if(isCreatorAirdrop){
    return new NextResponse(
      _html(
        `${URL}/images/airdropImg?user=${frameMessage.requesterUserData?.username}&airdrop=creator`,
        "🎩 Re-Check",
        "post",
        `${URL}/airdrop1/`,
        "💙 Sign up to AlfaFrens",
        "link",
        "https://alfafrens.com"
      )
    );
  }

  if(isSubscriberAirdrop){
    return new NextResponse(
      _html(
        `${URL}/images/airdropImg?user=${frameMessage.requesterUserData?.username}&airdrop=subscriber`,
        "🎩 Re-Check",
        "post",
        `${URL}/airdrop1/`,
        "💙 Sign up to AlfaFrens",
        "link",
        "https://alfafrens.com"
      )
    );
  }

  return new NextResponse(
    _html(
      dontQualify,
      "🎩 Re-Check",
      "post",
      `${URL}/airdrop1/`,
      "💙 Sign up to AlfaFrens",
      "link",
      "https://alfafrens.com"
    )
  );
}

export const dynamic = "force-dynamic";
