export const runtime = 'edge'
import { URL } from '../constants'


const image = "https://i.imgur.com/M6b5MFy.png";
const buttonText1 = 'Challenge'
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

export async function generateMetadata() {
  const meta = {
    'og:image': image,
    'fc:frame': 'vNext',
    'fc:frame:image': image,
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:button:1': buttonText1,
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:1:target': `${URL}/challenge`,
    'fc:frame:button:1:post_url': `${URL}/challenge`,
    'fc:frame:button:2': buttonText2,
    'fc:frame:button:2:action': 'post',
    'fc:frame:button:2:post_url': `${URL}/rules`,
    'fc:frame:button:2:target': `${URL}/rules`,
    'fc:frame:input:text': 'Enter username',

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