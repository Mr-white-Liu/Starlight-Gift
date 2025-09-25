<template>
  <div class="app-container">
    <StarBackground/>
    <div class="content">
      <div class="title">{{ countdownText }}</div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import StarBackground from './components/StarBackground.vue'

const countdownText = ref('')

const updateCountdown = () => {
  const now = new Date()

  let firstDay = new Date(2025, 7, 16, 21)

  const diff = now - firstDay

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  countdownText.value = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`
}

onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 1000)
})
</script>

<style scoped>
.app-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  color: white;
}

.content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.title {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
</style>
