async function search(url) {
    
    document.getElementById('urlResult').innerHTML = 'URL: <a href="' + url + '" target="_blank">' + url + '</a>';
    
    try {
        let response = await fetch('/check-terms', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: url })
        });

        let result = await response.json();

        // show language
        if (result && result.lang && result.lang !== '') {
            document.getElementById('languageResult').innerText = 'Language detected: ' + result.lang;
        } else {
            document.getElementById('languageResult').innerText = 'No language detected';
        }

        // show target url
        if (result && result.targetURL && result.targetURL !== '') {
            document.getElementById('targetUrlResult').innerHTML = 'Target URL found: <a href="' + result.targetURL + '" target="_blank">' + result.targetURL + '</a>';
        } else {
            document.getElementById('targetUrlResult').innerText = 'No matching link found';
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

