<template>
  <a-layout>
    <Navbar />

    <div class="signup-box-area">
      <a-row>
        <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
          <div class="left-content">
            <a-typography-title :level="2" class="mainTitle"> Get Started </a-typography-title>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's.
            </p>
            <br />

            <a-form
              ref="signUpForm"
              :model="state.formState"
              :rules="state.rules"
              :label-col="state.labelCol"
              :wrapper-col="state.wrapperCol"
            >
              <transition name="fade">
                <a-alert v-if="state.error" class="alert" type="error" :message="state.error" banner closable />
              </transition>

              <a-form-item ref="name" name="name">
                <a-input
                  v-model:value="state.formState.name"
                  size="large"
                  class="field"
                  placeholder="First name"
                />
              </a-form-item>

              <a-form-item ref="email" name="email">
                <a-input
                  v-model:value="state.formState.email"
                  size="large"
                  class="field"
                  placeholder="Email"
                />
              </a-form-item>

              <a-form-item has-feedback name="pass">
                <a-input-password
                  v-model:value="state.formState.pass"
                  type="password"
                  autocomplete="off"
                  size="large"
                  class="field"
                  placeholder="Password"
                />
              </a-form-item>

              <a-form-item has-feedback name="checkPass">
                <a-input-password
                  v-model:value="state.formState.checkPass"
                  type="password"
                  autocomplete="off"
                  size="large"
                  class="field"
                  placeholder="Confirm your password"
                />
              </a-form-item>

              <a-form-item name="termsAndConditions">
                <a-checkbox class="field" v-model:checked="state.formState.termsAndConditions">
                  Agree with terms and conditions
                </a-checkbox>
              </a-form-item>

              <a-form-item>
                <a-button
                  type="primary"
                  @click="onSubmit"
                  :loading="state.loading"
                  size="large"
                  class="submit-btn"
                  >Sign up</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </a-col>
        <a-col :xs="{ span: 24 }" :lg="{ span: 12 }" class="right-card-layout">
          <div class="right-content">
            <a-carousel class="carousel" effect="fade" autoplay>
              <div>
                <img src="../assets/images/bread-slices.jpeg" alt="Bread slices" />
              </div>
              <div>
                <img src="../assets/images/bread-in-baskets.jpeg" alt="Bread in baskets" />
              </div>
              <div>
                <img src="../assets/images/cinnamon-rolls.jpeg" alt="Cinnamon rolls" />
              </div>
            </a-carousel>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
import { onMounted, reactive, useTemplateRef, type ShallowRef } from 'vue'
import { useRouter } from 'vue-router'
import type { Rule } from 'ant-design-vue/es/form'

import { useAuthStore } from '@/stores/auth'
import Navbar from '../components/Navbar.vue'

const auth = useAuthStore()
const router = useRouter()

const state = reactive<{
  loading: boolean
  formRef: ShallowRef | null
  formState: {
    name: string
    email: string
    pass: string
    checkPass: string
    termsAndConditions: boolean
  }
  error: string
  rules: {
    name: Rule[]
    email: Rule[]
    pass: Rule[]
    checkPass: Rule[]
    termsAndConditions: Rule[]
  }
  labelCol: { span: number }
  wrapperCol: { span: number }
}>({
  loading: false,
  formRef: null,
  formState: {
    name: '',
    email: '',
    pass: '',
    checkPass: '',
    termsAndConditions: false,
  },
  error: '',
  rules: {
    name: [
      {
        required: true,
        message: 'Enter a valid name',
        trigger: 'change',
      },
    ],
    email: [
      {
        required: true,
        validator: emailValidation,
        trigger: 'change',
      },
    ],
    pass: [
      {
        required: true,
        validator: validatePass,
        trigger: 'change',
      },
    ],
    checkPass: [
      {
        required: true,
        validator: validatePass2,
        trigger: 'change',
      },
    ],
    termsAndConditions: [
      {
        validator: termsValidation,
        trigger: 'change',
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

onMounted(() => {
  state.formRef = useTemplateRef('signUpForm')
})

function onSubmit(e: SubmitEvent) {
  e.preventDefault()
  state.error = ''
  state.loading = true

  state.formRef
    .validate()
    .then(() => {
      auth
        .signUp(state.formState.name, state.formState.email, state.formState.pass)
        .then((res: any) => {
          if (res.data.success === true) {
            let token = res.data.token
            let user = res.data.user

            auth.setUserToken(token.toString())
            auth.setUserDetails(user)
            router.push('/checkout')
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

function resetForm() {
  state.formRef.resetFields()
}

async function emailValidation(rule: any, value: string) {
  if (value === '') {
    return Promise.reject('Enter a valid Email')
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

async function validatePass(rule: any, value: string) {
  if (value === '') {
    return Promise.reject('Enter valid password')
  } else {
    if (state.formState.checkPass !== '') {
      state.formRef.validateFields('checkPass')
    }
    return Promise.resolve()
  }
}

async function validatePass2(rule: any, value: string) {
  if (value === '') {
    return Promise.reject('Please input the password again')
  } else if (value !== state.formState.pass) {
    return Promise.reject("Two inputs don't match!")
  } else {
    return Promise.resolve()
  }
}

function termsValidation(rule: any, value: boolean) {
  if (value === true) {
    return Promise.resolve()
  } else {
    return Promise.reject('You must agree with terms and conditions to continue')
  }
}
</script>

<style scoped>
@import url('../assets/css/styles.css');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.content {
  margin: 0 auto;
}
.signup-box-area {
  background: #fff;
  border-radius: 6px;
  margin: 50px auto;
  width: 80% !important;
  max-width: 1900px;
  font-family: 'Nunito', sans-serif;
  -webkit-box-shadow: 0px 0px 16px -5px #c3c3c3;
  box-shadow: 0px 0px 16px -5px #c3c3c3;
}

.right-card-layout {
  background: -webkit-linear-gradient(to left, #fff, #e9eef9); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #fff,
    #e9eef9
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.signup-box-area .left-content {
  margin: 100px;
}

.signup-box-area .left-content form .field,
.signup-box-area .left-content form .submit-btn {
  width: 350px !important;
}

.signup-box-area .right-content {
  text-align: center;
  margin: 0 auto;
}

.signup-box-area .right-content .carousel {
  margin: 20px;
}

.signup-box-area .right-content img {
  margin-top: 100px;
  width: 100% !important;
  max-width: 500px;
}

.ant-card-body {
  width: 100% !important;
}
.alert {
  margin: 20px 0px;
}
.action-buttons {
  margin-top: 20px;
}

@media screen and (max-width: 1150px) {
  .signup-box-area .left-content {
    margin: 20px auto !important;
    padding: 40px;
  }
}

@media screen and (max-width: 992px) {
  .signup-box-area {
    margin: 20px auto !important;
    width: 80%;
  }
  .signup-box-area .right-content {
    display: none;
  }
  .signup-box-area .left-content {
    margin: 0 auto !important;
    text-align: center;
  }
  .signup-box-area .left-content p {
    width: 80%;
    margin: 0 auto !important;
  }
  .signup-box-area .left-content form {
    width: max-content;
    margin: 0 auto;
    text-align: center;
  }
}

@media screen and (max-width: 575px) {
  .signup-box-area .left-content form {
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
  .signup-box-area .left-content p {
    width: 100%;
  }
  .signup-box-area .left-content form .field,
  .signup-box-area .left-content form .submit-btn {
    width: 100% !important;
  }
}
</style>
