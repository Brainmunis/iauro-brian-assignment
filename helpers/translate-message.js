const Polyglot = require('node-polyglot');
const messages = require('../controllers/messages')();

module.exports = function translateMessage(t_messages, ...options){
    let requestLocale = "en-US";
    let localeInitial = requestLocale && requestLocale.length ? requestLocale.split('-')[0] : "en";
        let polyglot = new Polyglot({locale : localeInitial});
        
    if(messages[requestLocale]){
        polyglot.extend(messages[requestLocale]);
    }else{
        polyglot.extend(messages['en-US']);
    }
    try{
        let t_msg =  polyglot.t(t_messages, ...options);
        return JSON.parse(t_msg);
    }catch(e){
        return polyglot.t(t_messages, ...options)
    }
}
