import Scraper from './Scraper'
import Exercise from '@/assets/interfaces/Exercise'
import ScraperConfig from '@/assets/interfaces/ScraperConfig'
import SheetFactory from '@/assets/interfaces/SheetFactory'
import moment from 'moment'

export default class ExerciseScraper extends Scraper {
    config: ScraperConfig

    constructor(config: ScraperConfig) {
        super()
        this.config = config
        this.baseUrl = config.url
    }

    scrape(doc: Document): Exercise {
        const exercise: Exercise = {
            name: this.config.name,
            url: this.baseUrl,
            sheets: []
        }

        // evaluate correct base URL to append to PDF-links
        let base = ''
        if (this.baseUrl.endsWith('index.html')) base = this.baseUrl.replace('index.html', '')
        if (this.baseUrl.endsWith('index.php')) base = this.baseUrl.replace('index.php', '')

        // iterate over all tables containing exercises
        let query = doc.querySelectorAll('table')
        for (let config of this.config.tableConfigs) {

            // iterate over all rows, fetching a sheet for each one
            query[config.index].querySelectorAll('tr').forEach((row, index) => {
                if (index < config.skipFirstNRows) return
                
                const cells = row.querySelectorAll('td')
                const links = row.querySelectorAll('a')

                const title = config.titleCellIndex >= 0 ?
                    cells[config.titleCellIndex].innerText
                    : 'Exercise ' + index
                const dateString = config.dateCellIndex >= 0
                    ? cells[config.dateCellIndex].innerText
                    : ''
                const dueDate = dateString ? moment(dateString, config.dateFormat).toDate() : null
                const pdfUrl = links.length > config.pdfLinkIndex
                    ? base + links[config.pdfLinkIndex].getAttribute('href')
                    : ''
                const solutionUrl = links.length > config.solutionLinkIndex
                    ? base + links[config.solutionLinkIndex].getAttribute('href')
                    : ''

                const sheet = SheetFactory.make({
                    title,
                    pdfUrl,
                    solutionUrl,
                    dueDate
                })
                exercise.sheets.push(sheet)
            })
        }
        
        return exercise
    }
}