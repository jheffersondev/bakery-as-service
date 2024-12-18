<template>
  <a-card>
    <h1>{{ auth.user?.name }}</h1>
    <br />
    <div class="decriptionBox">
      <span> <MailOutlined /> {{ auth.user?.email }} </span><br />
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { MailOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

</script>

<style scoped>
h1 {
  color: #7d7d7d;
  font-size: 17px;
}
.decriptionBox {
  text-align: left;
}
</style>
