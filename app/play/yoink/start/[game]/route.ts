import { NextResponse } from "next/server";
import { URL, DEBUGGER_HUB_URL, gameStep, cfaForwarderAddress, tokenAddress } from "../../../../../constants";
import { cfaForwarderABI } from "../../../../abi";
import {account, publicClient, walletClient, accountFromPrivateKey} from "../../../../config";
import { getFrameMessage } from "frames.js";
import { init, fetchQuery } from "@airstack/node";
import {getFidFromHandleQuery} from "../../../../api";
import {kv} from "@vercel/kv"

init(process.env.AIRSTACK_KEY || "");


const messageInvalid = "https://i.imgur.com/GOk5MhJ.png";
const confirmDone="https://i.imgur.com/IV4Sb3X.png"

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

const _html1 = (img, msg1, action1, url1, msg2, action2, url2, msg3, action3, url3 ) => `
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
    <meta property="fc:frame:button:3" content="${msg3}" />
    <meta property="fc:frame:button:3:action" content="${action3}" />
    <meta property="fc:frame:button:3:target" content="${url3}" />
    <meta property="fc:frame:button:3:post_url" content="${url3}" />
  </head>
`;

export async function POST(req: Request, { params }: { params: { game: string } }) {
  const data = await req.json();
  const game=params.game
  const gameArray=game.split("-");
  const gameIndex=gameArray[0];
  const gameAddress=gameArray[1];
  const challengerUsername=gameArray[2];
  const challengedUsername=gameArray[3];

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

  const yoinkerAddress=await kv.hget("usersAddresses",frameMessage.requesterUserData?.username as any);

  let yoinkerFlowRate: any = await publicClient.readContract({
    address: cfaForwarderAddress,
    abi: cfaForwarderABI,
    functionName: "getFlowrate",
    args: [tokenAddress, yoinkerAddress, gameAddress ],
  });

  let startFlowRate: any = await walletClient.writeContract({
    address: cfaForwarderAddress,
    abi: cfaForwarderABI,
    functionName: "setFlowrateFrom",
    account: accountFromPrivateKey,
    args: [tokenAddress, yoinkerAddress, gameAddress, Number(yoinkerFlowRate)+gameStep ],
  });

  return new NextResponse(
    _html1(
      confirmDone,
      "Re-Yoink",
      "post",
      `${URL}/play/yoink/prestart/${game}`,
      "Check Scores",
      "post",
      `${URL}/play/check/${challengerUsername}-${challengedUsername}`,
      "End game?",
      "post",
      `${URL}/play/yoink/end/${game}`,
    )
  );
}

export const dynamic = "force-dynamic";
