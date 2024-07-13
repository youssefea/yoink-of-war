import { NextResponse } from "next/server";
import { URL, DEBUGGER_HUB_URL, cfaForwarderAddress, tokenAddress } from "../../../../constants";
import {account, publicClient} from "../../../config";
import { getFrameMessage } from "frames.js";
import { init, fetchQuery } from "@airstack/node";
import {getFidFromHandleQuery, getTotalStreamedUntilUpdatedQuery, fetchSubgraphData} from "../../../api";
import {kv} from "@vercel/kv"
import {cfaForwarderABI} from "../abi";
import { formatEther } from "viem";

init(process.env.AIRSTACK_KEY || "");


const messageInvalid = "https://i.imgur.com/GOk5MhJ.png";
const battleNotExist="https://i.imgur.com/8Htdqpq.png"
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

const _html1 = (img, msg1, action1, url1,msg2, action2,url2) => `
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

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const id=params.id;
  console.log("id",id)
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
  console.log("challengerAddress",challengerAddress)
  const challengedAddress=await kv.hget("usersAddresses",challengedUsername);
  console.log("challengedAddress",challengedAddress)
  const gameAddress=await kv.hget("gamesAddresses",`${challengerUsername}vs${challengedUsername}`);
  console.log("gameAddress",gameAddress)
  const gameIndex=await kv.hget("gamesIndexes",`${challengerUsername}vs${challengedUsername}`);
  console.log("gameIndex",gameIndex)
  const gameTimestamp= Math.floor(await kv.hget("gamesTimestamps",`${challengerUsername}vs${challengedUsername}`) as number);
  const now=Date.now()/1000;
  
  const challengerTotalStreamedQuery:any=await fetchSubgraphData(getTotalStreamedUntilUpdatedQuery(challengerAddress,gameAddress,gameTimestamp))
  console.log("challengerQuery",challengerTotalStreamedQuery.data)
  const challengerTotalStreamedUntilUpdatedAt=Number(challengerTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0]?.streamedUntilUpdatedAt) ? Number(challengerTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0]?.streamedUntilUpdatedAt) : 0;
  console.log("challengerTotalStreamedUntilUpdatedAt",challengerTotalStreamedUntilUpdatedAt)
  const challengerUpdatedAtTimestamp=Number(challengerTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0]?.updatedAtTimestamp) ? Number(challengerTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0].updatedAtTimestamp) : 0;
  const challengerFlowrate=Number(challengerTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0]?.currentFlowRate) ? Number(challengerTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0]?.currentFlowRate) : 0;
  const challengerMonthlyFlowrate=(Number(formatEther(BigInt(challengerFlowrate)))*60*60*24*30).toFixed(4);
  const challengerTotalStreamed=challengerTotalStreamedUntilUpdatedAt+challengerFlowrate*(now-challengerUpdatedAtTimestamp);
  const challengerTotalStreamedFormatted=Number(formatEther(BigInt(Math.floor(challengerTotalStreamed)))).toFixed(4);

  const challengedTotalStreamedQuery:any=await fetchSubgraphData(getTotalStreamedUntilUpdatedQuery(challengedAddress,gameAddress,gameTimestamp));
  console.log(getTotalStreamedUntilUpdatedQuery(challengedAddress,gameAddress,gameTimestamp))
  console.log("challengedQuery",challengedTotalStreamedQuery.data.accounts?.[0])
  const challengedTotalStreamedUntilUpdatedAt=Number(challengedTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0]?.streamedUntilUpdatedAt) ? Number(challengedTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0].streamedUntilUpdatedAt) : 0;
  console.log("challengedTotalStreamedUntilUpdatedAt",challengedTotalStreamedUntilUpdatedAt)
  const challengedUpdatedAtTimestamp=Number(challengedTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0]?.updatedAtTimestamp) ? Number(challengedTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0].updatedAtTimestamp) : 0;
  console.log("challengedUpdatedAtTimestamp",challengedUpdatedAtTimestamp)
  const challengedFlowrate=Number(challengedTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0]?.currentFlowRate) ? Number(challengedTotalStreamedQuery.data?.accounts?.[0]?.outflows?.[0]?.currentFlowRate) : 0;
  const challengedMonthlyFlowrate=(Number(formatEther(BigInt(challengedFlowrate)))*60*60*24*30).toFixed(4);
  const challengedTotalStreamed=challengedTotalStreamedUntilUpdatedAt+challengedFlowrate*(now-challengedUpdatedAtTimestamp);
  const challengedTotalStreamedFormatted=Number(formatEther(BigInt(Math.floor(challengedTotalStreamed)))).toFixed(4);
  
  const currentWinner = Number(challengerTotalStreamed) > Number(challengedTotalStreamed) ? challengerUsername : challengedUsername;
  const currentLoser = Number(challengerTotalStreamed) > Number(challengedTotalStreamed) ? challengedUsername : challengerUsername;
  
  if (frameMessage.requesterUserData?.username===challengedUsername || frameMessage.requesterUserData?.username===challengerUsername) {
    return new NextResponse(
      _html1(
        `${URL}/images/onevone?currentWinner=${currentWinner}&challenger=${challengerUsername}&challenged=${challengedUsername}&challengerScore=${challengerMonthlyFlowrate}&challengedScore=${challengedMonthlyFlowrate}`,
        "Yoink",
        "post",
        `${URL}/play/yoink/prestart/${gameIndex}-${gameAddress}-${challengerUsername}-${challengedUsername}`,
        "Check again",
        "post",
        `${URL}/play/check/${id}`,
      )
    );
  }

  if (!challengerAddress || !challengedAddress || !gameAddress) {
    return new NextResponse(
      _html(
        battleNotExist,
        "Refresh",
        "post",
        `${URL}`,
      )
    );
  }


  const challengerFlowrateFormatted=formatEther(BigInt(challengerFlowrate));
  const challengedFlowrateFormatted=formatEther(BigInt(challengedFlowrate));

  if (Number(challengerFlowrateFormatted) <= 0 || Number(challengedFlowrateFormatted) <= 0) {
    return new NextResponse(
      _html(
        battleDidnotStart,
        "Refresh",
        "post",
        `${URL}/play/check/${id}`,
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
    )
  );
}

export const dynamic = "force-dynamic";
