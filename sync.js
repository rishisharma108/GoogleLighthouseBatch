const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const forceSync = require('sync-rpc')
const syncFunction = forceSync(require.resolve('./lighttestasync'))


const fs = require("fs");
const configJson = JSON.parse(fs.readFileSync("config.json"));
const uuid = parseInt(new Date().getTime(), 10);
const date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
const ddate = new Date();
const time = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();


var url = "mongodb://localhost:27017/lighthouse";

var MongoClient = require('mongodb').MongoClient
var lightHouseArr = [];
var lightHouseEnvArr = [];
var count = 0;


console.log('start')

configJson.env.forEach((envAddress,index )=> {
count ++;

    configJson.url.forEach(address => {
          configJson.devices.forEach(deviceTypeTemp =>{

              
              var pageType=address.split("@")[1];
              var compURL= envAddress +address ;

              var options = {        
                address: compURL,
                deviceType: deviceTypeTemp
              };

            
              var region=address.split("/")[1];
              console.log("Region--------"+region);
 
              var syncReturn = syncFunction(options);

              //to get html
              const html = ReportGenerator.generateReport(syncReturn.lhr, 'html')

               
              var fileName = compURL.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '_');

              var relFilePath=fileName+"_"+deviceTypeTemp+"_"+uuid+".html";

              var filDir=configJson.fileDir +relFilePath;
              
              console.log("filDir---"+filDir);

              fs.writeFile(filDir, html, (err) => {

               if (err) {
              console.error(err);
                }
             else{
                 console.log("HTML generated...")
                }
               });

              var test = syncReturn;
              var jsonParsed = JSON.parse(test.report);
//console.log(jsonParsed);
             
              var pData = {
                  url: compURL,
                  env:envAddress,
                  pageurl: address,
                  uuid:uuid,
                  date:date,
                  ddate:ddate,
                  time:time,
                  region:region,
                  device:options.deviceType,
                  htmlReportPath:relFilePath,
                  runType:configJson.runType,
                  pageType:pageType,
                  performance: {
                    "first-contentful-paint": jsonParsed['audits']['first-contentful-paint'].displayValue,
                    "first-meaningful-paint": jsonParsed['audits']['first-meaningful-paint'].displayValue,
                    "speed-index": jsonParsed['audits']['speed-index'].displayValue,
                    "first-cpu-idle": jsonParsed['audits']['first-cpu-idle'].displayValue,
                    "interactive": jsonParsed['audits']['interactive'].displayValue,
                    "max-potential-fid": jsonParsed['audits']['max-potential-fid'].displayValue
                  },
                  categories: {
                    "performance": jsonParsed['categories']['performance'].score,
                    // "pwa": jsonParsed['categories']['pwa'].score,
                    "accessibility": jsonParsed['categories']['accessibility'].score,
                    "best-practices": jsonParsed['categories']['best-practices'].score,
                    "seo": jsonParsed['categories']['seo'].score,
                  },
                 summary:test.report          
                };
                lightHouseArr.push(pData); 
              // insertInDb(pData)
           })
    })

    if(count == configJson.env.length) {
        console.log("inside if")
        insertInDb(lightHouseArr);
        count = 0;
      }
})


function insertInDb(data){
   
    // MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    //   var dbo = client.db("light");
    //   data.forEach(function(value){      
    //     dbo.collection("readurljson").insertMany(value, function (err, res) {
    //       if (err) throw err;
    //       console.log("Number of documents inserted: " + res.insertedCount);
         
    //   });
    //   client.close();
    //   });
      
    // });

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
      var dbo = client.db("light");
      dbo.collection("readurljson").insertMany(data, function (err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        client.close();
        
      });
    });

   
  }

