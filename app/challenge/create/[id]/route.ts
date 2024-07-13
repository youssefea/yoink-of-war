import { NextResponse, NextRequest } from "next/server";
import { URL, DEBUGGER_HUB_URL, gameStep, tokenAddress,cfaForwarderAddress } from "../../../../constants";
import {accountFromPrivateKey, publicClient, walletClient} from "../../../config";
import { getFrameMessage } from "frames.js";
import { encodeFunctionData } from "viem";
import { cfaForwarderABI } from "../abi";

const messageInvalid = "https://i.imgur.com/GOk5MhJ.png";
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

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const id = params.id.toLocaleLowerCase();
  const receiverAddress = id;

  const frameMessage = await getFrameMessage(data, {
    hubHttpUrl: DEBUGGER_HUB_URL,
  });
  
  if(!frameMessage || !frameMessage.isValid) {
    return new NextResponse(
      _html(
        messageInvalid,
        "Refresh",
        "post",
        `${URL}`,
      )
    );
  }

  const encodedData = encodeFunctionData({
    abi: cfaForwarderABI,
    functionName: "grantPermissions",
    args:[tokenAddress, accountFromPrivateKey.address]
  });
  console.log(encodedData);

  return NextResponse.json({
    method: "eth_sendTransaction",
    chainId: "eip155:11155420",
    params: {
      abi: cfaForwarderABI,
      to: cfaForwarderAddress,
      data: encodedData,
    },
  });
}
