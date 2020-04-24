'use strict';
process.stdout.write('\x1Bc'); 

const Twit = require('twit');
const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');
const welcome = require('./src/welcome');

moment.locale('pt-br');
const getTime = moment().format('LLL');

var T = new Twit(require('./src/config.js'));

const stream = T.stream('statuses/filter', { track: "@vampinto_" });
stream.on('tweet', tweetEvent);

function tweetEvent(tweet) {
  try {
    var name = tweet.user.screen_name;
    var nameID  = tweet.id_str;
    var image = fs.readFileSync(`./src/EUfkVzuX0AAVcUp.png`, {encoding: 'base64'});
    
    T.post('media/upload', { media_data: image }, function (err, data, response) {
      var mediaIdStr = data.media_id_string
      var meta_params = { media_id: mediaIdStr }
    
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        var params = { 
              status: `@${name}`, 
              media_ids: [mediaIdStr], 
              in_reply_to_status_id: nameID
          };
        T.post('statuses/update', params, botTweeted(params.status));       
      });
    });

    function botTweeted(status, err) {
      if (err !== undefined) {
        console.log(chalk.red(`[#Console - ${getTime}] > Error: ${err}`));
      } else {         
        console.log(chalk.green(`[#Console - ${getTime}] > Enviado para ${status}`));
      }
    }
  } catch (f) {
	console.log(chalk.red(`[#Console - ${getTime}] > Erro na streaming API: ${f}`));
  }
}
