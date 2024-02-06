const express = require('express');
const puppeteer = require('puppeteer');
const langdetect = require('langdetect');
const _ = require('lodash');
const fs = require('fs');
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
        let result = {
            url: url,
            date: new Date(),
            lang: '', 
            targetURL: '', 
            matchingString: ''
        }

        // navigate to URL
        await page.goto(url);

        // extract page content
        let content = await page.content();

        // detect the page language by getting the "lang" attribute of the HTML page
        let pageLanguageId = await page.evaluate('document.querySelector("html").getAttribute("lang")');

        // if not found use langdetect library to detect the page language
        if (!pageLanguageId) {
            pageLanguageId = langdetect.detect(content)[0].lang;
        }

        if (pageLanguageId && _.find(languageMapping, function (el) { return el.id === _.upperCase(pageLanguageId) })) {
            let pageLanguage = _.find(languageMapping, function (el) { return el.id === _.upperCase(pageLanguageId) }).lang;
            
            // find the target url
            let targetURLObj = await getTargetURL(page, pageLanguageId);

            result.lang = pageLanguage;
            result.targetURL = targetURLObj.targetURL; 
            result.matchingString = targetURLObj.matchingString;
        } 

        await browser.close();

        // write result on txt file
        fs.appendFile('history.txt', JSON.stringify(result), err => {
            if (err) {
              console.error('Error writing file: ', err);
            } else {
              console.log('File written successfully');
            }
        });

        // send response
        res.status(200).send(result);
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
    let matchingString = '';
    let targetURL = _.find(links, function (link) {
        link = _.lowerCase(link);
        return searchStrings.some(function (string) { 
            matchingString = string;
            return link.includes(string);
        });
    });
    if (targetURL) {
        console.log('Target URL found: ' + targetURL);
        console.log('Matching string: ' + matchingString);
    } else {
        console.log('No matching link found.');
    }

    return {targetURL: targetURL, matchingString: matchingString};
}

app.get('/readFile', async function (req, res) {
    try {
    // read history on txt file
    fs.readFile('history.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file: ', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('File read successfully');
            // convert the string into a valid JSON array
            const jsonArrayString = `[${data.replace(/}{/g, '},{')}]`;

            // parse the JSON array string into a JavaScript array
            const jsonArray = JSON.parse(jsonArrayString);
            res.status(200).send(jsonArray);
        }
    });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});