import { redirect } from 'next/navigation'

import { DASHBOARD } from '@/constants/routes'

const Home = async () => {
  redirect(DASHBOARD)
}

export default Home
