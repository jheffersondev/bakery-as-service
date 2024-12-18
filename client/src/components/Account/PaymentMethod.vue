<template>
  <a-card>
    <template #title>
      <h1><CreditCardOutlined />&nbsp; Payment method</h1>
    </template>
    <a-spin tip="Loading details" :spinning="state.loading">
      <div v-if="state.loading == false">
        <div v-if="state.hasActiveSubscription">
          <a-tag>{{ state.pm.card.brand.toUpperCase() }}</a-tag>
          **** **** **** {{ state.pm.card.last4 }}
        </div>
        <a-empty v-else description="You don't have payment methods added" />
      </div>
    </a-spin>
  </a-card>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive } from 'vue'
import axios from 'axios'
import { message } from 'ant-design-vue'
import { CreditCardOutlined } from '@ant-design/icons-vue'

import { useAuthStore } from '@/stores/auth'
import { API_URL } from '../../../config.json'

const auth = useAuthStore()

const state = reactive<{
  loading: boolean
  hasActiveSubscription: boolean
  pm: any
}>({
  loading: true,
  hasActiveSubscription: false,
  pm: null,
})

onBeforeMount(() => {
  let userSubscriptionId = auth.getStripeSubscriptionId
  if (userSubscriptionId !== null) {
    state.hasActiveSubscription = userSubscriptionId !== null

    axios({
      method: 'GET',
      url: `${API_URL}/payment-methods`,
      headers: {
        Authorization: `Bearer ${auth.userToken}`,
      },
    })
      .then((res) => {
        let defaultPMethod = res.data.paymentMethods.data[0]
        state.pm = defaultPMethod
      })
      .catch((err) => {
        message.error(err.message)
      })
      .finally(() => {
        state.loading = false
      })
  } else {
    state.loading = false
  }
})
</script>

<style scoped>
h1 {
  color: #189effe0;
  font-size: 19px;
}
</style>
