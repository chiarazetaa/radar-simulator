// search
async function search(url) {
    let loading = document.getElementById('loading');
    let noUrl = document.getElementById('noUrl');
    let results = document.getElementById('results');
    let urlResult = document.getElementById('urlResult');
    let languageResult = document.getElementById('languageResult');
    let targetUrlResult = document.getElementById('targetUrlResult');
    let matchingStringResult = document.getElementById('matchingStringResult');

    // clear results and show loading bar
    results.style.display = 'none';

    if (url && url !== '') {
        noUrl.style.display = 'none';
        loading.innerHTML = `
        <div class="progress" style="height:10px">
            <div class="progress-bar progress-bar-striped progress-bar-animated" style="width:100%; height:10px"></div>
        </div>`;
    } else {
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

        if (response) {
            loading.innerHTML = '';
            results.style.display = 'block';
            urlResult.innerHTML = 'URL: <a href="' + url + '" target="_blank">' + url + '</a>';

            let responseJson = await response.json();
            // show language
            if (responseJson && responseJson.lang && responseJson.lang !== '') {
                languageResult.innerText = 'Language detected: ' + responseJson.lang;
            } else {
                languageResult.innerText = 'Language not supported';
            }

            // show target url
            if (responseJson && responseJson.targetURL && responseJson.targetURL !== '') {
                targetUrlResult.innerHTML = 'Target URL found: <a href="' + responseJson.targetURL + '" target="_blank">' + responseJson.targetURL + '</a>';
                matchingStringResult.innerText = 'Matching string: ' + responseJson.matchingString;
            } else {
                targetUrlResult.innerText = 'No matching link found';
                matchingStringResult.innerText = '';
            }
            return;
        } else {
            results.style.display = 'none';
            noUrl.style.display = 'block';
            noUrl.innerText = 'Something went wrong';
            return;
        }
    } catch (error) {
        results.style.display = 'none';
        noUrl.style.display = 'block';
        noUrl.innerText = 'Something went wrong';
        console.error("Error:", error);
    }
}

window.onload = function() {
    // history
    async function showHistory() {
        let historyResults = document.getElementById('historyResults');
        let noHistoryResults = document.getElementById('noHistoryResults');
        if (historyResults && noHistoryResults) {
            try {
                let response = await fetch('/readFile', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response) {
                    let text = '<ul>';
                    let responseJson = await response.json();
                    for (let element of responseJson) {
                        let lang = (element.lang && element.lang !== '') ? element.lang : 'Language not supported';
                        let targetURL = (element.targetURL && element.targetURL !== '') ? `<a href="${element.targetURL}" target="__blank">${element.targetURL}</a>` : 'No matching link found';
                        let matchingString = (element.matchingString && element.matchingString !== '') ? element.matchingString : '\\';
                        text += `<li style="margin-bottom:1em">
                            ${element.date} | 
                            <span style="color: #169e74">URL:</span> <a href="${element.url}" target="__blank">${element.url}</a> | 
                            <span style="color: #169e74">LANG:</span> ${lang}<br>
                            <span style="color: #169e74">TARGET URL:</span> ${targetURL} | 
                            <span style="color: #169e74">MATCHING STRING:</span> ${matchingString}
                        </li>`;
                    }
                    text += '</ul>';
                    historyResults.innerHTML = text;
                } else {
                    noHistoryResults.innerText = 'Something went wrong';
                }
                return;
            } catch (error) {
                noHistoryResults.innerText = 'Something went wrong';
                console.error("Error:", error);
            }   
        }
    }
    showHistory();
}