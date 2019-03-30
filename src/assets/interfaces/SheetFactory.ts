
import Sheet from './Sheet'

export default class SheetFactory {

    static make(obj: {title: string, pdfUrl: string, solutionUrl: string, dueDate: Date | null}): Sheet {
        return {
            title: obj.title,
            pdfUrl: obj.pdfUrl,
            solutionUrl: obj.solutionUrl,
            dueDate: obj.dueDate && obj.dueDate.getDate() ? obj.dueDate : null,
            dueDateString: obj.dueDate && obj.dueDate.getDate() ? obj.dueDate.toISOString() : '',
            done: false
        }
    }
}