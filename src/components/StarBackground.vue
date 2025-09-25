<template>
  <canvas ref="canvas" class="star-canvas"></canvas>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'

const canvas = ref(null)
let ctx = null
let stars = []
let meteors = []
let animationFrameId = null

let meteorTimer = 0
let nextMeteorFrame = 100 + Math.floor(Math.random() * 101) // 100..200

// STAR 类
class Star {
  constructor(w, h) {
    this.reset(w, h)
  }

  reset(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.size = Math.random() < 0.7 ? 1 : Math.random() < 0.95 ? 2 : 3

    // 颜色：白/蓝/橙
    const r = Math.random()
    if (r < 0.7) this.color = 'rgba(255,255,255,1)'
    else if (r < 0.9) this.color = `hsl(${210 + Math.random() * 30}, 80%, 70%)`
    else this.color = `hsl(${30 + Math.random() * 10}, 90%, 70%)`

    this.baseAlpha = Math.random() * 0.5 + 0.2
    this.alpha = this.baseAlpha
    this.twinkleSpeed = Math.random() * 0.03 + 0.005
    this.twinklePhase = Math.random() * Math.PI * 2
    this.vx = (Math.random() - 0.5) * 0.02
    this.vy = (Math.random() - 0.5) * 0.02
  }

  update(w, h) {
    this.twinklePhase += this.twinkleSpeed
    this.alpha = Math.max(0, this.baseAlpha + Math.sin(this.twinklePhase) * 0.35)
    this.x += this.vx
    this.y += this.vy
    if (this.x < -5 || this.x > w + 5 || this.y < -5 || this.y > h + 5) {
      this.reset(w, h)
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.shadowBlur = this.size * 6
    ctx.shadowColor = this.color
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// METEOR 类
class Meteor {
  constructor(width, height) {
    this.init(width, height)
  }

  init(width, height) {
    const fromRight = Math.random() < 0.2
    if (fromRight) {
      this.x = width + Math.random() * 100
      this.y = Math.random() * height * 0.5
    } else {
      this.x = Math.random() * width
      this.y = -20 - Math.random() * 100
    }

    // 普通 or 稀有大流星
    this.isRare = Math.random() < 0.2
    const baseSpeed = this.isRare ? 10 + Math.random() * 5 : 6 + Math.random() * 4
    const baseLen = this.isRare ? 200 + Math.random() * 150 : 80 + Math.random() * 120

    const angle = (30 + Math.random() * 10) * (Math.PI / 180)
    this.vx = -Math.cos(angle) * baseSpeed
    this.vy = Math.sin(angle) * baseSpeed
    this.len = baseLen
    this.alpha = 1

    // 寿命：飞行的总距离
    this.traveled = 0
    this.lifeDistance = this.isRare ? 1000 + Math.random() * 800 : 800 + Math.random() * 300

    this.dead = false
  }

  update(width, height) {
    this.x += this.vx
    this.y += this.vy
    this.traveled += Math.hypot(this.vx, this.vy)

    const lifeRatio = 1 - this.traveled / this.lifeDistance
    this.alpha = Math.max(0, lifeRatio)

    if (this.traveled >= this.lifeDistance || this.alpha <= 0) {
      this.dead = true
    }
  }

  draw(ctx) {
    ctx.save()
    const dirLen = Math.hypot(this.vx, this.vy) || 1
    const nx = this.vx / dirLen
    const ny = this.vy / dirLen
    const x2 = this.x - nx * this.len
    const y2 = this.y - ny * this.len

    const g = ctx.createLinearGradient(this.x, this.y, x2, y2)
    g.addColorStop(0, `rgba(255,255,255,${this.alpha})`)
    g.addColorStop(0.6, `rgba(255,255,255,${Math.max(0, this.alpha * 0.6)})`)
    g.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.strokeStyle = g
    ctx.lineWidth = this.isRare ? 3 : 2
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`
    ctx.arc(this.x, this.y, this.isRare ? 2.5 : 1.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

const initStars = (w, h, count = 300) => {
  stars = []
  for (let i = 0; i < count; i++) stars.push(new Star(w, h))
}

const resizeCanvas = () => {
  const c = canvas.value
  if (!c) return
  const dpr = window.devicePixelRatio || 1
  const w = window.innerWidth
  const h = window.innerHeight
  c.style.width = `${w}px`
  c.style.height = `${h}px`
  c.width = Math.floor(w * dpr)
  c.height = Math.floor(h * dpr)
  ctx && ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  initStars(w, h, 350)
}

const animate = () => {
  if (!ctx) return
  const w = ctx.canvas.width / (window.devicePixelRatio || 1)
  const h = ctx.canvas.height / (window.devicePixelRatio || 1)

  // 背景
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#050615')
  bg.addColorStop(1, '#0d1224')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // 星星
  for (let i = 0; i < stars.length; i++) {
    stars[i].update(w, h)
    stars[i].draw(ctx)
  }

  // 流星生成
  meteorTimer++
  if (meteorTimer >= nextMeteorFrame) {
    meteors.push(new Meteor(w, h))
    meteorTimer = 0
    nextMeteorFrame = 100 + Math.floor(Math.random() * 101)
  }

  // 更新 & 绘制流星
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i]
    m.update(w, h)
    m.draw(ctx)
    if (m.dead) meteors.splice(i, 1)
  }

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  const c = canvas.value
  if (!c) return
  ctx = c.getContext('2d')
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  animationFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.star-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  background: transparent;
}
</style>
