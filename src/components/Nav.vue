<template>
    <nav>
        <div class="row left">
            <router-link to="/">Home</router-link>
        </div>

        <div class="right">
            <div class="row">
                <a @click="showSettings = true">Settings</a>
                <progress-bar width="40px" :done-tasks="doneTasks" :total-tasks="totalTasks" />
            </div>
        </div>

        <settings :show="showSettings" @hide="showSettings = false" />
    </nav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Settings from './Settings.vue'
import ProgressBar from './ProgressBar.vue'

@Component({
    components: { Settings, ProgressBar }
})
export default class Nav extends Vue {
    showSettings: boolean = false

    get totalTasks(): number {
        return this.$store.getters['getTotalTasks']
    }

    get doneTasks(): number {
        return this.$store.getters['getDoneTasks']
    }
}
</script>

<style lang="scss" scoped>
$dark: #2c3e50;

nav {
    display: flex;
    width: 100vw;
    box-sizing: border-box;
    justify-content: space-between;
    box-shadow: 0 3px 10px 0px rgba(0, 0, 0, 0.25);
    padding: 10px 24px;
    background-color: $dark;
    a {
        font-weight: bold;
        color: white;
        &.router-link-exact-active {
        color: #42b983;
        }
    }
}

.row {
    display: flex;
    align-items: center;
}

.progress-bar {
    margin-left: 24px;
}

a {
    border-bottom: none;
}

</style>
