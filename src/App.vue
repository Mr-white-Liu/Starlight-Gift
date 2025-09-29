<template>
  <div class="app-container">
    <StarBackground/>
    <div class="content">
      <div class="title" v-html="countdownText"></div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
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

  // 在小屏幕上使用 <br> 标签来换行
  countdownText.value = `
    <span>${days}天</span><br/>
    <span>${hours}小时</span><br/>
    <span>${minutes}分钟</span><br/>
    <span>${seconds}秒</span>
  `
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
  text-align: center;
  white-space: pre-line;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem; /* 小屏时调整字体大小 */
    flex-direction: column; /* 使时间部分换行显示 */
    line-height: 0.7;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem; /* 手机屏幕时再减小字体 */
    flex-direction: column;
    line-height: 0.7;
  }
}
</style>
