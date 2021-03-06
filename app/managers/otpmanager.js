var fs = require('fs');

var fetchDetails = require('./../utils/fetchdetails.js');
var logger = require(__dirname + '/../logger/jsLogger.js');
var otpAuth = require('./otpAuth.json');
var twilio = require('twilio');



module.exports = {
	sendmessage : function(messageJson, callback) { 
		try{
			var client = require('twilio')(otpAuth.TWILIO_ACCOUNT_SID, otpAuth.TWILIO_AUTH_TOKEN);
		} catch(error) {
			logger.error("Could not create Twilio messaging REST client due to : " + error);
			callback("error");
		}
		if(Object.keys(messageJson).length > 0) {

			try{
				client.messages.create({
					body:messageJson["text_message"],
					from:otpAuth['TWILIO_NUMBER'],
				    to:messageJson["contact"]
			}, function(error, message) {
				    if (!error) {
				        var dataToSave = {};
				        fetchDetails.getRecord(messageJson["contact"], function(record) {
				        	dataToSave["Name"] = record["Name"] + " " + record["Surname"];
				        });
				        dataToSave["Time"] = message.dateCreated;
				        dataToSave["Body"] = messageJson["text_message"].match(/is:([^&]+)./)[1].trim();
				        logger.info('Success! The SID for this SMS message is: ' + message.sid);
				        logger.info('Message sent on: ' + message.dateCreated);
				      
				        appendObject(dataToSave);
				        callback(message);
				    } else {
				        logger.error('Oops! There was an error. ' + JSON.stringify(error));
				        callback("error");
				    }
				});
			} catch(exception) {
				logger.error("Exception occurred - " + exception);
				callback(error);
			}
		} else {
			logger.warn("Received invalid contact information to proceed.");
			callback("error");
		} 
 
		function appendObject(message) {
			try{
				var messageStatusFile = fs.readFileSync(__dirname + '/../messageStatus/status.json');
				var status = JSON.parse(messageStatusFile);
				status.unshift(message);
				var statusWriteFile = JSON.stringify(status);
				fs.writeFileSync(__dirname + '/../messageStatus/status.json', statusWriteFile); 
			} catch(ioerror) {
				logger.error("Error in writing record " + message + " to file.");				
			}
		}
	}
}
