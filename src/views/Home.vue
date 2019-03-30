<template>
  <div class="home">
    <div class="spinner" :class="{ show: loading }">
      <div class="container">
        <h4>Loading new exercises...</h4>
        <img src="@/assets/spinner.svg">
      </div>
    </div>

    <div class="card-list">
      <exercise-card v-for="exercise in exercises"
        :key="exercise.name"
        :exercise="exercise"
        @save="storeExercises" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import ExerciseCard from '@/components/ExerciseCard.vue'
import ExerciseLoader from '@/assets/scripts/ExerciseLoader'
import Exercise from '@/assets/interfaces/Exercise'
import ScraperConfig from '@/assets/interfaces/ScraperConfig'
import Sheet from '@/assets/interfaces/Sheet'
import moment from 'moment'
import config_1 from '@/assets/data/config_1'

@Component({
  components: { ExerciseCard }
})
export default class Home extends Vue {
  exercises: Exercise[]
  loading: boolean

  constructor() {
    super()

    this.exercises = []
    this.loading = true
  }

  mounted() {
    this.loadFromLocalStorage()
    this.loading = true
    const configs = this.loadConfigsFromLocalStorage()
    ExerciseLoader.load(configs)
    .then(exercises => {
      this.exercises = exercises
      this.storeExercises()
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {
      this.loading = false
    })
  }

  loadFromLocalStorage(): void {
    const exerciseString = window.localStorage.getItem('exercises')
    this.exercises = exerciseString ? JSON.parse(exerciseString) : []

    for (let exercise of this.exercises) {
      for (let sheet of exercise.sheets) {
        sheet.dueDate = new Date(sheet.dueDateString)
      }
    }
  }

  storeExercises(): void {
    window.localStorage.setItem('exercises', JSON.stringify(this.exercises))
  }

  loadConfigsFromLocalStorage(): ScraperConfig[] {
    const configString = window.localStorage.getItem('configs')
    const configs: ScraperConfig[] = configString ? JSON.parse(configString) : []
    if (configs.length) return configs
    else return config_1
  }

}
</script>

<style lang="scss" scoped>
$dark: #2c3e50;

.card-list {
  display: grid;

  grid-column-gap: 24px;
  grid-row-gap: 24px;
  padding: 24px;

  grid-template-columns: repeat(1, 1fr);

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }

  & > * {
    display: inline-block;
  }
}

.spinner {
  opacity: 0;
  z-index: -1;
  transition: .4s ease;
  position: fixed;
  bottom: 16px;
  right: 16px;
  pointer-events: none;

  .container {

    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;

    h4 {
      margin-right: 16px;
      color: black;
    }

    img {
      display: block;
      width: 40px;
      height: 40px;
      animation: Spin 1.5s cubic-bezier(.75,.4,.25,.6) infinite;
    }
  }
}

.spinner.show {
  z-index: 10;
  opacity: 0.5;
}

@keyframes Spin {
  0% {
    transform: rotateZ(-45deg);
  }

  100% {
    transform: rotateZ(315deg);
  }
}
</style>

