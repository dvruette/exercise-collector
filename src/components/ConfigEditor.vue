<template>
    <div class="config-editor">
        <div class="close-button">
            <!-- TODO: add icon -->
            <button @click="$emit('close')">X</button>
        </div>

        <h3 class="title">Configure a new exercise</h3>

        <div v-if="tab == 'teaser'">
            <p>Coming soon...</p>
        </div>

        <div v-if="!tab || tab == 'start'" class="start">
            <form class="url-input" @submit.prevent="queryConfigsAndLoad">
                <label for="exercise-url">Enter a link to the desired lecture-website below:</label>
                <input id="exercise-url"
                    v-model="exerciseUrl"
                    @change="queryConfigsAndLoad"
                    type="url"
                    placeholder="https://lecture.ethz.ch">
                
                <p class="error" v-if="firebaseError">{{ firebaseError }}</p>
                <p class="error" v-if="scraperError">{{ scraperError }}</p>
            </form>

            <!-- TODO: add loading indicator -->

            <div v-if="queryCompleted" class="query-completed">
                <div v-if="queriedConfigs.length">
                    <p>There already exist configurations for this website:</p>

                    <ul class="config-list">
                        <li v-for="doc in queriedConfigs" :key="doc.id" class="config">
                            <p>{{ doc.config.name }} ({{ format(doc.createdAt) }})</p>
                            <!-- TODO: add icon -->
                            <button @click="addConfig(doc.config)">'plus-icon'</button>
                        </li>

                    </ul>

                    <button @click="tab = 'config-editor'">Create your own</button>
                </div>

                <div v-else>
                    <p class="empty-message">No configurations found. Do you want to create one?</p>

                    <div class="row">
                        <button @click="$emit('close')">
                            Abort
                        </button>
                        <button @click="tab = 'config-editor'">
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="tab == 'config-editor'" class="editor-tab">
            <config-form
                v-model="config"
                :dom="exerciseDom"
                :scraper="exerciseScraper" />
            
            <p>
                Once everything looks to your likings, press 'all good' to save the config.
                Also make sure that the links work, the are tricky sometimes.
            </p>

            <div class="row">
                <button @click="tab = 'start'">Back</button>
                <button @click="saveConfig">All good</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from 'vue-property-decorator'
import ConfigForm from './ConfigForm.vue'
import ExerciseCard from './ExerciseCard.vue'
import Exercise from '@/assets/interfaces/Exercise'
import ScraperConfig from '@/assets/interfaces/ScraperConfig'
import FirebaseHelper from '@/assets/scripts/FirebaseHelper'
import ExerciseScraper from '@/assets/scripts/ExerciseScraper'
import moment from 'moment'

@Component({
    components: { ConfigForm, ExerciseCard }
})
export default class ConfigEditor extends Vue {
    exerciseUrl: string = ''
    exerciseDom: Document | null = null
    exerciseScraper: ExerciseScraper
    exercise: Exercise | null = null

    queryCompleted: boolean = false
    queriedConfigs: any = []

    tab: string = ''

    config: ScraperConfig = {
        name: 'Placeholder',
        url: '',
        baseUrl: '',
        tableConfigs: [{
            index: 0,
            skipFirstNRows: 1,
            titleCellIndex: 0,
            dateCellIndex: -1,
            dateFormat: 'DD.MM.YYYY',
            pdfLinkIndex: 0,
            solutionLinkIndex: 1
        }]
    }
    scraperError: string = ''
    firebaseError: string = ''

    constructor() {
        super()
        this.exerciseScraper = new ExerciseScraper(this.config)
    }

    format(date: Date): string {
        return moment(date).format('M.D.YYYY')
    }

    queryConfigsAndLoad() {
        this.firebaseError = ''
        this.scraperError = ''
        this.config.url = this.exerciseUrl

        if (this.exerciseUrl) {
            // query firebase for existing configs
            FirebaseHelper.getConfigsFromUrl(this.exerciseUrl)
            .then(configDocs => {
                this.queriedConfigs = configDocs
                this.queryCompleted = true
            })
            .catch(error => {
                this.firebaseError = 'Could not connect to the database. ' +
                'Please try again later or open an issue if the problem persists.'
                console.error(error)
            })

            ExerciseScraper.fetch(this.exerciseUrl)
            .then(doc => {
                this.exerciseDom = doc
                this.exercise = this.exerciseScraper.scrape(doc, this.config)
            })
            .catch(error => {
                this.scraperError = 'Unable to load the provided URL. ' +
                    'Please review it and make sure that you\'re connected to the internet.'
                console.error(error)
            })
        } else {
            this.queriedConfigs = []
            this.queryCompleted = false
        }
    }

    saveConfig() {
        if (this.scraperError) return

        this.firebaseError = ''
        if (!confirm('Is everything working as it should? ' +
            'This config will be stored on a server for others to use as well.')) return
        
        // upload config to firebase
        FirebaseHelper.uploadConfig(this.config)
        .then(doc => {})
        .catch(error => {
            this.firebaseError = 'Could not connect to the database. ' +
                'Please try again later or open an issue if the problem persists.'
            console.error(error)
        })
        .finally(() => {
            // add config to local storage
            this.addConfig(this.config)
        })
    }

    addConfig(config: ScraperConfig): void {
        const configString = window.localStorage.getItem('configs')
        const configs: ScraperConfig[] = configString ? JSON.parse(configString) : []

        configs.push(config)
        window.localStorage.setItem('configs', JSON.stringify(configs))

        // then refresh to load all new sheets
        window.location = window.location
    }
}
</script>

<style lang="scss" scoped>
// TODO: add styles

.config-editor {
    position: relative;
    max-height: calc(100vh - 100px);
    overflow-y: auto;

    .title {
        margin-bottom: 16px;
    }
}

.close-button {
    position: absolute;
    right: 16px;
    top: 16px;
}


.start {
    form {
        display: flex;
        flex-direction: column;

        label {
            font-weight: 500;
            margin-bottom: 8px;
        }

        input {
            width: 100%;
        }
    }


    .query-completed {
        margin-top: 16px;
    }
}

.editor-tab {
    & > :not(:first-child) {
        margin-top: 16px;
    }
}


</style>

