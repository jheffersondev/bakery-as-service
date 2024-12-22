<template>
  <a-layout class="main">
    <Navbar />

    <a-layout-content class="hero-section">
      <a-flex>
        <div class="banner-content">
          <h1 class="title">
            Fresh Bread,<br />
            Delivered Monthly
          </h1>
          <p>
            Enjoy a curated selection of artisanal bread, pastries, and more, delivered monthly.
            Elevate your dining experience with our high-quality products.
          </p>

          <a-button type="primary" shape="round" class="cta-button"> Subscribe Now </a-button>
        </div>
        <!-- https://stock.adobe.com/br/search?filters%5Bcontent_type%3Aphoto%5D=1&filters%5Bcontent_type%3Aillustration%5D=1&filters%5Bcontent_type%3Azip_vector%5D=1&filters%5Bcontent_type%3Avideo%5D=1&filters%5Bcontent_type%3Atemplate%5D=1&filters%5Bcontent_type%3A3d%5D=1&filters%5Bcontent_type%3Aimage%5D=1&k=bread+basket+png&order=relevance&limit=100&search_page=1&search_type=usertyped&acp=&aco=bread+basket+png&get_facets=0&asset_id=900459944 -->
        <img src="@/assets/images/bread-basket-hero.webp" class="hero-image" />
      </a-flex>
    </a-layout-content>

    <a-layout-content class="usecase-section">
      <a-flex class="row">
        <img src="@/assets/images/illustration.jpg" class="image" />
        <div class="side-content">
          <h2>No More Bakery Runs!</h2>
          <h1 class="title">
            Skip the Trip, Enjoy the <span>Freshness Bread</span><br />
            Delivered to Your Doorstep
          </h1>
          <p>
            Enjoy a curated selection of artisanal bread, pastries, and more, delivered monthly.
            Elevate your dining experience with our high-quality products.
          </p>

          <a-button type="primary" shape="round" class="cta-button"> Order Now </a-button>
        </div>
        <!-- https://stock.adobe.com/br/search?filters%5Bcontent_type%3Aphoto%5D=1&filters%5Bcontent_type%3Aillustration%5D=1&filters%5Bcontent_type%3Azip_vector%5D=1&filters%5Bcontent_type%3Avideo%5D=1&filters%5Bcontent_type%3Atemplate%5D=1&filters%5Bcontent_type%3A3d%5D=1&filters%5Bcontent_type%3Aimage%5D=1&k=bread+basket+png&order=relevance&limit=100&search_page=1&search_type=usertyped&acp=&aco=bread+basket+png&get_facets=0&asset_id=900459944 -->
      </a-flex>
    </a-layout-content>

    <a-layout-content class="pricing-section">
      <div class="resume">
        <a-typography-title :level="2" class="title">Our pricing</a-typography-title>
        <a-typography-paragraph class="description">
          Discover flexible plans designed to fit your budget and enjoy the delicious taste of
          fresh, artisanal bread delivered right to your door. Choose the option that best suits
          your needs and savor the goodness ❤️
        </a-typography-paragraph>
      </div>
      <br />

      <div class="card-box" :span="12">
        <div class="plan-card" v-for="plan in state.plans">
          <a-card hoverable class="card">
            <template #cover>
              <img :alt="plan.name" :src="plan.image" />
            </template>
            <a-card-meta>
              <template #description>
                <a-typography-title :level="4" class="plan-name">{{
                  plan.name
                }}</a-typography-title>
                <p>{{ plan.description }}</p>
                <div class="benefits-box">
                  <span class="benefit" v-for="benefit in plan.benefits" :key="benefit">
                    <CheckCircleOutlined :style="{ color: '#1677ff' }" /> {{ benefit }}
                  </span>
                </div>
                <br />
                <a-typography-title :level="4">${{ plan.price }}</a-typography-title>

                <br />
                <a-button type="primary" class="btn-choose" @click="setChosenPlan(plan)">
                  Subscribe
                </a-button>
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
    </a-layout-content>

    <br />
  </a-layout>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useCheckoutStore } from '@/stores/checkout'

import Navbar from '../components/Navbar.vue'
import PremiumImage from '@/assets/images/Premium.jpg'
import MediumImage from '@/assets/images/Medium.jpg'
import StarterImage from '@/assets/images/Starter.jpg'

const router = useRouter()
const auth = useAuthStore()
const checkout = useCheckoutStore()

const state = reactive({
  plans: [
    {
      id: 'price_1JPf1sGywnxGFLOb48TWkHJL',
      image: StarterImage,
      name: 'The Daily Loaf',
      description: 'Ideal for busy folks who want fresh bread without the hassle.',
      price: 25.0,
      recurrencyDate: 'Monthly',
      benefits: ['Perfect for everyday households.', 'Fresh, artisanal bread, delivered weekly.'],
    },
    {
      id: 'price_1JPf1sGywnxGFLObCsUy55tY',
      image: MediumImage,
      name: 'Sweet and Savory',
      description: 'Great for families or those who love a variety of treats.',
      price: 35.0,
      recurrencyDate: 'Monthly',
      benefits: [
        ' Satisfy your sweet and savory cravings all in one delivery',
        'Enjoy a mix of delicious bread and cookies, delivered weekly.',
      ],
    },
    {
      id: 'price_1JPf1sGywnxGFLObvjVe3rja',
      image: PremiumImage,
      name: "The Baker's Choice",
      description: ' Perfect for special occasions or simply treating yourself',
      price: 45.0,
      recurrencyDate: 'Monthly',
      benefits: [
        'Indulge your inner foodie with a rotating selection of baked goods.',
        'A rotating selection of cookies, cakes, pastries, and more, delivered monthly.',
      ],
    },
  ],
})

function setChosenPlan(plan: any) {
  checkout.setChosenPlan(plan)
  const userToken = localStorage.getItem('userToken')
  const user = auth.user

  if (!user || userToken == null || userToken == undefined) {
    router.push('/signup')
  } else if (user.id != undefined || user.stripe != undefined) {
    router.push('/checkout')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
@import url('@/assets/css/styles.css');

.main {
  background: -webkit-linear-gradient(to bottom, #fff, #e9eef9);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #fff, #e9eef9);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.hero-section {
  width: 100%;
  height: 500px;
}

.hero-section .banner-content {
  margin: 10%;
  color: #252b42 !important;
}

.hero-section .banner-content .title {
  font-weight: bold;
  font-size: 65px;
  color: #252b42 !important;
  font-family: Opensans;
}

.hero-banner .cta-button {
  height: 40px;
  margin-top: 10px;
}

.hero-section .banner-content p {
  color: #737373;
  font-size: 18px;
  max-width: 500px;
  margin-top: -20px;
  line-height: 22px;
}

.hero-section .hero-image {
  height: 70vh;
}

.usecase-section {
  background: #fff;
  margin-top: 300px;
}

.usecase-section .row {
  margin: 0 50px;
}

.usecase-section img {
  height: 70vh;
  mix-blend-mode: multiply;
}

.usecase-section .side-content {
  margin-top: 150px;
}

.usecase-section .side-content h2 {
  font-family: Roboto, sans-serif;
  font-style: italic;
  color: #faaa32;
}

.usecase-section .side-content .cta-button { 
  background-color: #ffbc48;
  height: 40px;
  margin-top: 10px;
}

.usecase-section .side-content .title {
  font-size: 43px;
  font-weight: bold;
  font-family: Opensans;
  color: #252b42 !important;
}

.usecase-section .title span {
  font-style: Italic;
  font-family: Roboto;
  color: #faaa32 !important;
}

.usecase-section p {
  color: #737373;
  font-size: 18px;
}

.pricing-section {
  margin: 0 auto;
  font-family: 'Nunito', sans-serif;
  margin: 200px 50px;
}

.pricing-section .resume {
  text-align: center;
  padding: 20px;
}

.pricing-section .resume .title {
  font-size: 38px;
  font-weight: bold;
  font-family: Opensans;
  color: #252b42 !important;
}

.pricing-section .resume .description {
  color: #737373;
  font-size: 16px;
  width: 50%;
  margin: auto;
}

.pricing-section .card-box {
  margin: 40px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  flex-direction: row;
  width: fit-content;
}

.pricing-section .card-box .plan-card .card {
  margin: 0 auto;
  width: 300px;
  flex-grow: 1;
}

.pricing-section .card-box .plan-card p {
  color: #737373;
  font-family: Roboto;
  font-size: 17px;
  max-width: 250px;
}

.plan-name {
  font-size: 1.5em;
  color: #252b42 !important;
  font-family: Opensans;
}

.pricing-section .card-box .card {
  margin: auto;
  border-radius: 15px;
  -webkit-box-shadow: 0px 0px 16px -5px #c3c3c3;
  box-shadow: 0px 0px 16px -5px #c3c3c3;
}

.pricing-section .card-box .card img {
  width: 100%;
  height: 230px;
  border-radius: 15px 15px 0 0;
}

.pricing-section .card .benefits-box .benefit {
  display: block;
  margin-top: 5px;
}

.pricing-section .btn-choose {
  width: 100%;
  border-radius: 6px;
}

@media screen and (max-width: 800px) {
  .hero-section .banner-content p {
    max-width: 80%;
  }

  .pricing-section .card-box {
    margin: 0 auto;
    width: 70%;
  }

  .pricing-section .card-box .card {
    margin-top: 20px;
  }
}

@media screen and (max-width: 430px) {
  .pricing-section {
    margin: 10px;
    width: 100%;
  }
}
</style>
