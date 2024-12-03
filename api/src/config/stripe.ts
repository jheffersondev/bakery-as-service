import Stripe from 'stripe'
import env from './env'

const stripe = new Stripe(
  env.stripe.secretKey === undefined ? '' : env.stripe.secretKey,
  {
    apiVersion: '2020-08-27',
  }
)

export default stripe
