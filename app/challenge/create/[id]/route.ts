import { NextResponse, NextRequest } from "next/server";
import { URL, DEBUGGER_HUB_URL, gameStep, tokenAddress,cfaForwarderAddress } from "../../../../constants";
import { getFrameMessage } from "frames.js";
import { encodeFunctionData } from "viem";
import { cfaForwarderABI } from "../abi";


export async function POST(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const id = params.id.toLocaleLowerCase();
  const receiverAddress = id;

  const frameMessage = await getFrameMessage(data, {
    hubHttpUrl: DEBUGGER_HUB_URL,
  });

  const encodedData = encodeFunctionData({
    abi: cfaForwarderABI,
    functionName: "grantPermissions",
    args:[tokenAddress, receiverAddress]
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
