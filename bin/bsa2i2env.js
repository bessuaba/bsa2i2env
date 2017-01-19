#! /usr/bin/env node

var yargs = require('yargs');
var program = require('../program');

var options = yargs
    //.usage("Usage: hs-miner  [options] ")
    .option("env", {
        alias: 'e',
        description: 'Environment which you want to use.'
    })
    // .default('o', './output/')
    // .default('s', './source/')
    .help()
    .demandOption(['env'])
    .argv;
    
program(options);
