import { NextResponse } from "next/server";
import { URL, DEBUGGER_HUB_URL, gameStep } from "../../../../constants";
import {account, publicClient} from "../../../config";
import { getFrameMessage } from "frames.js";
import { init, fetchQuery } from "@airstack/node";
import {getFidFromHandleQuery} from "../../../api";
import {kv} from "@vercel/kv"

init(process.env.AIRSTACK_KEY || "");


const messageInvalid = "https://i.imgur.com/GOk5MhJ.png";
const win="https://i.imgur.com/b23HaOI.png"
const lose="https://i.imgur.com/WxLXyMr.png"

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

export async function POST(req: Request, { params }: { params: { status: string } }) {
  const data = await req.json();
  const status=params.status

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

  if (status==="win"){
    return new NextResponse(
      _html(
        win,
        "Restart",
        "post",
        `${URL}/`,
      )
    );
  }

  return new NextResponse(
    _html(
      lose,
      "Restart",
      "post",
      `${URL}`,
    )
  );
}

export const dynamic = "force-dynamic";
