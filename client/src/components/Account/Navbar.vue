<template>
  <a-layout-header class="header">
    <a-menu theme="dark" mode="horizontal">
      <a-menu-item @click="AccountPage">
        <img src="@/assets/images/logo.png" alt="" class="crumbly-logo" width="100px"/>
      </a-menu-item>

      <div class="nav-right" @click="Logout">
        <a-menu-item key="Home"> <LogoutOutlined /> Logout </a-menu-item>
      </div>
    </a-menu>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

console.log(auth.userToken)

function AccountPage() {
  router.push({ path: '/account' })
}

function Logout() {
  auth.logout()
  router.push({ path: '/login' })
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,600;1,200;1,700&display=swap');

.header {
  background-color: #fff !important;
  font-family: 'Nunito', sans-serif;
}
.header .nav-right {
  color: #1890ff;
  position: absolute;
  right: 0;
  top: 10px;
}
.router-link-active {
  border-bottom: 1px solid;
}
</style>
