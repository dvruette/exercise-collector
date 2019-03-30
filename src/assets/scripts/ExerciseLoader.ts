
import Exercise from '@/assets/interfaces/Exercise'
import ScraperConfig from '@/assets/interfaces/ScraperConfig'
import Scraper from './Scraper';
import ExerciseScraper from './ExerciseScraper';

export default class ExerciseLoader {

    static load(configs: ScraperConfig[]): Promise<Exercise[]> {
        const scrapers: Scraper[] = []
        for (let config of configs) {
            scrapers.push(new ExerciseScraper(config))
        }
        
        return new Promise((resolve, reject) => {
            const exercises = [];
            const promises = [];
            
            // get promises from all scrapers
            for (let i = 0; i < scrapers.length; i++) {
                exercises.push([])
                promises.push(scrapers[i].load())
            }
    
            Promise.all(promises)
            .then(exercises => {
                for (let exercise of exercises) {
                    // sort all sheets from newest to oldest
                    exercise.sheets = exercise.sheets.sort((a, b) => {
                        if (b.dueDate == null) return -1
                        if (a.dueDate == null) return 1
                        return a.dueDate > b.dueDate ? -1 : a.dueDate < b.dueDate ? 1 : 0;
                    })
                }

                // get exercises stored in local storage
                const data = window.localStorage.getItem('exercises')
                if (data) {
                    const old: Exercise[] = JSON.parse(data)
                    for (let exercise of exercises) {
                        const oldEx = old.find(ex => ex.name == exercise.name)
                        // check which sheets are already done
                        if (oldEx) {
                            for (let oldSheet of oldEx.sheets) {
                                const sheet = exercise.sheets.find(sh => sh.title == oldSheet.title)
                                if (sheet) sheet.done = oldSheet.done
                            }
                        }
                    }
                }

                resolve(exercises)
            })
            .catch(reject)
        })
    }
}