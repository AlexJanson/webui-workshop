import { h, iconHome, iconCloudUpload } from '/js/src/index.js';

export default (model) => [
    h('p', 'this is the about page!'),
    h(
        'button.btn.btn-primary#buttonHome',
        {
            onclick: () => model.router.go('?page=home')
        },
        [iconHome(), 'Home']
    ),
    h(
        'button.btn#buttonDetails',
        {
            onclick: () => model.aboutPageModel.getDetails()
        },
        [iconCloudUpload(), 'Request data about the application']
    ),
    model.aboutPageModel.details.match({
        NotAsked: () => `Data has not been asked yet`,
        Loading: () => `Data is loading.`,
        Success: (items) => table(items),
        Failure: (error) => `An error occured: ${error}`
    })
]

const table = (items) => h('table.table', [
    h('thead', [
        h('tr', [
            h('th', 'Key'),
            h('th', 'Value')
        ])
    ]),
    h('tbody', [
        Object.entries(items).map(([key, value]) => h('tr', [
            h('td', key),
            h('td', value)
        ]))
    ])
])
