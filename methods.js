const request = require('request');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvWriter = createCsvWriter({
    header: ['Tactic_Id','impression_pixel_json' ],
    path: './error_log.csv'
});

function logError(data){
    csvWriter.writeRecords(data);
}

function getRes(url){
    return new Promise((resolve, reject) => {
        request(url, (err, res) => {
            if(err){
                return reject([url, err]);
            } 
            //console.log('getRes is ', res.statusCode)
            resolve([url,res.statusCode]);
        });
    });
}

async function getStatus(url){
    try {
        var res = await getRes(url);
        //console.log('res is ', res);
        return res;
    } catch (err){
        //console.error(err);
        return err;
    };
}

function cleanUrl(str){
    let newStr = '';
    let firstBracket = str.indexOf('[');
    let lastBracket = str.lastIndexOf(']');

    let transform = str.slice(firstBracket+1, lastBracket)
    .replace(/"/g,"").split('').forEach(char => {
        if (char !== "\\"){
            newStr += char;
        }
    })
    return newStr.split(',');
}

module.exports = {
    getStatus: getStatus,
    logError: logError,
    cleanUrl: cleanUrl
}