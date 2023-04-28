
import React, { Suspense } from 'react'
import Mint from '../ui/Mint'


async function Home() {


  return (
    <Suspense>
    <div>
      <Mint/>
    </div></Suspense>
  )
}

export default Home