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

export async function POST(req: Request,{ params }: { params: { id: string } }) {
  const data = await req.json();
  const id=params.id;
  const idArray=id.split("-");
  const challengedUsername=idArray[0];
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
        `${URL}/challenge/transactionStatus/creation/${id}`,
      )
    );
  }
  
  const transactionStatus = transaction.status;
  if (transactionStatus !== "success") {
    return new NextResponse(
      _html(
        txFailed,
        "Restart",
        "post",
        `${URL}`,
      )
    );
  }

  const challengerUsername=frameMessage.requesterUserData?.username
  const challengerAddress=transaction.from
  await kv.hset("usersAddresses", {[`${challengerUsername}`]: challengerAddress});
  return new NextResponse(
    _html(
      `${URL}/images/challengeCreated?user1=${challengerUsername}&user2=${challengedUsername}&startOrEnd=start`,
      "Share",
      "link",
      `https://warpcast.com/~/compose?text=I+am+challenging+@${challengedUsername}+to+a+game+of+Yoink+of+War%3F&embeds%5B%5D=${URL}/challenge/new/${id}`,
    )
  );
}

export const dynamic = "force-dynamic";
