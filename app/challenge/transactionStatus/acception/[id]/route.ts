import { NextResponse } from "next/server";
import { URL, DEBUGGER_HUB_URL, gameStep } from "../../../../../constants";
import {account, publicClient} from "../../../../config";
import { getFrameMessage } from "frames.js";
import { init, fetchQuery } from "@airstack/node";
import {getFidFromHandleQuery} from "../../../../api";
import {kv} from "@vercel/kv"

init(process.env.AIRSTACK_KEY || "");


const messageInvalid = "https://i.imgur.com/GOk5MhJ.png";
const txNotYet="https://i.imgur.com/9PyRZIi.png"
const txFailed="https://i.imgur.com/RyGqmD5.png"

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

const _html1 = (img, msg1, action1, url1, msg2, action2, url2) => `
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
    <meta property="fc:frame:button:2:post_url" content="${url2}" />
  </head>
`;

export async function POST(req: Request,{ params }: { params: { id: string } }) {
  const data = await req.json();
  const id=params.id;
  const idArray=id.split("-");
  console.log(idArray)
  const challengerUsername=idArray[0];
  const transactionId:any=idArray[1]

  const frameMessage = await getFrameMessage(data, {
    hubHttpUrl: DEBUGGER_HUB_URL,
  });

  if (!frameMessage || !frameMessage.isValid) {
    return new NextResponse(
      _html(
        messageInvalid,
        "Refresh",
        "post",
        `${URL}`,
      )
    );
  }

  let transaction;
  try {
    transaction = await publicClient.getTransactionReceipt({ 
      hash: transactionId
    })
  } catch (error) {
    return new NextResponse(
      _html(
        txNotYet,
        "Re-Check",
        "post",
        `${URL}/challenge/transactionStatus/acception/${id}`,
      )
    );
  }

  const challengedUsername=frameMessage.requesterUserData?.username;
  const challengerAddress=transaction.from
  const transactionStatus = transaction.status;
  if (transactionStatus !== "success") {
    return new NextResponse(
      _html(
        txFailed,
        "Restart",
        "post",
        `${URL}/challenge/new/${challengerUsername}-${challengedUsername}`,
      )
    );
  }

  await kv.hset("usersAddresses", {[`${challengedUsername}`]: challengerAddress});
  return new NextResponse(
    _html1(
      `${URL}/images/challengeCreated?user1=${challengerUsername}&user2=${challengedUsername}&startOrEnd=start`,
      "Start Playing",
      "post",
      `${URL}/play/new/${challengerUsername}-${challengedUsername}`,
      "Share",
      "link",
      `https://warpcast.com/~/compose?text=I+accepted+@${challengerUsername}+challenge+to+a+game+of+Yoink+of+War%3F&embeds%5B%5D=${URL}/play/new/${challengerUsername}-${challengedUsername}`,
    )
  );
}

export const dynamic = "force-dynamic";
