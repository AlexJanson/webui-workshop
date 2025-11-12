import { Observable } from '/js/src/index.js';

export default class Home extends Observable {
    constructor(model) {
        super()
        
        this.model = model
        this.userName = ''
    }

    getUserName() {
        return this.userName
    }

    setUserName(userName) {
        this.userName = userName

        this.notify()
    }
}
