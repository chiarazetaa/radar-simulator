async function search(url) {
    let noUrl = document.getElementById('noUrl');
    let results = document.getElementById('results');
    let urlResult = document.getElementById('urlResult');
    let languageResult = document.getElementById('languageResult');
    let targetUrlResult = document.getElementById('targetUrlResult');
    let matchingStringResult = document.getElementById('matchingStringResult');

    if (url && url !== '') {
        noUrl.style.display = 'none';
        results.style.display = 'block';
        urlResult.innerHTML = 'URL: <a href="' + url + '" target="_blank">' + url + '</a>';
    } else {
        results.style.display = 'none';
        noUrl.style.display = 'block';
        noUrl.innerText = 'Please insert URL';
        return;
    }

    try {
        let response = await fetch('/check-terms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        let result = await response.json();

        // show language
        if (result && result.lang && result.lang !== '') {
            languageResult.innerText = 'Language detected: ' + result.lang;
        } else {
            languageResult.innerText = 'Language not supported';
        }

        // show target url
        if (result && result.targetURL && result.targetURL !== '') {
            targetUrlResult.innerHTML = 'Target URL found: <a href="' + result.targetURL + '" target="_blank">' + result.targetURL + '</a>';
            matchingStringResult.innerText = 'Matching string: ' + result.matchingString;
        } else {
            targetUrlResult.innerText = 'No matching link found';
            matchingStringResult.innerText = '';
        }
    } catch (error) {
        results.style.display = 'none';
        noUrl.style.display = 'block';
        noUrl.innerText = 'Something went wrong';
        console.error("Error:", error);
    }
}