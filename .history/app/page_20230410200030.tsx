
import React, { Suspense } from 'react'
import MintTest from '../ui/MintTest'
async function Home() {
  return (
    <div>
      <Suspense fallback={'loading'}>
      <MintTest/>
    </Suspense>
    </div>
  )
}

export default Home