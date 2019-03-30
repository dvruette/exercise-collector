import ExerciseScraper from '@/assets/scripts/ExerciseScraper'
import Exercise from '@/assets/interfaces/Exercise'
import SheetFactory from '@/assets/interfaces/SheetFactory'

export default class AnalysisScraper extends ExerciseScraper {

    constructor() {
        super({
            url: 'https://metaphor.ethz.ch/x/2019/fs/401-0212-16L/',
            name: 'Analysis I',
            tableConfigs: [
                {
                    index: 1,
                    skipFirstNRows: 1,
                    titleCellIndex: -1,
                    dateCellIndex: 1,
                    dateFormat: 'DD.MM.YYYY',
                    pdfLinkIndex: 0,
                    solutionLinkIndex: 1
                }
            ]
        })
    }

    scrape(doc: Document) {
        return super.scrape(doc)
        // const exercise: Exercise = {
        //     name: 'Analysis',
        //     url: this.baseUrl,
        //     sheets: []
        // }
        // let table = doc.querySelectorAll("table")[1].firstElementChild;
        // if (table) {
        //     table.querySelectorAll("tr").forEach((row, index) => {
        //         let cells = row.querySelectorAll("td");
        //         if (cells.length) {
        //             const links = row.querySelectorAll("a")
        //             const firstLink = links[0]
        //             const secondLink = links.length > 1 ? links[1] : undefined;
        //             const strings = cells[1].innerHTML.split('.')
        //             const date = new Date(Number('20' + strings[2]), Number(strings[1]) - 1, Number(strings[0]))

        //             const sheet = SheetFactory.make({
        //                 title: "Analysis Exercise " + index,
        //                 pdfUrl: firstLink ? this.baseUrl + firstLink.getAttribute("href") : '',
        //                 solutionUrl: secondLink ? this.baseUrl + secondLink.getAttribute("href") : '',
        //                 dueDate: date
        //             })
        //             exercise.sheets.push(sheet)
        //         }
        //     })
        // }
        // return exercise
    }
}