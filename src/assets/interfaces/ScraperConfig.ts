

export default interface ScraperConfig {
    url: string
    baseUrl?: string
    name: string
    tableConfigs: {
        index: number
        skipFirstNRows: number
        titleCellIndex: number
        dateCellIndex: number
        dateFormat: string
        pdfLinkIndex: number
        solutionLinkIndex: number
    }[]
}