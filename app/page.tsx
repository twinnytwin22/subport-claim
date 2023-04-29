
import React, { Suspense } from 'react'
import Mint from '../ui/Mint'
import { supabase } from 'lib/supabase'

async function Home() {
  let { data: users, error } = await supabase
  .from('users')
  .select('wallet_address')

console.log(users)
  return (
    <Suspense>
    <div>
      {users &&
      <Mint users={users}/>}

    </div></Suspense>
  )
}

export default Home