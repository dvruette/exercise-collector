import ExerciseScraper from '@/assets/scripts/ExerciseScraper'
import Exercise from '@/assets/interfaces/Exercise'
import SheetFactory from '@/assets/interfaces/SheetFactory'

export default class AnwScraper extends ExerciseScraper {

    constructor() {
        super({
            url: 'https://www.cadmo.ethz.ch/education/lectures/FS19/AW/index.html',
            name: 'Algorithmen und Wahrscheinlichkeit',
            tableConfigs: [
                {
                    index: 2,
                    skipFirstNRows: 2,
                    titleCellIndex: 2,
                    dateCellIndex: -1,
                    dateFormat: '',
                    pdfLinkIndex: 0,
                    solutionLinkIndex: 7
                }, {
                    index: 3,
                    skipFirstNRows: 1,
                    titleCellIndex: 0,
                    dateCellIndex: -1,
                    dateFormat: '',
                    pdfLinkIndex: 0,
                    solutionLinkIndex: 1
                },
            ]
        })
    }

    scrape(doc: Document) {
        return super.scrape(doc)
    }
}