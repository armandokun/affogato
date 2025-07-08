import { cookies } from 'next/headers'

import ClientCheckoutSuccessPage from './checkout-success-page'

const CheckoutSuccessPage = async () => {
  const cookieStore = await cookies()

  const fbpValue = cookieStore.get('fbp_value')?.value
  const fbpCurrency = cookieStore.get('fbp_currency')?.value

  return <ClientCheckoutSuccessPage fbpValue={fbpValue} fbpCurrency={fbpCurrency} />
}

export default CheckoutSuccessPage
