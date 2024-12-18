<template>
  <Navbar />
  <a-layout>
    <div class="content">
      <a-card class="payment-information-card">
        <br />
        <a-steps :current="1" size="small">
          <a-step title="Account" />
          <a-step title="Checkout" />
          <a-step title="Review" />
        </a-steps>
        <br />

        <a-divider type="horizontal" />

        <a-spin tip="Processing payment" :spinning="checkout.loading">
          <a-form
            :model="checkout.formState"
            class="checkout-form"
            ref="checkoutForm"
            spellcheck="false"
          >
            <span class="selected-method-title">
              <h2>Fill your payment details</h2>
            </span>

            <a-form-item name="name" ref="name" class="form-item">
              <label>Full Name</label>
              <a-input class="input" v-model:value="checkout.formState.name" autofocus />
            </a-form-item>

            <div class="stripe-form-item">
              <label class="stripe-elements-label">Debit or Credit Card Number</label>
              <div ref="cardNumberContainer" id="cardNumberContainer"></div>
            </div>

            <a-flex class="stripe-horizontal-form-items" horizontal>
              <div class="stripe-form-item">
                <label class="stripe-elements-label">Expiration</label>
                <div ref="cardExpContainer" id="cardExpContainer"></div>
              </div>

              <div class="stripe-form-item">
                <label class="stripe-elements-label">Security code</label>
                <div ref="cardCodeContainer" id="cardCodeContainer"></div>
              </div>
            </a-flex>

            <a-form-item class="form-item">
              <a-checkbox v-model:checked="checkout.formState.addressSameAsShipping"
                >Billing address same as shipping address</a-checkbox
              >
            </a-form-item>

            <template v-if="checkout.formState.addressSameAsShipping === false">
              <a-flex horizontal>
                <a-form-item name="city" ref="city" class="form-item">
                  <label>City</label>
                  <a-input class="input" v-model:value="checkout.formState.city" type="text" />
                </a-form-item>

                <a-form-item name="state" ref="state" class="form-item">
                  <label>State</label>
                  <a-input class="input" v-model:value="checkout.formState.state" type="text" />
                </a-form-item>

                <a-form-item name="zipcode" ref="zipcode" class="form-item">
                  <label>Zipcode</label>
                  <a-input class="input" v-model:value="checkout.formState.zipcode" type="text" />
                </a-form-item>
              </a-flex>
            </template>

            <br />
          </a-form>
        </a-spin>
      </a-card>

      <a-card class="order-summary-card">
        <br />
        <br />
        <!-- <h1>Order summary</h1> -->
        <a-card title="Plan Summary">
          <div>
            <span class="plan-name">{{ checkout.plan.name }}</span>
            <span class="plan-price">$ {{ checkout.plan.price }}</span>
          </div>
          <span class="recurrency-plan-period">Billed {{ checkout.plan.recurrencyDate }}</span>

          <a-divider type="horizontal" />
          <div>
            <span class="plan-name">Delivery</span>
            <span class="plan-price"> $ 0 </span>
            &nbsp; <a-tag color="green">Free Shipping</a-tag>
          </div>

          <a-divider type="horizontal" />

          <div class="actions-box">
            <a-button
              type="primary"
              class="payment-btn"
              :loading="checkout.loading"
              @click="purchase()"
            >
              Subscribe
            </a-button>

            <a-button type="text">
              <template #icon>
                <LockOutlined />
              </template>
              Secure and encrypted
            </a-button>
          </div>
        </a-card>
      </a-card>
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { LockOutlined } from '@ant-design/icons-vue'
import { loadStripe } from '@stripe/stripe-js/pure'
import axios from 'axios'

import { useCheckoutStore } from '@/stores/checkout'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Account/Navbar.vue'
import { API_URL, STRIPE_PUBLIC_KEY } from '../../config.json'

const auth = useAuthStore()
const checkout = useCheckoutStore()
const router = useRouter()

function purchase() {
  checkout.setLoading(true)

  checkout.formRef
    .validate()
    .then(() => {
      if (checkout.stripe)
        checkout.stripe
          .createPaymentMethod({
            type: 'card',
            card: checkout.card,
            billing_details: {
              name: checkout.formState.name,
            },
          })
          .then((result: any) => {
            if (result.error) {
              checkout.error = result.error
              checkout.cardHasError = true
              message.error(result.error.message)
              return checkout.setLoading(false)
            } else {
              const paymentMethodId = result.paymentMethod.id

              let config = {
                method: 'post',
                url: `${API_URL}/subscription`,
                headers: {
                  Authorization: `Bearer ${auth.userToken}`,
                },
                data: {
                  paymentMethodId,
                  priceId: checkout.plan?.id,
                },
              }

              axios(config)
                .then((res) => {
                  console.log(res)
                  if (res.data.success == true) {
                    message.success('You has been successfully subscribed')
                    auth.subscriptionChange(res.data.subscription.id)
                  } else {
                    message.error(res.data.error)
                  }
                  return checkout.setLoading(false)
                })
                .catch((error) => {
                  console.log(error)
                  if (error.response !== undefined && error.response.status == 403) {
                    // redirect
                    message.error('Your session has been expired, please do login again')
                    setTimeout(() => {
                      router.push('/login')
                    }, 1500)
                  } else {
                    message.error(error.message)
                  }
                  return checkout.setLoading(false)
                })
            }
          })
    })
    .catch(() => {
      return checkout.setLoading(false)
    })
}

onMounted(async () => {
  checkout.formRef = useTemplateRef('checkoutForm')
  const stripe = await loadStripe(STRIPE_PUBLIC_KEY)

  const stripeElementsStyle = {
    placeholder: '',
    showIcon: true,
    style: {
      base: {
        lineHeight: '25px',
        color: '#000',
        fontWeight: '500',
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '14px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#bfbfbf',
        },
      },
      invalid: {
        color: 'red',
      },
    },
  }

  const elements = stripe?.elements({ locale: 'en' })
  const cardNumberElement = elements?.create('cardNumber', stripeElementsStyle)

  const cardExpElement = elements?.create('cardExpiry', stripeElementsStyle)
  const cardCodeElement = elements?.create('cardCvc', stripeElementsStyle)

  cardExpElement?.mount('#cardExpContainer')
  cardNumberElement?.mount('#cardNumberContainer')
  cardCodeElement?.mount('#cardCodeContainer')
})
</script>

<style scoped>
@import url('../assets/css/styles.css');

* {
  font-family: 'Nunito', sans-serif;
  -webkit-font-smoothing: antialiased;
}

@font-face {
  font-family: 'Roboto';
  src: url('@/assets/fonts/Roboto/Roboto-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Roobert';
  src: url('@/assets/fonts/Roobert/Roobert-Regular.otf');
}

@font-face {
  font-family: 'RobotoBold';
  src: url('@/assets/fonts/Roboto/Roboto-Bold.ttf') format('truetype');
}

label {
  color: #7f7f7f;
}

input {
  color: #888888;
  font-size: 14px;
  padding: 7px;
  outline: none !important;
}

input:hover,
input:focus {
  box-shadow: none;
  border: 1px solid #d9d9d9 !important;
}

.max-width {
  width: 100%;
}

.content {
  display: flex;
  flex-direction: row;
  height: 100vh;
}
.content .payment-information-card {
  margin: 50px;
  flex-grow: 2;
  max-height: fit-content;
}

.content .payment-information-card .checkout-form {
  padding: 20px;
  border: 1px solid #1777ff;
  border-radius: 5px;
}

.content .payment-information-card .checkout-form .selected-method-title {
  font-weight: normal !important;
  padding: 10px;
  display: inline-block;
}

.content .payment-information-card .checkout-form .selected-method-title h2 {
  font-family: 'Roobert', sans-serif !important;

  display: inline;
}

.content .order-summary-card {
  flex-grow: 1;
}

.content .order-summary-card .plan-name {
  font-weight: bold;
  font-size: 16px;
}
.content .order-summary-card .plan-price {
  font-weight: bold;
  font-size: 16px;
  float: right;
}

.content .order-summary-card .recurrency-plan-period {
  color: #7f7f7f;
}

.content .payment-information-card .form-item {
  margin: 20px 10px;
  max-width: 75%;
}

.content .payment-information-card label {
  font-size: 15px;
  line-height: 30px;
}

.content .payment-information-card .stripe-elements-label {
  margin: 0px 10px;
}

.content .payment-information-card .form-item .input {
  color: #000;
}

.content .payment-information-card .stripe-horizontal-form-items {
  margin-top: 10px;
  column-gap: 10px;
}

.content .payment-information-card .stripe-form-item div {
  border: 1px solid #d9d9d9 !important;
  font-size: 14px;
  border-radius: 6px;
  padding: 5px;
  margin: 0 10px;
  width: 75%;
}

.content .payment-information-card .stripe-form-item #cardExpContainer {
  width: 100%;
}

.content .payment-information-card .stripe-form-item #cardCodeContainer {
  margin-left: 10px;
}

.content .payment-information-card h1 {
  margin-bottom: 20px;
}

.actions-box {
  text-align: center;
}
.actions-box .payment-btn {
  margin: 15px;
  width: 85%;
}
</style>
