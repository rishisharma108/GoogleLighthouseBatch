const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
var fs = require('fs');
var util = require('util');
const { relative } = require('path');
var log_file = fs.createWriteStream(__dirname+'/debug.log',{flags:'w'});
var log_stdout = process.stdout;


console.log = function(d) {
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

const DEVTOOLS_RTT_ADJUSTMENT_FACTOR = 3.75;
const DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR = 0.9;

const throttling = {
    DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
    DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
    mobile3G: {
        rttMs:150,
        throughputKbps: 1.6*1024,
        requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
        downloadThroughputKbps: 1.6 * 1024 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
        uploadThroughputKbps: 750 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
        cpuSlowdownMultiplier: 4,
    },
    mobile4G: {
        rttMs:150,
        throughputKbps: 1.6 * 1024,
        requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
        downloadThroughputKbps: 1.6 * 1024 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
        uploadThroughputKbps: 750 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
        cpuSlowdownMultiplier: 4,
    },

};

const lighthouseflagsMobile3G = { 
    maxWaitForFcp: 30000,
     maxWaitForLoad:45000,
     throttlingMethod: 'simulate',
     throttling:{
         rttMs:150,
         throughputKbps: 1638.4,
         requestLatencyMs:562.5,
         downloadThroughputKbps: 1474.5600000000002,
         uploadThroughputKbps:675,
         cpuSlowdownMultiplier:4
     },
     auditMode:false,
     gatherMode:false,
     disableStorageReset:false,
     emulatedFormFactor:'mobile',
     internalDisableDeviceScreenEmulation: true,
     channel: 'devtools',
     budgets:null,
     locale:'en-us',
     blockedUrlPatterns:null,
     additionalTraceCategories: null,
     extraHeaders:null,
     precomputedLanternData:null,
     onluAudits: null,
     onlyCategories:[
         'performance',
         'best-practices',
         'accessibility',
         'seo'
     ],
     skipAudits: null
}

const lighthouseflagsDesktop = { 
    maxWaitForFcp: 30000,
     maxWaitForLoad:45000,
     throttlingMethod: 'simulate',
     throttling:{
         rttMs:150,
         throughputKbps: 1638.4,
         requestLatencyMs:562.5,
         downloadThroughputKbps: 1474.5600000000002,
         uploadThroughputKbps:675,
         cpuSlowdownMultiplier:4
     },
     auditMode:false,
     gatherMode:false,
     disableStorageReset:false,
     emulatedFormFactor:'desktop',
     internalDisableDeviceScreenEmulation: true,
     channel: 'devtools',
     budgets:null,
     locale:'en-us',
     blockedUrlPatterns:null,
     additionalTraceCategories: null,
     extraHeaders:null,
     precomputedLanternData:null,
     onluAudits: null,
     onlyCategories:[
         'performance',
         'best-practices',
         'accessibility',
         'seo'
     ],
     skipAudits: null
}

var opts = {
    output: 'json',
    chromeFlags: ["--headless"],
    lighthouseflags: lighthouseflagsDesktop
};

confJson.url.forEach(address =>
{
    console.log("Analyzing the address...." + address);
    if(1==1)
    {
        opts.lighthouseFlags=lighthouseflagsMobile3G;
    }

    launchChromeAndRunLighthouse(address, opts).then(results =>{
        var test = results;
        console.log("Report generated for" + address);
    }).catch(err =>console.log(err));

});