<template>
    <div class="popup settings" :class="{ show }" @click="$emit('hide')">
        <div class="popup-container settings-container" @click="e => e.stopPropagation()">
            <h1>Settings</h1>
            <div>
                <label>Edit the emoji displayed when every sheet of an exercise is solved:</label>
                <input type="text" placeholder="🎉" @change="updateExerciseEmoji" v-model="exerciseEmoji">
            </div>

            <div>
                <button @click="deleteLocalStorage()">Reset everything</button>
                <button @click="$emit('hide')">Close</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Settings extends Vue {
    @Prop() show!: boolean

    exerciseEmoji: string = '🎉'

    constructor() {
        super()
        const emoji = window.localStorage.getItem('exerciseEmoji')
        if (emoji) this.exerciseEmoji = emoji
    }

    updateExerciseEmoji() {
        window.localStorage.setItem('exerciseEmoji', this.exerciseEmoji || '🎉')
        window.location = window.location
    }

    deleteLocalStorage(): void {
        if (window.confirm("Do you really want to delete your progress?")) {
            window.localStorage.clear()
            window.location = window.location
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
