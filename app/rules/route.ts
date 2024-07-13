import { NextResponse } from "next/server";
import { URL, DEBUGGER_HUB_URL } from "../../constants";
import { getFrameMessage } from "frames.js";


const messageInvalid = "https://i.imgur.com/GOk5MhJ.png";
const gameRules="https://i.imgur.com/S8TyY3m.png";


const _html = (img, msg1, action1, url1) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Frame</title>
    <meta property="og:image" content="${img}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${img}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="${msg1}" />
    <meta property="fc:frame:button:1:action" content="${action1}" />
    <meta property="fc:frame:button:1:target" content="${url1}" />
    <meta property="fc:frame:button:1:post_url	" content="${url1}" />
  </head>
</html>
`;

export async function POST(req: Request) {
  const data = await req.json();

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
  

  return new NextResponse(
    _html(
      gameRules,
      "Back",
      "post",
      `${URL}`
    )
  );
}

export const dynamic = "force-dynamic";
