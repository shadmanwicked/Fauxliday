var Twit = require('twit');
var ent = require('ent');
var Client = require('node-rest-client').Client;
var wordfilter = require('wordfilter');
var wordnikKey = require('./permissions.js').key;

restClient = new Client();

// Our twitter developer API info is in a file called 'config.js'
var T = new Twit(require('./config.js'));

//get the date
var date = new Date();
var day = date.getDate();
var month = date.getMonth()+1;

var holiday = "";
var noun = "";
var verb = "";
var adj = "";

var corpus = "1000";

var getNounURL =    "http://api.wordnik.com:80/v4/words.json/randomWord?" +
    "hasDictionaryDef=false" +
    "&includePartOfSpeech=noun" +
    "&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix" +
    "&minCorpusCount=" +
    corpus +
    "&maxCorpusCount=-1" +
    "&minDictionaryCount=1" +
    "&maxDictionaryCount=-1" +
    "&minLength=5" +
    "&maxLength=-1" +
    wordnikKey;

var getAdjURL = "http://api.wordnik.com:80/v4/words.json/randomWord?" +
    "hasDictionaryDef=false" +
    "&includePartOfSpeech=adjective" +
    "&excludePartOfSpeech=proper-noun" +
    "&minCorpusCount=" +
    corpus +
    "&maxCorpusCount=-1" +
    "&minDictionaryCount=1" +
    "&maxDictionaryCount=-1" +
    "&minLength=5" +
    "&maxLength=-1" +
    wordnikKey;

var getVerbURL = "http://api.wordnik.com:80/v4/words.json/randomWord?" +
    "hasDictionaryDef=false" +
    "&includePartOfSpeech=verb" +
    "&excludePartOfSpeech=proper-noun" +
    "&minCorpusCount=" +
    corpus +
    "&maxCorpusCount=-1" +
    "&minDictionaryCount=1" +
    "&maxDictionaryCount=-1" +
    "&minLength=5" +
    "&maxLength=-1" +
    wordnikKey;


function makeHoliday() {
    restClient.get(getNounURL, function (data,response) {

        obj = JSON.parse(data);
        noun = obj.word;
        noun = noun[0].toUpperCase() + noun.slice(1);

        console.log("the noun is " + noun);

        restClient.get(getAdjURL, function (data,response) {

            obj = JSON.parse(data);
            adj = obj.word;
            adj = adj[0].toUpperCase() + adj.slice(1);
            console.log("the adjective is " + adj);

            restClient.get(getVerbURL, function (data,response) {

                obj = JSON.parse(data);
                verb = obj.word;
                verb =  verb[0].toUpperCase() + verb.slice(1);
                console.log("the verb is " + verb);

                    holiday = "TODAY is International " + adj + /*" " + verb + */" " + noun + " day!";
                    switch(getRandomInt(0,6)){
                        case 0:
                            holiday = "TODAY is International " + adj + /*" " + verb + */" " + noun + " day!";
                            break;
                        case 1:
                            holiday = "TODAY is National " + adj + /*" " + verb + */" " + noun + " day!";
                            break;
                        case 2:
                            holiday = "TODAY is " + adj + " " + noun + " day!";
                            break;
                        case 3:
                            holiday = "TODAY is International " + adj + " " + verb + " " + noun + " day!";
                            break;
                        case 4:
                            holiday = "TODAY is National " + adj + " " + verb + " " + noun + " day!";
                            break;
                        case 5:
                            holiday = "TODAY is " + adj + " " + verb + " " + noun + " day!";
                            break;
                    }
                    //get the date
                    date = new Date();
                    day = date.getDate();
                    month = date.getMonth()+1;

                    //print the date to the console
                    //console.log(day + ' ' + month);
                    console.log("day " + day + ' of ' + "month " + month);

                	//output to the console what it's going to say and how many characters.
                if (!wordfilter.blacklisted(holiday)) {
                	if(holiday.length <= 140){
                		//print the holiday to the console
                        console.log(holiday);
                		console.log("This tweet has a length of " + holiday.length);

                		//Tweet it!
                		T.post('statuses/update', {status: holiday}, function (err, reply) {});
                	}
                	else{
                		makeHoliday();
                	}
                }
                else{
                    makeHoliday();
                }
            });
        });
    });
}


function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

//// Tweet once when we start up the bot
makeHoliday();

// Tweet every 24 hours
setInterval(function () {
  try{
    makeHoliday();
  }
  catch(e){
    console.log(e);
  }
}, 1000 * 60 * 240 * 6);