const options = {method: 'GET', headers: {accept: 'application/json'}};

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID_TESTNET
export async function tokenGate({address, contract}: any) {
const r = await fetch(`https://polygon-mumbai.g.alchemy.com/nft/v3/${apiKey}/isHolderOfContract?wallet=${address}&contractAddress=${contract}`, options)
return r

}