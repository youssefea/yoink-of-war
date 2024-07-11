export const runtime = 'edge'
import { URL } from '../../constants'


const image = "https://i.imgur.com/78Yxzdb.png";
const buttonText1 = '🎩 Check'
const buttonText2 = '💙 Sign up to AlfaFrens'

export default function Home() {
  return (
    <div>
      <a href="https://alfafrens.com" target="_blank" rel="no-opener">
      <img
        src={image}
        width={400}
        height={400}
        alt='Alfafrens Frames'
      />
      </a>
    </div>
  );
}

export async function generateMetadata() {
  const meta = {
    'og:image': image,
    'fc:frame': 'vNext',
    'fc:frame:image': image,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': buttonText1,
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:1:target': `${URL}/airdrop1/check`,
    'fc:frame:post_url': `${URL}/airdrop1/check`,
    'fc:frame:button:2': buttonText2,
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://alfafrens.com',

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