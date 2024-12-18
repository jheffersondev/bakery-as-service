import dotenv from 'dotenv'

dotenv.config()

const { JWT_SECRET, PORT, DB_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } =
  process.env

export default {
  jwtSecret: JWT_SECRET,
  port: PORT,
  databaseUrl: DB_URL,
  stripe: {
    secretKey: STRIPE_SECRET_KEY,
    webhookSecret: STRIPE_WEBHOOK_SECRET,
  },
}
