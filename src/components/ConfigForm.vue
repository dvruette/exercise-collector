<template>
    <div class="config-form">
        <div class="editor">
            <div class="tabs">
                <a @click="tab = 'form'">Form</a>
                <a @click="tab = 'json'">JSON editor</a>
            </div>

            <div v-if="tab == 'form'">
                <!-- TODO: add explanation for individual fields on hover/focus -->
                <div class="pack">
                    <label><strong>Exercise/lecture name</strong></label>
                    <input v-model="config.name" type="text">
                </div>


                <div v-for="(conf, index) in config.tableConfigs" :key="index">
                    <div class="pack">
                        <label>Index of the table containing exercises</label>
                        <input v-model="conf.index" type="number">
                    </div>

                    <div class="pack">
                        <label>Skip the first 'n' rows</label>
                        <input v-model="conf.skipFirstNRows" type="number">
                    </div>

                    <div class="pack">
                        <label>Index of title-column</label>
                        <input v-model="conf.titleCellIndex" type="number">
                    </div>

                    <div class="pack">
                        <label>Index of due-date-column (enter -1 if there is no date)</label>
                        <input v-model="conf.dateCellIndex" type="number">
                    </div>

                    <div class="pack">
                        <div>
                            <label>
                                <input type="checkbox" v-model="useDateFormat" >
                                Specify date format
                            </label>
                        </div>
                        <input type="text" v-if="useDateFormat" placeholder="e.g. 'DD.MM.YYYY'" v-model="conf.dateFormat">
                    </div>

                    <div class="pack">
                        <label>PDF link index</label>
                        <input v-model="conf.pdfLinkIndex" type="number">
                    </div>

                    <div class="pack">
                        <label>Solution link index</label>
                        <input v-model="conf.solutionLinkIndex" type="number">
                    </div>
                </div>

                <div class="row">
                    <button @click="pushTable">Add another table</button>
                    <button @click="popTable">Remove the lowermost table</button>
                </div>

                <div class="pack">
                    <div>
                        <label>
                            <input type="checkbox" v-model="useBaseUrl" >
                            Use special base URL to prepend to links
                        </label>
                    </div>
                    <input type="text" v-if="useBaseUrl" placeholder="Base URL" v-model="config.baseUrl">
                </div>

                <p class="error" v-if="scraperError">{{ scraperError }}</p>
            </div>

            <div v-else class="json-editor">
                <textarea v-model="configString" rows="18"></textarea>
                <p class="error" v-if="jsonError">{{ jsonError }}</p>
                <p class="error" v-if="scraperError">{{ scraperError }}</p>
            </div>
        </div>

        <div class="preview">
            <exercise-card v-if="exercise" :exercise="exercise" />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ExerciseCard from './ExerciseCard.vue'
import ScraperConfig from '@/assets/interfaces/ScraperConfig';
import Scraper from '@/assets/scripts/Scraper';
import Exercise from '@/assets/interfaces/Exercise';

@Component({
    components: { ExerciseCard }
})
export default class ConfigForm extends Vue {

    @Prop() value!: ScraperConfig
    @Prop() dom!: Document | null
    @Prop() scraper!: Scraper | null

    exercise: Exercise | null = null

    tab: string = 'form'
    useBaseUrl: boolean = false
    useDateFormat: boolean = false

    configString: string = ''
    jsonError: string = ''
    scraperError: string = ''

    get config(): ScraperConfig {
        return this.value
    }

    set config(val: ScraperConfig) {
        this.$emit('input', val)
    }

    mounted() {
        this.configString = JSON.stringify(this.config, null, 2)
        if (this.dom && this.scraper) this.exercise = this.scraper.scrape(this.dom, this.config)
    }

    @Watch('tab')
    tabChanged() {
        this.configString = JSON.stringify(this.config, null, 2)
    }

    @Watch('configString')
    parseConfigString() {
        this.jsonError = ''
        try {
            this.config = JSON.parse(this.configString)
        } catch (error) {
            this.jsonError = error.message
        }
    }

    @Watch('config', { deep: true })
    valueChanged() {
        this.$emit('input', this.config)
        this.scraperError = ''

        if (this.dom && this.scraper) {
            try {
                this.exercise = this.scraper.scrape(this.dom, this.config)
            } catch (error) {
                this.scraperError = 'Unable to process the current settings. ' +
                    'Make sure they correspond to the content in the provided URL.'
                console.error(error)
            }
        }
    }

    pushTable() {
        this.config.tableConfigs.push({
            index: this.config.tableConfigs.length,
            skipFirstNRows: 1,
            titleCellIndex: 0,
            dateCellIndex: 1,
            dateFormat: 'DD.MM.YYYY',
            pdfLinkIndex: 0,
            solutionLinkIndex: 1
        })
    }

    popTable() {
        if (this.config.tableConfigs.length > 1) {
            this.config.tableConfigs.pop()
        }
    }

}
</script>

<style lang="scss" scoped>

// TODO: add styling for form, esp. table form

.config-form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    & > :not(:last-child) {
        margin-right: 24px;
    }
}

.tabs {
    display: flex;
    margin-bottom: 8px;
    & > :not(:last-child) {
        margin-right: 16px;
    }
}

.editor {
    display: flex;
    flex-direction: column;
}

.json-editor {
    flex: 1;
    
    textarea {
        width: 450px;
        height: 100%;
        box-sizing: border-box;
        font-size: 12px;
        font-family: monospace;
        border: 2px solid rgba(black, 0);
        border-radius: 5px;
        box-shadow: 0 4px 12px 0px rgba(0, 0, 0, 0.15);
        transition: .3s ease border-color;
        padding: 8px;

        &:focus {
            border-color: rgba(#178352, 0.2);
            outline: none;
        }
    }
}


.preview {
    flex: 1;
    min-width: 300px;
}

.pack {
    display: flex;
    flex-direction: column;
    &:not(:last-child) {
        margin-bottom: 8px;
    }
}

</style>

