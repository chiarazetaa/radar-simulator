const express = require('express');
const puppeteer = require('puppeteer');
const langdetect = require('langdetect');
const _ = require('lodash');
const languageMapping = require('./languageMapping.json').languageMapping;
const termsConditionStrings = require('./termsConditionStrings.json');

const app = express();
const port = 3000;

app.use(express.static("../client"));

// parse requests of content-type - application/json
app.use(express.json());

app.listen(port, () => {
    console.log('Server is running at http://localhost:' + port);
});

app.post('/check-terms', async function (req, res) {
    try {
        let url = req.body.url;
        let browser = await puppeteer.launch({ headless: 'new' });
        let page = await browser.newPage();

        // navigate to URL
        await page.goto(url);

        // extract page content
        let content = await page.content();

        // use langdetect library to detect the page language
        let pageLanguageId = langdetect.detect(content)[0].lang;
        let pageLanguage = '';
        if (_.find(languageMapping, function (el) { return el.id === _.upperCase(pageLanguageId) })) {
            pageLanguage = _.find(languageMapping, function (el) { return el.id === _.upperCase(pageLanguageId) }).lang;
        }

        // find the target url
        let targetURL = await getTargetURL(page, pageLanguageId);
        await browser.close();

        res.status(200).send({ lang: pageLanguage, targetURL: targetURL });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function getTargetURL(page, pageLanguageId) {
    // get all links on the page
    const links = await page.$$eval('a', function (anchors) {
        return anchors.map(function (anchor) { return anchor.href; });
    });

    // get terms and condition strings based on the detected language
    let searchStrings = _.find(termsConditionStrings, function (value, key) {
        return key === _.upperCase(pageLanguageId)
    });

    // find the first link containing at least one string from searchStrings
    let targetURL = _.find(links, function (link) {
        link = _.lowerCase(link);
        return searchStrings.some(function (string) { 
            string = _.lowerCase(string);
            return link.includes(string) 
        });
    });
    if (targetURL) {
        console.log('Target URL found: ' + targetURL);
    } else {
        console.log('No matching link found.');
    }

    return targetURL;
}