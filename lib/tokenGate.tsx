import { alchemyApiKey, alchemyOptions, contract } from "./fatchVars"
export async function tokenGate({address}: any) {
const r = await fetch(`https://polygon-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}/isHolderOfContract?wallet=${address}&contractAddress=${contract}`, alchemyOptions as any)
return r

}