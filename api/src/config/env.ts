import dotenv from 'dotenv'

dotenv.config()

export default {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT,
  databaseUrl: process.env.DB_URL,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
}
