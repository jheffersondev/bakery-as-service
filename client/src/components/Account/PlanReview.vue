<template>
  <a-card>
    <div v-if="state.hasActiveSubscription == true && state.error == null">
      <a-spin tip="Loading subscription details" :spinning="state.loading">
        <div v-if="state.loading == false">
          <a-image
            :width="100"
            :src="state.planImage"
            :fallback="state.defaultImage"
            :style="{ borderRadius: '100%' }"
            preview="true"
          /><br />

          <h1 class="title">
            {{ state.subscription.plan.nickname }} -
            {{
              new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(
                state.subscription.plan.amount / 100,
              )
            }}
          </h1>
          <span class="description">
            <a-badge status="success" v-if="state.subscription.status == 'active'" />

            <a-badge status="error" v-else />

            Weekly billed
          </span>
        </div>
      </a-spin>
    </div>

    <div v-else-if="state.error !== null">
      <a-alert :message="state.error" type="error" />
    </div>

    <div v-else>
      <a-empty description="You don't have active subscriptions" />
      <a-button type="primary" @click="startSubscription">Subscribe now</a-button>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import { useAuthStore } from '@/stores/auth'
import { API_URL } from '../../../config.json'
import PremiumImage from '@/assets/images/Premium.jpg'
import MediumImage from '@/assets/images/Medium.jpg'
import StarterImage from '@/assets/images/Starter.jpg'

const auth = useAuthStore()
const router = useRouter()

const state = reactive<{
  loading: boolean,
  hasActiveSubscription: boolean,
  subscription: any,
  error: string | null,
  planImage: string,
  defaultImage: string,
}>({
  loading: true,
  hasActiveSubscription: false,
  subscription: [],
  error: null,
  planImage: '',
  defaultImage: '',
})

onBeforeMount(() => {
  let userSubscriptionId = auth.getStripeSubscriptionId

  if (userSubscriptionId !== null) {
    state.hasActiveSubscription = true

    axios({
      method: 'GET',
      url: `${API_URL}/subscription`,
      headers: {
        Authorization: `Bearer ${auth.userToken}`,
      },
    })
      .then((res) => {
        state.subscription = res.data.subscription
        let planId = res.data.subscription.plan.id
        switch (planId) {
          case 'price_1JPf1sGywnxGFLObvjVe3rja': //premium
            state.planImage = PremiumImage
            break

          case 'price_1JPf1sGywnxGFLObCsUy55tY': //medium
            state.planImage = MediumImage
            break

          case 'price_1JPf1sGywnxGFLOb48TWkHJL': //starter
            state.planImage = StarterImage
            break
        }
      })
      .catch((err) => {
        state.error = err
        console.log(err)
        message.error(err.message)
      })
      .finally(() => {
        state.loading = false
      })
  }
})

function startSubscription() {
  router.push({ path: '/checkout' })
}

</script>

<style scoped>
h1 {
  margin-top: 30px;
  line-height: 9px;
  color: #189effe0;
  font-size: 19px;
}
</style>
