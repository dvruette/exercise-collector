import ScraperConfig from '@/assets/interfaces/ScraperConfig';
import firebase from 'firebase/app'
import 'firebase/firestore'

interface ScraperConfigDocument {
    id: string
    createdAt: Date
    config: ScraperConfig
}


export default class FirebaseHelper {
    static uploadConfig(config: ScraperConfig): Promise<firebase.firestore.DocumentReference> {
        return firebase.firestore().collection('configs').add({ config, createdAt: new Date() })
    }

    static getConfigsFromUrl(url: string): Promise<ScraperConfigDocument[]> {
        return firebase.firestore().collection('configs').where('config.url', '==', url).get()
        .then(snapshot => {
            const query: ScraperConfigDocument[] = []
            snapshot.forEach(doc => {
                const data = doc.data()
                const config = {
                    id: doc.id,
                    createdAt: data.createdAt.toDate(),
                    config: data.config
                }
                console.log(config.createdAt, data.createdAt)
                query.push(config)
            })
            return query
        })
    }
}