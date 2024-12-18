import { defineStore } from 'pinia'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { API_URL } from '../../config.json'

export const useAuthStore = defineStore('storeId', {
  state: (): {
    userToken: string | null
    user: {
      id: string
      name: string
      email: string
      stripe: {
        stripeCustomerId?: string | null
        stripeSubscriptionId?: string | null
      }
    } | null
  } => ({
    userToken: localStorage.getItem('userToken'),
    user: null,
  }),

  persist: true,

  actions: {
    login(email: string, password: string) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${API_URL}/login`, {
            email,
            password,
          })
          .then((res) => {
            return resolve(res)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },

    signUp(name: string, email: string, password: string) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${API_URL}/signup`, {
            name,
            email,
            password,
          })
          .then((res) => {
            return resolve(res)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },

    setUserToken(token: string) {
      this.userToken = token
      this.user = jwtDecode(token)
      localStorage.setItem('userToken', token)
    },

    setUserDetails(user: any) {
      this.user = user
    },

    subscriptionChange(newSubId: string) {
      if (this.user) {
        this.user.stripe.stripeSubscriptionId = newSubId
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('userToken')
    },
  },

  getters: {
    getStripeSubscriptionId(): string | null {
      return this.user?.stripe.stripeSubscriptionId ? this.user?.stripe.stripeSubscriptionId : null
    },

    getStripeCustomerId(): string | null {
      return this.user?.stripe.stripeCustomerId ? this.user?.stripe.stripeCustomerId : null
    },
  },
})
