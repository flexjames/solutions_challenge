# Impression Pixel Validator

### Installation

This script equires [Node.js](https://nodejs.org/) v4+ and [NPM](https://www.npmjs.com/) to run!

Install the dependencies:
```sh
$ cd solutions_challenge
$ npm install 
```

Place CSV file in the root directory then run the following command:
```sh
$ npm start <file name plus extension>
```

The script will go through the CSV file to to make sure it chooses impression pixel urls that are active and not deleted.
When the script is done, it will print out the successful and unsuccessful number of requests.  All unsuccessful requests
are printed out in an error log(error_log.csv) file at the end.  