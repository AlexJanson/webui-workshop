import Home from './pages/home/Home.js';
import About from './pages/about/About.js';
import {Observable, QueryRouter, Loader, sessionService, WebSocketClient} from '/js/src/index.js';

/**
 * Root of model tree
 * Handle global events: keyboard, websocket and router location change
 */
export default class Model extends Observable {
  /**
   * Load all sub-models and bind event handlers
   */
  constructor() {
    super();

    this.session = sessionService.get();
    this.session.personid = parseInt(this.session.personid, 10);

    this.loader = new Loader(this);
    this.loader.bubbleTo(this);

    this.homePageModel = new Home(this);
    this.homePageModel.bubbleTo(this);

    this.aboutPageModel = new About(this);
    this.aboutPageModel.bubbleTo(this);

    // Setup router
    this.router = new QueryRouter();
    this.router.observe(this.handleLocationChange.bind(this));
    this.router.bubbleTo(this);

    this.randomNumber = -1
    this.ws = new WebSocketClient();
    this.ws.addListener('authed', this.handleWSAuthed.bind(this))
    this.ws.addListener('command', this.handleWSCommand.bind(this))

    this.handleLocationChange(); // Init first page
  }

  /**
   * Delegates sub-model actions depending on new location of the page
   */
  handleLocationChange() {
    switch (this.router.params.page) {
      case 'home':
        break;
      case 'about':
        break;
      default:
        this.router.go('?page=home');
        break;
    }
  }

  handleWSAuthed() {
    this.ws.setFilter(() => true)
  }

  handleWSCommand(message) {
    if (message.command == "random-number") {
      this.randomNumber = message.payload.value
      this.notify()
    }
  }
}
