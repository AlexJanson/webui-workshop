const  puppeteer = require('puppeteer')
const { spawn } = require('node:child_process')
const assert = require('node:assert');
const config = require('../config.js');

async function waitForServerReady() {
    const url = `http://${config.http.hostname}:${config.http.port}`

    const child = spawn('node', ['index.js', 'config.js'])

    // child.stdout.on('data', (chunk) => {
    //     const text = chunk.toString()
    //     console.log(`[SERVER]: ${text}`)
    // })

    // child.stderr.on('data', (chunk) => {
    //     const text = chunk.toString()
    //     console.log(`[SERVER]: ${text}`)
    // })

    const browser = await puppeteer.launch({ headless: true })
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const page = await browser.newPage()
    page.on('error', (pageerror) => {
        console.error(pageerror)
    })
    page.on('pageerror', (pageerror) => {
        console.error(pageerror)
    })
    page.on('console', (msg) => {
        let lines = msg.args() || []

        lines.forEach((line) => console.log(`\t\t${line}`))
    })

    return { url, page, browser, child }
}

describe('Application end-to-end tests', function() {
    this.timeout(15000)
    
    let url = undefined
    let page = undefined
    let browser = undefined
    let child = undefined

    before(async () => {
        ({ url, page, browser, child } = await waitForServerReady())
    }, { timeout: 5000 })

    after(async () => {
        if (browser) {
            await browser.close()
        }

        if (child) {
            child.kill()
        }
    })

    it('should successfully connect to the application and load the page', async () => {
        // await page.goto(url, { waitUntil: 'networkidle0' })
        await page.goto(url)
        const currentUrl = page.url()
        assert.strictEqual(currentUrl, 'http://localhost:8080/?page=home')
    })

    describe('Home page tests', () => {
        beforeEach(async () => {
            await page.goto(`${url}/?page=home`) 
        })

        it('should check if the action buttons are successfully created', async () => {
            const aboutButton = await page.$('button#buttonAbout')
            const userNameButton = await page.$('button#buttonUserName')
            assert.ok(aboutButton, 'About link button with ID buttonAbout must be present in the DOM')
            assert.ok(userNameButton, 'Username button with ID buttonUserName must be present in the DOM')
        })

        it('should check if the action buttons have the expected class list', async () => {
            const classListAbout = await page.$eval('button#buttonAbout', element => element.className)
            const classListUserName = await page.$eval('button#buttonUserName', element => element.className)

            const expectedClassesAbout = 'btn btn-primary'
            const expectedClassesUserName = 'btn'
            assert.strictEqual(classListAbout, expectedClassesAbout, `Expected class list to be '${expectedClassesAbout}', but found '${classListAbout}'`)
            assert.strictEqual(classListUserName, expectedClassesUserName, `Expected class list to be '${expectedClassesUserName}', but found '${classListUserName}'`)
        })

        it('should check if the username is displayed upon clicking the username button', async () => {
            const expectedText = 'ajanson'
            const buttonSelector = 'button#buttonUserName'
            const spanSelector = 'span#userName'

            await page.click(buttonSelector)
            
            await page.waitForFunction(
                (selector, expectedText) => {
                    const element = document.querySelector(selector)
                    return element && element.textContent === expectedText
                },
                {},
                spanSelector,
                expectedText
            )

            const labelText = await page.$eval(spanSelector, element => element.textContent)
            assert.strictEqual(labelText, expectedText, `User name label should be updated to '${expectedText}'`)
        })
        
        it('should verify page navigation to the about page when clicking the about button', async () => {
            const aboutButton = await page.$('button#buttonAbout')

            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                aboutButton.click()
            ])

            const expectedUrl = `${url}/?page=about`
            assert.strictEqual(page.url(), expectedUrl, 'After click, URL should navigate to the About page')
        })
    })

    describe('About page tests', () => {
        beforeEach(async () => {
            await page.goto(`${url}/?page=about`) 
        })

        it('should check if the action buttons are successfully created', async () => {
            const homeButton = await page.$('button#buttonHome')
            const detailsButton = await page.$('button#buttonDetails')
            assert.ok(homeButton, 'Home link button with ID buttonHome must be present in the DOM')
            assert.ok(detailsButton, 'Details button with ID buttonDetails must be present in the DOM')
        })

        it('should check if the action buttons have the expected class list', async () => {
            const classListHome = await page.$eval('button#buttonHome', element => element.className)
            const classListDetails = await page.$eval('button#buttonDetails', element => element.className)

            const expectedClassesHome = 'btn btn-primary'
            const expectedClassesDetails = 'btn'
            assert.strictEqual(classListHome, expectedClassesHome, `Expected class list to be '${expectedClassesHome}', but found '${classListHome}'`)
            assert.strictEqual(classListDetails, expectedClassesDetails, `Expected class list to be '${expectedClassesDetails}', but found '${classListDetails}'`)
        })

        it('should retrieve the details from the backend using the details button', async () => {
            const detailsButtonSelector = 'button#buttonDetails';
            const apiUrl = `${url}/api/`
            
            const [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes(apiUrl) && res.status() === 200),
                page.click(detailsButtonSelector)
            ])

            const json = await response.json()

            assert.ok(response, 'Network request must receive a response object')
            assert.strictEqual(response.status(), 200, 'API response status should be 200 OK')
            assert.strictEqual(typeof json.version, 'string', 'Version field must be a string')
            assert.ok(json.version.length > 0, 'Version string must not be empty')
            assert.strictEqual(typeof json.date, 'string', 'Date field must be a string')
            assert.ok(json.date.length > 0, 'Date string must not be emtpy')
        })
        
        it('should verify page navigation to the home page when clicking the home button', async () => {
            const homeButton = await page.$('button#buttonHome')

            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                homeButton.click()
            ])

            const expectedUrl = `${url}/?page=home`
            assert.strictEqual(page.url(), expectedUrl, 'After click, URL should navigate to the Home page')
        })
    })
})