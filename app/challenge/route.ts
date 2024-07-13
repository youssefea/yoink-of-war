import { NextResponse } from "next/server";
import { URL, DEBUGGER_HUB_URL } from "../../constants";
import { account } from "./../config";
import { getFrameMessage } from "frames.js";
import { init, fetchQuery } from "@airstack/node";
import { getFidFromHandleQuery } from "./../api";
import { kv } from "@vercel/kv";

init(process.env.AIRSTACK_KEY || "");

const messageInvalid = "https://i.imgur.com/cmuCZV3.png";
const userNameDoesNotExist = "https://i.imgur.com/bE8q47h.png";

const _html = (img, msg1, action1, url1) => `
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
    <meta property="fc:frame:button:1:post_url	" content="${url1}" />
  </head>
</html>
`;

const _html1 = (img, msg1, action1, url1, msg2, action2, url2, post_url2) => `
<!DOCTYPE html>
<head>
    <title>Frame</title>
    <meta property="og:image" content="${img}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${img}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="${msg1}" />
    <meta property="fc:frame:button:1:action" content="${action1}" />
    <meta property="fc:frame:button:1:target" content="${url1}" />
    <meta property="fc:frame:button:1:post_url" content="${url2}" />
    <meta property="fc:frame:button:2" content="${msg2}" />
    <meta property="fc:frame:button:2:action" content="${action2}" />
    <meta property="fc:frame:button:2:target" content="${url2}" />
    <meta property="fc:frame:button:2:post_url" content="${post_url2}" />
  </head>
`;

export async function POST(req: Request) {
  const data = await req.json();

  const frameMessage = await getFrameMessage(data, {
    hubHttpUrl: DEBUGGER_HUB_URL,
  });

  if (!frameMessage || !frameMessage.isValid) {
    return new NextResponse(_html(messageInvalid, "Refresh", "post", `${URL}`));
  }

  const challengedUsername = frameMessage.inputText;
  console.log(challengedUsername);
  const getFidFromHandle = await fetchQuery(
    getFidFromHandleQuery(challengedUsername)
  );
  console.log(getFidFromHandle.data);
  const social = getFidFromHandle.data.Socials.Social;
  if (social.length === 0) {
    return new NextResponse(
      _html(userNameDoesNotExist, "Retry", "post", `${URL}`)
    );
  }

  const challengedFid = social[0].userId;
  const challengerFid = frameMessage.requesterFid;
  const challengerUsername = frameMessage.requesterUserData?.username;
  console.log(challengerUsername);

  const gameIndex: any = await kv.get("gameIndex");
  console.log("gameindex", gameIndex);
  if (!gameIndex) {
    await kv.set("gameIndex", 0);
  }

  const gameAddress = await kv.hget(
    "gameAddresses",
    `${challengerUsername}vs${challengedUsername}`
  );
  if (!gameAddress) {
    const newAccount = account(gameIndex);
    await kv.hset("gamesAddresses", {
      [`${challengerUsername}vs${challengedUsername}`]: newAccount.address,
    });
    await kv.hset("gamesIndexes", {
      [`${challengerUsername}vs${challengedUsername}`]: gameIndex + 1,
    });
    await kv.set("gameIndex", gameIndex+1);
  }

  return new NextResponse(
    _html1(
      `${URL}/images/tryingChallenge?user=${challengedUsername}`,
      "Back",
      "post",
      `${URL}`,
      "Start Challenge",
      "tx",
      `${URL}/challenge/create/${newAccount.address}`,
      `${URL}/challenge/created/${challengedUsername}`
    )
  );
}

export const dynamic = "force-dynamic";
