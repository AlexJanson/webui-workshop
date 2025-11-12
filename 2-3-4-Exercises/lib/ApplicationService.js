export class ApplicationService {
    constructor(version) {
        this.version = version
    }

    getDetails() {
        return {
            'date': new Date().toLocaleDateString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZoneName: 'short'
            }),
            'version': this.version
        }
    }
}
