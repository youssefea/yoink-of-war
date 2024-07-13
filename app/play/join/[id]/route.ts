import { NextResponse, NextRequest } from "next/server";
import { URL, DEBUGGER_HUB_URL, gameStep } from "../../../../constants";
import { getFrameMessage } from "frames.js";
import { encodeFunctionData } from "viem";
import { cfaForwarderABI } from "../../../abi";

const tokenAddress=process.env.SUPER_TOKEN_ADDRESS as `0x${string}`;
const cfaForwarderAddress=process.env.CFA_FORWARDER_ADDRESS as `0x${string}`;


export async function POST(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const id = params.id.toLocaleLowerCase();
  const receiverAddress = id;
  const flowRate = gameStep

  const frameMessage = await getFrameMessage(data, {
    hubHttpUrl: DEBUGGER_HUB_URL,
  });

  const flowRateWeiPerSecond= Math.floor(flowRate * (10 ** 18)/86400);

  const encodedData = encodeFunctionData({
    abi: cfaForwarderABI,
    functionName: "setFlowrate",
    args:[tokenAddress, receiverAddress, flowRateWeiPerSecond]
  });

  return NextResponse.json({
    method: "eth_sendTransaction",
    chainId: "eip155:10",
    params: {
      abi: cfaForwarderABI,
      to: cfaForwarderAddress,
      data: encodedData,
    },
  });
}
