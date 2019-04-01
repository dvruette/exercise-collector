<template>
    <div class="exercise-card">
        <div class="header">
            <div class="row">
                <h2>
                    {{ exercise.name }}&nbsp;
                    <a class="icon" :href="exercise.url" target="_blank">
                        <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-external-link-alt fa-w-18 fa-fw fa-lg"><path fill="currentColor" d="M576 24v127.984c0 21.461-25.96 31.98-40.971 16.971l-35.707-35.709-243.523 243.523c-9.373 9.373-24.568 9.373-33.941 0l-22.627-22.627c-9.373-9.373-9.373-24.569 0-33.941L442.756 76.676l-35.703-35.705C391.982 25.9 402.656 0 424.024 0H552c13.255 0 24 10.745 24 24zM407.029 270.794l-16 16A23.999 23.999 0 0 0 384 303.765V448H64V128h264a24.003 24.003 0 0 0 16.97-7.029l16-16C376.089 89.851 365.381 64 344 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V287.764c0-21.382-25.852-32.09-40.971-16.97z" class=""></path></svg>
                    </a>
                </h2>
                <div class="counter" :class="{ done: allDone }">
                    <span v-if="allDone" class="emoji">{{ successEmoji }}</span>
                    <span v-else>{{ toDoSheets.length }}</span>
                </div>
            </div>
        </div>

        <div class="filter-container">
            <div>
                <input :id="exercise.name+'-hide-finished'" type="checkbox" v-model="hideFinished">
                <label :for="exercise.name+'-hide-finished'">Hide finished tasks</label>
            </div>

            <div>
                <input :id="exercise.name+'-hide-all'" type="checkbox" v-model="hideAll">
                <label :for="exercise.name+'-hide-all'">Hide all</label>
            </div>
        </div>

        <transition-group name="list" tag="ul" class="sheet-list" v-if="!hideAll && (toDoSheets.length || doneSheets.length)">
            <li v-for="sheet in toDoSheets" :key="sheet.title">
                <sheet-component :sheet="sheet" @change="sheetChanged(sheet)" />
            </li>
            <li v-for="sheet in doneSheets" :key="sheet.title">
                <sheet-component :sheet="sheet" @change="sheetChanged(sheet)" />
            </li>
        </transition-group>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SheetComponent from './SheetComponent.vue'
import Exercise from '@/assets/interfaces/Exercise'
import Sheet from '@/assets/interfaces/Sheet'
import moment from 'moment'

@Component({
    components: { SheetComponent }
})
export default class Home extends Vue {
    @Prop() exercise!: Exercise
    hideFinished: boolean = false
    hideAll: boolean = false

    successEmoji: string = '🎉'

    constructor() {
        super()
        for (let sheet of this.exercise.sheets) {
            if (sheet.done) this.$store.commit('incrementDoneTasks')
            this.$store.commit('incrementTotalTasks')
        }

        const emoji = window.localStorage.getItem('exerciseEmoji')
        if (emoji) this.successEmoji = emoji
    }

    beforeMount() {
        this.loadSettings()
    }

    get doneSheets(): Sheet[] {
        return this.exercise.sheets.filter(sheet => sheet.done && !this.hideFinished && !this.hideAll)
    }

    get toDoSheets(): Sheet[] {
        return this.exercise.sheets.filter(sheet => !sheet.done)
    }

    get allDone(): boolean {
        let done = true
        this.exercise.sheets.forEach(sheet => {
            if (!sheet.done) done = false
        })
        return done
    }

    format(date: Date): string {
        if (!date.getTime) return '-'
        else return moment(Date.now() - date.getTime()).format()
    }

    sheetChanged(sheet: Sheet) {
        if (sheet.done) this.$store.commit('incrementDoneTasks')
        else this.$store.commit('decrementDoneTasks')
        this.$emit('save')
    }

    @Watch('hideFinished')
    @Watch('hideAll')
    saveSettings() {
        const string = window.localStorage.getItem('settings')
        let settings: any = {}
        if (string) {
            settings = JSON.parse(string)
        }
        settings[this.exercise.name] = {
            ...settings[this.exercise.name],
            hideFinished: this.hideFinished,
            hideAll: this.hideAll
        }
        window.localStorage.setItem('settings', JSON.stringify(settings))
    }

    loadSettings() {
        const string = window.localStorage.getItem('settings')
        if (string) {
            let settings = JSON.parse(string)
            settings = settings[this.exercise.name]
            if (settings) {
                this.hideFinished = settings.hideFinished
                this.hideAll = settings.hideAll
            }
        }
    }

}
</script>

<style lang="scss" scoped>
$dark: #2c3e50;
$green: rgb(28, 150, 75);
$orange: rgb(255, 198, 40);

.exercise-card {
    padding: 24px;
    border-radius: 5px;
    box-shadow: 0 4px 12px 0px rgba(0, 0, 0, 0.15);
    width: 100%;
    box-sizing: border-box;
}

.header {
    position: relative;

    h2 {
        font-size: 24px;
        margin: 0px;
        font-weight: bold;
    }

    .icon {
        border: none;
        height: 24px;
        svg {
            position: relative;
            top: 2px;
            display: inline-block;
            width: 24px;
            height: 24px;
        }
        path {
            transition: .3s ease;
            fill: rgba($dark, 0.5);
        }
        &:hover path {
            fill: rgba($dark, 0.7);
        }
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .counter {
        background-color: rgba($dark, 0.02);
        border: 1px solid $dark;
        border-radius: 36px;
        min-width: 36px;
        min-height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        font-weight: bold;
        transition: .3s ease;
        position: relative;
        top: -3px;
        right: -3px;

        &.done {
            background-color: rgb(255, 255, 245);
            border: 1px solid $orange;
            transform: scale(1.1);
        }

        .emoji {
            position: relative;
            top: -1px;
            left: 1px;
        }
        :not(.emoji) {
            font-size: 24px;
        }
    }


    .success {
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid rgb(230, 230, 230);
        width: fit-content;
    }
}

.filter-container {
    margin-top: 16px;

    label {
        font-size: 14px;
        font-weight: bold;
        color: $dark;
        margin-left: 8px;
    }
}

.sheet-list {
    padding: 0;
    margin: 0;
    margin-top: 16px;
    list-style: none;
    position: relative;

    & > li {
        display: flex;
        border-top: 2px solid rgb(230, 230, 230);
        padding: 8px 0 6px;

        &::before {
            content: '•';
            display: inline;
            margin: 0 8px 0 4px;
        }

        & > * {
            flex: 1;
        }

        &:last-child {
            padding-bottom: 0;
        }
    }
}

.list-enter-active, .list-leave-active, .list-move {
    transition: .3s ease;
    pointer-events: none;
    z-index: -1;
}

.list-enter-to, .list-leave {
    opacity: 1;
}

.list-enter, .list-leave-to {
    opacity: 0;
}
</style>

