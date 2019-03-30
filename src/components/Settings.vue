<template>
    <div class="popup settings" :class="{ show }" @click="$emit('hide')">
        <div class="popup-container settings-container" @click="e => e.stopPropagation()">
            <h1>Settings</h1>
            <button @click="deleteLocalStorage()">Reset progress</button>
            <button @click="$emit('hide')">Close</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Settings extends Vue {
    @Prop() show!: boolean

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
