<template>
    <table>
        <tr v-for="(exercise, index) in exercises" :key="index">
        <td>
            <a :href="exercise.pdfUrl">{{ exercise.title }}</a>
        </td>

        <td>
            <a v-if="exercise.solutionUrl" :href="exercise.solutionUrl">Solution {{ index + 1 }}</a>
            <p v-else>-</p>
        </td>
        </tr>
    </table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Exercise from '@/assets/interfaces/Exercise'

@Component
export default class ExerciseTable extends Vue {
    @Prop() exercises!: Exercise[]
}
</script>

