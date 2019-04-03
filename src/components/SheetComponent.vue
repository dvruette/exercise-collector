<template>
    <div class="sheet-component">
        <div class="display">
            <div class="left">
                <div class="row between">
                    <a :href="sheet.pdfUrl" target="_blank">{{ sheet.title }}</a>
                </div>
                <div class="row small">
                    <p class="date" v-if="sheet.dueDate && sheet.dueDate.getTime() && !sheet.done">
                        Due until: {{ format(sheet.dueDate) }}
                    </p>
                    <a v-if="sheet.solutionUrl" :href="sheet.solutionUrl" target="_blank">
                        Solution
                    </a>
                </div>
            </div>

            <div class="right">
                <span class="badge"
                    :class="{ green: sheet.done, orange: !sheet.done }"
                    @click="setDone(!sheet.done)">
                    {{ sheet.done ? 'Done' : 'To do' }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Sheet from '@/assets/interfaces/Sheet'
import moment from 'moment'

@Component
export default class Home extends Vue {
    @Prop() sheet!: Sheet

    constructor() {
        super()
        this.$store.commit('incrementTotalTasks')
        if (this.sheet.done) this.$store.commit('incrementDoneTasks')
    }

    format(date: Date): string {
        if (!date.getTime) return '-'
        let string = moment(date).format('D.M.YYYY at ')
        const diff = moment(date).diff(moment(Date.now()), 'days')

        if (diff == 0) {
            return 'Today'
        } else if (diff < 0) {
            return moment(date).format('D.M.YYYY')
        } else {
            return moment(date).format('dddd') + ' (in ' + (diff + 1) + ' days)'
        }
    }

    setDone(done: boolean): void {
        if (this.sheet.done != done) {
            this.$store.commit(done ? 'incrementDoneTasks' : 'decrementDoneTasks')
        } 
        this.sheet.done = done
        this.$emit('change')
    }

}
</script>

<style lang="scss" scoped>
$dark: #2c3e50;

h3 {
    margin-top: 0;
}

.row {
    justify-content: space-between;

    & > :not(:last-child) {
        margin-right: 16px;
    }
}

.badge {
    cursor: pointer;
}

.display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .row {
        display: flex;

        a {
            margin: 0;
        }

        & > :not(:last-child) {
            margin-right: 8px;
        }
    }

    .small {
        font-size: 13px;
        font-weight: 500;
        color: rgba($dark, 0.8);

        a {
            color: rgba($dark, 0.6);
            &:hover {
                color: rgba($dark, 0.8);
                border-color: rgba($dark, 0.8);
            }
        }
    }
}


</style>
