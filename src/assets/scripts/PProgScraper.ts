import ExerciseScraper from '@/assets/scripts/ExerciseScraper'
import Exercise from '@/assets/interfaces/Exercise'
import SheetFactory from '../interfaces/SheetFactory';

export default class PProgScraper extends ExerciseScraper {

    constructor() {
        super({
            url: 'https://www.sri.inf.ethz.ch/teaching/pp2019',
            name: 'Parallel Programming',
            tableConfigs: [
                {
                    index: 1,
                    skipFirstNRows: 1,
                    titleCellIndex: 1,
                    dateCellIndex: 2,
                    dateFormat: 'DD.MM.YYYY',
                    pdfLinkIndex: 0,
                    solutionLinkIndex: 1
                }
            ]
        })
    }

    scrape(doc: Document) {
        return super.scrape(doc)
    }
}