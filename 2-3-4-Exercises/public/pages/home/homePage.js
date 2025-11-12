import userNameLabel from './components/userNameLabel.js';
import { h, info, iconPerson } from '/js/src/index.js';

export default (model) => [
    h('p', 'this is the home page!'),
    h(
        'button.btn.btn-primary#buttonAbout',
        {
            onclick: () => model.router.go('?page=about')
        }, 
        [info(), 'About']
    ),
    h(
        'button.btn#buttonUserName',
        {
            onclick: () => model.homePageModel.setUserName('ajanson')
        },
        iconPerson()
    ),
    userNameLabel(model)
]
