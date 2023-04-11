''
import React, { Suspense } from 'react'
import Mint from '../ui/Mint'
function Home() {
  return (
    <div>
      <Suspense fallback={'loading'}>
      
      <Mint/>
    </Suspense>
    </div>
  )
}

export default Home