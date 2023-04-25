
import React, { Suspense } from 'react'
import Mint from '../ui/Mint'
import { tokenGate } from 'lib/tokenGate';
import { useAccount } from 'wagmi'


async function Home() {
  const contract = "0xe95Cc033c0a0718D8daC521287ab46D80c8Dc073";
  const address = "0x690A0e1Eaf12C8e4734C81cf49d478A2c6473A73"
  

    const info = tokenGate({address, contract})
    console.log(info)
  return (
    <Suspense>
    <div>
      <Mint/>
    </div></Suspense>
  )
}

export default Home