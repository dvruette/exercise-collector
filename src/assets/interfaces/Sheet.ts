

export default interface Sheet {
    title: string
    pdfUrl: string
    solutionUrl: string
    dueDate: Date | null
    dueDateString: string
    done: boolean
}