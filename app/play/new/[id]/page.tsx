export const runtime = 'edge'
import { URL } from '../../../../constants'
import {kv} from '@vercel/kv'

const image = "https://i.imgur.com/M6b5MFy.png";
const buttonText1 = 'Play'
const buttonText2 = 'Game Rules'

export default function Home() {
  return (
    <div>
      <a href="https://yoink.club" target="_blank" rel="no-opener">
      <img
        src={image}
        width={400}
        height={400}
        alt='Yoink of war'
      />
      </a>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  console.log(id)
  const idArray = id.split('-');
  const user1 = idArray[0];
  const user2 = idArray[1];
  const frameImg=`${URL}/images/challengeAccepted?user1=${user1}&user2=${user2}&startOrEnd=end`

  const gameAddress = await kv.hget("gamesAddresses", `${user1}vs${user2}`);
  
  const meta = {
    'og:image': image,
    'fc:frame': 'vNext',
    'fc:frame:image': frameImg,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': buttonText1,
    'fc:frame:button:1:action': 'tx',
    'fc:frame:button:1:target': `${URL}/play/check/`,
    'fc:frame:button:1:post_url': `${URL}/challenge/accepted/${user1}`,
    'fc:frame:button:2': buttonText2,
    'fc:frame:button:2:action': 'post',
    'fc:frame:button:2:post_url': `${URL}/airdrop1`,
    'fc:frame:button:2:target': `${URL}/airdrop1`,

  }

  return {
    openGraph: {
      images: [
        {
          url: image,
          width: '1000',
          height: '1000'
        }
      ]
    },
    other: {
      ...meta
    },
  }
}