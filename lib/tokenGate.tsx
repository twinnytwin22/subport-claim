import { alchemyApiKey, alchemyOptions, contract } from "./fatchVars"
export async function tokenGate({address}: any) {
const r = await fetch(`https://polygon-mumbai.g.alchemy.com/nft/v3/${alchemyApiKey}/isHolderOfContract?wallet=${address}&contractAddress=${contract}`, alchemyOptions)
return r

}