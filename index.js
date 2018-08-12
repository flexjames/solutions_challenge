const helper = require('./methods.js');
const csv = require('fast-csv');

//Following variables get the path of the current directory and the csv filename
let dirPath = __dirname;
let fileName = "\/" + process.argv[2]

let resFail = 0;
let resSuccess = 0;
let urls = [];
let urlMap = {};
let records = [];

//Creates a stream to read in a CSV file
let csvStream = csv.fromPath(dirPath + fileName, {headers: true, objectMode: true})
    .on('data', row => {
        console.time('Pixel Request Validation Executed In')

        csvStream.pause();

        //Clean the data for analysis: makes sure the pixel is active, not deleted and does not have a null value
        if(row.active == '1' && row.deleted == '0' && row.impression_pixel_json !== 'NULL' && row.impression_pixel_json !== '[]'){
            let converted = helper.cleanUrl(row.impression_pixel_json);
            if(typeof converted == 'object' && converted.length > 0){
                converted.forEach(url => {
                    //Push url to array which will GET request url
                    urls.push(url);
                    //Creates a map for looking up errors 
                    urlMap[url] = row.tactic_id;
                })
            }
        }

        csvStream.resume();
    })
    .on('end', () => {
        console.log("Done getting urls, attemping GET requests, please hold.");

        //GET requests are made for each URL
        const promises = urls.map(url => helper.getStatus(url));

        Promise.all(promises).then(data => {

            data.forEach(result => {
                if(typeof result[1] === 'object'){
                    records.push([urlMap[result[0]], result[0]]);
                    resFail++;
                }else if (result[1] >= 200 && result[1] < 399){
                    resSuccess++;
                }else if (result[1] >= 400 && result[1] <600){
                    records.push([urlMap[result[0]], result[0]]);
                    resFail++;
                }
            })

            //Sends the error records array to be output into a CSV file
            helper.logError(records);

            console.log('Sucessful Request totals ', resSuccess, ' numbers of times!');
            console.log('Unsuccessful Request totals ', resFail, ' numbers of times. =(');

            console.timeEnd('Pixel Request Validation Executed In')
        })
    })

 