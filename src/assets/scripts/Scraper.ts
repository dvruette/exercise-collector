
import Exercise from '@/assets/interfaces/Exercise'

export default abstract class Scraper {
    static proxyUrl: string = "https://cors-anywhere.herokuapp.com/"
    baseUrl: string = ''

    load(): Promise<Exercise> {
        return new Promise((resolve, reject) => {
            this.fetch(this.baseUrl)
            .then(doc => {
                if (doc) resolve(this.scrape(doc))
                else reject(new Error('Document could not be loaded: ' + this.baseUrl))
            })
            .catch(reject)
        })
    }

    fetch(url: string): Promise<Document> {
        return new Promise<Document>((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.onload = () => {
                let doc: Document = xhr.response
                resolve(doc)
            }
            xhr.onerror = () => {
                reject(new Error('Resource could not be loaded: ' + url))
            }

            xhr.responseType = "document"
            xhr.open("GET", Scraper.proxyUrl + url)
            xhr.send()
        })
    }

    abstract scrape(doc: Document): Exercise;
}