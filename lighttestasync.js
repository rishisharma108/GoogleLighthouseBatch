const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

const DEVTOOLS_RTT_ADJUSTMENT_FACTOR = 3.75;
const DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR = 0.9;

const throttling = {
  DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
  DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
  mobile3G: {
    rttMs: 150,
    throughputKbps: 1.6 * 1024,
    requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
    downloadThroughputKbps: 1.6 * 1024 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
    uploadThroughputKbps: 750 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
    cpuSlowdownMultiplier: 4,
  },
  mobile4G: {
    rttMs: 150,
    throughputKbps: 1.6 * 1024,
    requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
    downloadThroughputKbps: 1.6 * 1024 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
    uploadThroughputKbps: 750 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
    cpuSlowdownMultiplier: 4,
  },
};




/*const lighthouseflagsMobile3G = {
  maxWaitForLoad: 45 * 1000,
  throttlingMethod: 'simluate',
  throttling: throttling.mobile3G,
  auditMode: false,
  gatherMode: false,
  disableStorageReset: false,
  disableDeviceEmulation: false,
  emulatedFormFactor: "mobile",

  // the following settings have no defaults but we still want ensure that `key in settings`
  blockedUrlPatterns: null,
  additionalTraceCategories: null,
  extraHeaders: null,
  onlyAudits: null,
  onlyCategories: null,
  skipAudits: null
}

const lighthouseflagsDesktop = {
  maxWaitForLoad: 45 * 1000,
  throttlingMethod: 'provided',
  auditMode: false,
  gatherMode: false,
  disableStorageReset: false,
  disableDeviceEmulation: false,
  emulatedFormFactor: "desktop",

  // the following settings have no defaults but we still want ensure that `key in settings`
  blockedUrlPatterns: null,
  additionalTraceCategories: null,
  extraHeaders: null,
  onlyAudits: null,
  onlyCategories: null,
  skipAudits: null
}*/

const lighthouseflagsMobile3G = {
maxWaitForFcp: 30000,
    maxWaitForLoad: 45000,
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.5600000000002,
      uploadThroughputKbps: 675,
      cpuSlowdownMultiplier: 4
    },
    auditMode: false,
    gatherMode: false,
    disableStorageReset: false,
    emulatedFormFactor: 'mobile',
    internalDisableDeviceScreenEmulation: true,
    channel: 'devtools',
    budgets: null,
    locale: 'en-US',
    blockedUrlPatterns: null,
    additionalTraceCategories: null,
    extraHeaders: null,
    precomputedLanternData: null,
    onlyAudits: null,
    onlyCategories: [
      'performance',
      'best-practices',
      'accessibility',
      'seo'
    ],
    skipAudits: null
  }


const lighthouseflagsDesktop = {
    maxWaitForFcp: 30000,
    maxWaitForLoad: 45000,
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.5600000000002,
      uploadThroughputKbps: 675,
      cpuSlowdownMultiplier: 4
    },
    auditMode: false,
    gatherMode: false,
    disableStorageReset: false,
    emulatedFormFactor: 'desktop',
    internalDisableDeviceScreenEmulation: true,
    channel: 'devtools',
    budgets: null,
    locale: 'en-US',
    blockedUrlPatterns: null,
    additionalTraceCategories: null,
    extraHeaders: null,
    precomputedLanternData: null,
    onlyAudits: null,
    onlyCategories: [
      'performance',
      'best-practices',
      'accessibility',
      'seo'
    ],
    'skipAudits': null
  }

var opts = {
  output: 'json',

  chromeFlags: ["--headless"],
  //lighhouse flags 
  lighthouseFlags: lighthouseflagsDesktop  
};

function launchChromeAndRunLighthouse(url, deviceTypes, opts, config = null) {
    return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
      console.log("device type :"+deviceTypes);
     if(deviceTypes === "desktop")
      {
          opts.lighthouseFlags = lighthouseflagsDesktop;
      }
      else  
      {
          opts.lighthouseFlags = lighthouseflagsMobile3G;
      }
      opts.lighthouseFlags.port = chrome.port;
      return lighthouse(url, opts.lighthouseFlags, config).then(res => {
        console.log("generating report for " + url);
        return chrome.kill().then(() => res);
      });
      
    });
  }
 
function asyncFunction() { 
  return (options) => {
    console.log("address:" +options.address);
    console.log("device type1:" +options.deviceType);
       return launchChromeAndRunLighthouse(options.address,options.deviceType, opts).then(results => {
            var test =results;
           return results;
        }).catch(err => console.log(err));
      }
  }

// Simulate a async promise delay
function delay(t, v) {
    return new Promise((resolve) => {
      setTimeout(resolve.bind(null, v), t)
    })
}
  
  module.exports = asyncFunction


