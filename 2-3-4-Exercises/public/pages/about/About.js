import { Observable, fetchClient, RemoteData } from '/js/src/index.js'

export default class About extends Observable {
    constructor(model) {
        super()

        this.model = model
        this.details = RemoteData.NotAsked()
        this.requestedTimes = 0
    }

    async getDetails() {
        this.details = RemoteData.Loading()
        this.notify()

        const { result, ok } = await this.model.loader.get(`/api/`)
        this.details = ok
            ? RemoteData.success(result)
            : RemoteData.failure(result.error || result.message)
        this.requestedTimes++
        this.notify()
    }
}
