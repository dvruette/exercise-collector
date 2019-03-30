import ScraperConfig from '@/assets/interfaces/ScraperConfig'

const config: ScraperConfig[] = [
    {
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
    },

    {
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
    },

    {
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
    }
]

export default config