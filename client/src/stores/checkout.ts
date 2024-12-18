import { ref, type Ref, type ShallowRef } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_PLAN_OBJECT } from '../../config.json'

export const useCheckoutStore = defineStore('checkout', {
  state: (): {
    card: any
    stripe: any | null
    elements: any | null
    formState: {
      name: string
      city: string
      state: string
      zipcode: string
      addressSameAsShipping?: Ref<boolean> 
    }
    formRef: ShallowRef | null
    loading: boolean
    cardHasError: boolean
    error: any | null
    plan: any | null
  } => ({
    card: null,
    stripe: null,
    elements: null,
    formState: {
      name: '',
      city: '',
      state: '',
      zipcode: '',
      addressSameAsShipping: ref(false),
    },
    formRef: null,
    loading: false,
    cardHasError: false,
    error: null,
    plan: localStorage.getItem('chosenPlan') || DEFAULT_PLAN_OBJECT,
  }),

  actions: {
    setChosenPlan(plan: any) {
      this.plan = plan
      localStorage.setItem('chosenPlan', JSON.stringify(plan))
    },

    setLoading(value: boolean) {
      return (this.loading = value)
    },
  },
})
