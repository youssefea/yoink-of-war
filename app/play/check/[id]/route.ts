import { NextResponse } from "next/server";
import { URL, DEBUGGER_HUB_URL, cfaForwarderAddress, tokenAddress } from "../../../../constants";
import {account, publicClient} from "../../../config";
import { getFrameMessage } from "frames.js";
import { init, fetchQuery } from "@airstack/node";
import {getFidFromHandleQuery} from "../../../api";
import {kv} from "@vercel/kv"
import {cfaForwarderABI} from "../abi";

init(process.env.AIRSTACK_KEY || "");


const messageInvalid = "https://i.imgur.com/cmuCZV3.png";
const battleDidnotStart = "https://i.imgur.com/JN8h6Sh.png";


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

const _html1 = (img, msg1, action1, url1,msg2, action2,url2,post_url2) => `
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

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const id=params.id;
  const idArray = id.split('-');
  const challengerUsername = idArray[0];
  const challengedUsername = idArray[1];

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

  const challengerAddress=await kv.hget("usersAddresses",challengerUsername);
  const challengedAddress=await kv.hget("usersAddresses",challengedUsername);
  const gameAddress=await kv.hget("gamesAddresses",`${challengerUsername}vs${challengedUsername}`);

  const challengerFlowrate = await publicClient.readContract({
    address: cfaForwarderAddress,
    abi: cfaForwarderABI,
    functionName: "getFlowrate",
    args: [tokenAddress, challengerAddress, gameAddress],
  });
  const challengedFlowrate = await publicClient.readContract({
    address: cfaForwarderAddress,
    abi: cfaForwarderABI,
    functionName: "getFlowrate",
    args: [tokenAddress, challengedAddress, gameAddress],
  });

  if (challengerFlowrate as any <= 0 || challengedFlowrate as any <= 0) {
    return new NextResponse(
      _html(
        battleDidnotStart,
        "Refresh",
        "post",
        `${URL}`,
      )
    );
  }

  return new NextResponse(
    _html1(
      `${URL}/images/tryingChallenge?user=${challengedUsername}`,
      "Back",
      "post",
      `${URL}`,
      "Start Challenge",
      "tx",
      `${URL}/play/join/${challengerAddress}-${challengedUsername}`,
      `${URL}/challenge/created/${challengedUsername}`,
    )
  );
}

export const dynamic = "force-dynamic";
