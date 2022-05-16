
const fs = require('fs');

function combileLanguageStructure(){
    let supportedLanguages = ["en-US"];
    let mainObj = {};
    for(let i=0; i<supportedLanguages.length; i++){
        let currentLocalePath = `${__dirname}/${supportedLanguages[i]}`;
        mainObj[supportedLanguages[i]] =  mergedLanguageFiles(currentLocalePath)
    }
    return mainObj
}
function mergedLanguageFiles(filePath){
    const _ = require('lodash');
    var mainFile = {};
    let files = fs.readdirSync(filePath)
        for (var i in files) {
            if (files[i] == 'index.js')
                continue;
            if (files[i].split('.')[1] !== 'json')
                continue;
            try{
                var t = require(`${filePath}/` + files[i]);
                mainFile =  _.merge(mainFile, t);
            }catch(e){
                console.log(e)
            }
            
        }
        for(let key in mainFile){
            mainFile[key] = JSON.stringify(mainFile[key])
        }
    return mainFile
}

module.exports = combileLanguageStructure;
