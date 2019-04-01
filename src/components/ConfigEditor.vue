<template>
    <div class="config-editor">
        <h3>Configure a new exercise</h3>

        <div v-if="!tab || tab == 'start'">
            <form class="url-input" @submit.prevent="queryConfigs">
                <label for="exercise-url">Enter a link to the desired lecture-website below:</label>
                <br>
                <input id="exercise-url"
                    v-model="exerciseUrl"
                    @change="queryConfigs"
                    type="url"
                    placeholder="https://lecture.ethz.ch">
                
                <p class="error" v-if="firebaseError">{{ firebaseError }}</p>
            </form>

            <!-- TODO: add loading indicator -->

            <div v-if="queryCompleted">
                <div v-if="queriedConfigs.length">
                    <ul class="config-list">
                        <li v-for="doc in queriedConfigs" :key="doc.id" class="config">
                            <p>{{ doc.config.name }} ({{ format(doc.createdAt) }})</p>
                            <button>'plus-icon'</button>
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

        <div v-else-if="tab == 'config-editor'">
            <div>
                <a @click="editor = 'form'">Form</a>
                <a @click="editor = 'json'">JSON editor</a>
            </div>

            <div v-if="editor == 'form'">
                <!-- TODO: add form -->
                <p>This form is yet to be added.</p>
            </div>

            <div v-else>
                <textarea v-model="configJsonString" @change="parseConfigString"></textarea>
                <p class="error" v-if="jsonError">{{ jsonError }}</p>
                <p class="error" v-if="scraperError">{{ scraperError }}</p>
            </div>

            <div class="row">
                <button @click="tab = 'start'">Back</button>
                <button @click="scrapeAndContinue">Continue</button>
            </div>
        </div>

        <div v-else-if="tab == 'confirm'">
            <!-- TODO: add loading indicator -->
            <p>This is how the collected exercises are going to look like.
                Does everything seem good? If not, go back and change the configuration.</p>
            <exercise-card v-if="exercise" :exercise="exercise" />

            <div class="row">
                <button @click="tab = 'config-editor'">Go back</button>
                <button @click="saveConfig">All good</button>
            </div>

            <p class="error" v-if="firebaseError">{{ firebaseError }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from 'vue-property-decorator'
import ExerciseCard from './ExerciseCard.vue'
import Exercise from '@/assets/interfaces/Exercise'
import ScraperConfig from '@/assets/interfaces/ScraperConfig'
import FirebaseHelper from '@/assets/scripts/FirebaseHelper'
import ExerciseScraper from '@/assets/scripts/ExerciseScraper'
import moment from 'moment'

@Component({
    components: { ExerciseCard }
})
export default class ConfigEditor extends Vue {
    exerciseUrl: string = ''
    queryCompleted: boolean = false
    queriedConfigs: any = []

    tab: string = ''
    editor: string = 'json'

    configJsonString: string = ''

    config: ScraperConfig = {
        name: '',
        url: '',
        baseUrl: '',
        tableConfigs: [{
            index: 0,
            skipFirstNRows: 1,
            titleCellIndex: 0,
            dateCellIndex: 1,
            dateFormat: 'DD.MM.YYYY',
            pdfLinkIndex: 0,
            solutionLinkIndex: 1
        }]
    }
    scraperError: string = ''
    jsonError: string = ''
    firebaseError: string = ''

    exercise: Exercise | null = null
    
    constructor() {
        super()
    }

    created() {
        console.log('hi')
        this.stringifyConfig()
        console.log(this.configJsonString)
    }

    format(date: Date): string {
        return moment(date).format('M.D.YYYY')
    }
    
    stringifyConfig() {
        this.configJsonString = JSON.stringify(this.config, null, 2)
    }

    parseConfigString() {
        this.jsonError = ''
        try {
            this.config = JSON.parse(this.configJsonString)
        } catch (error) {
            this.jsonError = error.message
        }
    }

    queryConfigs() {
        this.firebaseError = ''
        this.config.url = this.exerciseUrl
        this.stringifyConfig()

        if (this.exerciseUrl) {
            // query firebase for existing configs
            FirebaseHelper.getConfigsFromUrl(this.exerciseUrl)
            .then(configDocs => {
                this.queriedConfigs = configDocs
                this.queryCompleted = true
            })
            .catch(error => {
                this.firebaseError = `Could not connect to the database.
                    Please try again later or open an issue if the problem persists.`
                console.error(error)
            })
        } else {
            this.queriedConfigs = []
            this.queryCompleted = false
        }
    }

    scrapeAndContinue() {
        this.parseConfigString()
        this.exercise = null
        // scrape exercises with provided configuration
        const scraper = new ExerciseScraper(this.config)
        try {
            scraper.load()
            .then(exercise => {
                this.exercise = exercise
                this.tab = 'confirm'
            })
        } catch (error) {
            this.scraperError = `Something went wrong while trying to load the provieded configuration.
                Please make sure you entered the correct URL and you're connected to the internet.`
        }

    }

    saveConfig() {
        this.firebaseError = ''
        // upload config to firebase
        FirebaseHelper.uploadConfig(this.config)
        .then(doc => {})
        .catch(error => {
            this.firebaseError = `Could not connect to the database.
                Please try again later or open an issue if the problem persists.`
            console.error(error)
        })
        .finally(() => {
            // add config to local storage
            const configString = window.localStorage.getItem('configs')
            const configs: ScraperConfig[] = configString ? JSON.parse(configString) : []
            configs.push(this.config)
            window.localStorage.setItem('configs', JSON.stringify(configs))

            // then refresh to load all new sheets
            window.location = window.location
        })
        
    }
}
</script>

<style lang="scss" scoped>
// TODO: add styles
</style>

