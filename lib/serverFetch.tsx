import { alchemyApiKey, alchemyOptions, contract } from "./fatchVars"


export async function getDomain(address:any){
const r = await fetch(`https://polygon-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}/getNFTsForOwner?owner=${address}&contractAddresses[]=${contract}&withMetadata=true`, alchemyOptions as any)
return r
}

