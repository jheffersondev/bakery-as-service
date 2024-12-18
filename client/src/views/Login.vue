<template>
  <a-layout>
    <Navbar />
    <a-layout-content class="content">
      <a-card class="signup-box-area">
        <a-typography-title :level="3" class="mainTitle"> Sign In </a-typography-title>

        <a-alert
          class="alert"
          type="error"
          :message="state.error"
          banner
          closable
          v-if="state.error"
        />

        <a-form
          ref="login-form"
          as="HTMLFormElement"
          :model="state.formState"
          :rules="state.rules"
          :label-col="state.labelCol"
          :wrapper-col="state.wrapperCol"
        >
          <a-form-item ref="email" label="Email" name="email">
            <a-input v-model:value="state.formState.email" />
          </a-form-item>

          <a-form-item ref="pass" label="Password" name="pass">
            <a-input-password v-model:value="state.formState.pass" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 2 }" name="termsAndConditions">
            <a-checkbox v-model:checked="state.formState.rememberDetails">
              Remember login details
            </a-checkbox>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 14, offset: 2 }">
            <a-button type="primary" :loading="state.loading" @click="onSubmit">Sign in</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import { onActivated, onMounted, reactive, useTemplateRef, watchEffect, type ShallowRef } from 'vue'
import { useRouter } from 'vue-router'
import type { Rule } from 'ant-design-vue/es/form'

import { useAuthStore } from '@/stores/auth'
import Navbar from '../components/Navbar.vue'

const router = useRouter()
const auth = useAuthStore()

const formRef = useTemplateRef<HTMLFormElement>('login-form')
const state = reactive<{
  loading: boolean
  formState: {
    email: string
    pass: string
    rememberDetails: boolean
  }
  error: string
  rules: Record<string, Rule[]>
  labelCol: { span: number }
  wrapperCol: { span: number }
}>({
  loading: false,
  formState: {
    email: '',
    pass: '',
    rememberDetails: false,
  },
  error: '',
  rules: {
    email: [
      {
        required: true,
        validator: emailValidation,
        trigger: 'blur',
      },
    ],
    pass: [
      {
        required: true,
        min: 8,
        trigger: 'blur',
      },
    ],
  },
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
})

onMounted(() => {})

function onSubmit(e: SubmitEvent) {
  e.preventDefault()
  state.loading = true
  state.error = ''

  if(formRef.value)
  formRef.value
    .validate()
    .then(() => {
      auth
        .login(state.formState.email, state.formState.pass)
        .then((res: any) => {
          if (res.data.success === true) {
            let token = res.data.token
            let user = res.data.user
            let subId = user.stripe.stripeSubscriptionId

            auth.setUserToken(token.toString())
            auth.setUserDetails(user)

            if (subId == undefined || subId == null) {
              router.push({ path: '/checkout' })
            } else {
              router.push({ path: '/account' })
            }
          } else {
            state.error = res.data.error
          }

          state.loading = false
        })
        .catch(() => {
          state.error = `A unexpected error happened, please, try again.`
          state.loading = false
        })
    })
    .catch(() => {
      state.loading = false
    })
}

async function emailValidation(rule: any, value: string) {
  if (value === '') {
    return Promise.reject('Enter a valid email')
  }
  if (
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
      value,
    )
  ) {
    return Promise.resolve()
  } else {
    return Promise.reject('Enter a valid Email')
  }
}

</script>
<style scoped>
@import url('../assets/css/styles.css');

.content {
  margin: 0 auto;
}
.signup-box-area {
  margin: 50px;
  width: 700px;
  border-radius: 6px;
  font-family: 'Nunito', sans-serif;
  -webkit-box-shadow: 0px 0px 16px -5px #c3c3c3;
  box-shadow: 0px 0px 16px -5px #c3c3c3;
}
.mainTitle {
  margin-left: 20px;
}
.alert {
  margin: 20px;
}
.action-buttons {
  margin-top: 20px;
}

@media screen and (max-width: 648px) {
  .signup-box-area {
    margin: 30px;
    width: 400px;
  }
}

@media screen and (max-width: 434px) {
  .signup-box-area {
    margin: 30px;
    width: 80%;
  }
}
</style>
