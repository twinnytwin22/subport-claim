import { MediaRenderer } from "@thirdweb-dev/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";


export const Media = (data: any) => {
const audioUrl = data?.audio
const imageUrl = data?.image

const testImage = "ipfs://QmUHnUjuKjgoe5N1H5hVnGWEcFXiTNfNoAyvRNZBEp5J3r"
const testAudio = "ipfs://QmSDprFUJu1q9e14xGdUnibGkFY3fTF5LAzW9j1DxkY6sH"

  return (
    <div className="mx-auto block content-center">
    <ThirdwebProvider activeChain="ethereum">

    <MediaRenderer src={testAudio} poster={testImage} requireInteraction={false}
   />
    </ThirdwebProvider>
    </div>
  );
}