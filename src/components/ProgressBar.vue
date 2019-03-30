<template>
    <div class="progress-bar" :class="{ done: !openTasks && totalTasks }" :style="{ width, height: width }">
        <svg class="stat-circle" viewBox="1.7 1.7 17 17" :style="{ width }">
            <circle class="bg" cx="10" cy="10" r="7" />
            <circle class="progress" cx="10" cy="10" r="7"
                :style="{ strokeDashoffset: progressRad }" />
        </svg>
        <!-- <div class="bar" :style="{ width: width + 'px' }">
            <div class="progress"
                :style="{ width: (width + 1) + 'px', transform: 'translateX(' + -progressWidth + 'px)' }" />
        </div> -->
        <p v-if="totalTasks" class="text" :style="{ fontSize: width/2 + 'px' }">
            <span v-if="openTasks">{{ openTasks }}</span>
            <span v-else class="emoji">🔥</span>
        </p>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ProgressBar extends Vue {
    @Prop() totalTasks!: number
    @Prop() doneTasks!: number
    @Prop() width!: number

    constructor() {
        super()
    }

    get openTasks(): number {
        return this.totalTasks - this.doneTasks
    }

    get progressWidth(): number {
        const q = 0.72, x = this.totalTasks - this.doneTasks, n = this.totalTasks
        return this.width - this.width * (1 - (1 - Math.pow(q, x) / (1 - Math.pow(q, n)))) + 1
    }

    get progressRad(): number {
        // between -51 (0%) and -96 (100%)
        const zero = -51, max = -96
        const q = 0.75, x = this.totalTasks - this.doneTasks, n = this.totalTasks
        
        if (this.totalTasks == 0) return zero
        return zero - (zero - max) * (1 - (1 - Math.pow(q, x) / (1 - Math.pow(q, n)))) + 1
    }
}
</script>

<style lang="scss" scoped>
$orange: rgb(255, 198, 40);
$green: rgb(28, 150, 75);

.progress-bar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .3s ease;

    &.done {

        .progress, .bg {
            stroke: rgba($orange, 0.6);
        }
    }
}

.stat-circle {
    transform: rotate(-90deg);

    .bg {
        transition: .4s ease;
        fill: none;
        stroke: rgb(230, 230, 230);
        stroke-width: 1.1;
    }

    .progress {
        transition: .3s ease;
        fill: none;
        stroke: $green;
        stroke-width: 1.5;
        stroke-dasharray: 51 51;
        stroke-dashoffset: -61;
    }
}

.text {
    position: absolute;
    font-weight: bold;
    color: white;
    transform: translateY(1px);

    .emoji {
        position: relative;
        top: -2px;
        font-size: 0.9em;
    }
}
</style>
