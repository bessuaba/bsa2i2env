'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require("string-builder");

var config = {
    env: 'dev',
    folder: './src/environments/',
    output: 'environment.ts'
};

var files = {
    source: null,
    output: null
};

function parseOptions(options) {

    if (options instanceof Object && options.hasOwnProperty('env')) {
        config.env = options.env;
    }

};

function createPath(file) {

    return path.join(config.folder, file);

};

function checkFileExists(path) {

    return fs.existsSync(path);

};

function parseFiles() {

    var sourceFileName = 'environment.' + config.env + '.ts';

    var sourceFilePath = createPath(sourceFileName);

    if (!checkFileExists(sourceFilePath)) {
        let message = new StringBuilder();
        message.appendFormat("Can not find file {0} by given path {1}", sourceFileName, sourceFilePath);
        throw new Error(message.toString());
    }

    files.source = sourceFilePath;

    var outputFilePath = createPath(config.output);

    if (!checkFileExists(outputFilePath)) {
        fs.closeSync(fs.openSync(outputFilePath, 'w'));
        console.log('Create a new output file.');
    }

    files.output = outputFilePath;    

};

function copy (callback) {

    var cbCalled = false;

    var rd = fs.createReadStream(files.source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(files.output);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            callback(err);
            cbCalled = true;
        }
    }
};

function program (options) {

    try {

        parseOptions(options);

        parseFiles();

        copy(function (error) {
            if (error) throw error;
            process.exit(1);
        });        

    } catch (e) {

        console.log(e);

        process.exit(0);

    }
        
}

module.exports = program;