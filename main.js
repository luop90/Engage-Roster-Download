const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// Set these to be the organization you want to parse
let baseURI = 'https://mines.campuslabs.com';
let engageURL = 'engage/actioncenter/organization/association-for-computing-machinery-women/roster';
let totalPages = 4;
let outputFileName = 'output.csv';

// Add the auth cookies
// You need to set all of these for it to work.
let cookieJar = request.jar();

cookieJar.setCookie(request.cookie('ARRAffinity='), baseURI);
cookieJar.setCookie(request.cookie('.AspNetCore.Cookies='), baseURI);
cookieJar.setCookie(request.cookie('.AspNetCore.CookiesC1='), baseURI);
cookieJar.setCookie(request.cookie('.AspNetCore.CookiesC2='), baseURI);

// Set up the options to be used in the request object
const options = {
    baseUrl: baseURI,
    url: engageURL,
    jar: cookieJar
};

// Create the output file & initialize to blank
fs.writeFileSync(outputFileName, '');

// Parse the pages...
for (let i = 1; i <= totalPages; i++) {
    downloadAndParsePage(i);
}

/**
 * Downloads and parses the roster, at page number given.
 * @param pageNum
 */
function downloadAndParsePage(pageNum) {
    options.url = engageURL + `?Direction=Ascending&Page=${pageNum}`;
    console.log(`Parsing page ${options.url}`);

    // Load the main page
    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            return;
        }

        let $ = cheerio.load(body);
        let data = $('div#roster tbody tr');

        // I'm not sure why this works, but for some reason my interchanging use of async / sync operations works
        // so uh, I won't complain!
        for (let i = 0; i < data.length; i++) {
            let $this = cheerio.load(data[i]);

            let firstName = $this('td[data-label="First Name"] a').text();
            let lastName = $this('td[data-label="Last Name"] a').text();

            // Load the sub-page to get the email
            options.url = $this('td[data-label="First Name"] a').attr('href');
            request(options, (error, response, body) => {
                if (error) {
                    console.error(error);
                    return;
                }

                let $ = cheerio.load(body);
                let email = $('div.userCard a.email').attr('href').replace(/mailto:/, ''); // Strip off the mailto: from the email

                writeToCSV(firstName, lastName, email);
            });
        }
    });
}

/**
 * Appends the name and email to a csv file
 * @param firstName
 * @param lastName
 * @param email
 */
function writeToCSV(firstName, lastName, email) {
    let outputString = `${lastName}, ${firstName}, ${email}\n`;
    // console.log(outputString);

    fs.appendFile(outputFileName, outputString, err => {
        if (err) {
            throw err;
        }
    });
}
