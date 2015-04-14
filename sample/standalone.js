'use strict';

var memdb = require('../lib');
var Q = require('q');
var should = require('should');

/**
 * Start memdb server manually first
 *
 * node ../app/server.js --conf=../test/memdb.json --shard=s1
 */

var main = function(){
	var autoconn = null;
	return Q.fcall(function(){
		// Connect to server, specify host and port
		return memdb.autoConnect({host : '127.0.0.1', port : 3000});
	})
	.then(function(ret){
		autoconn = ret;

		return autoconn.execute(function(){
			var Player = autoconn.collection('player');
			return Q.fcall(function(){
				return Player.insert(1, {name : 'rain'});
			})
			.then(function(){
				return Player.find(1);
			})
			.then(function(player){
				player.name.should.eql('rain');
				return Player.remove(1);
			});
		});
	})
	.then(function(){
		// Close connection
		return autoconn.close();
	});
};

if (require.main === module) {
	return Q.fcall(function(){
		return main();
	})
	.catch(function(e){
		console.error(e);
	})
	.fin(function(){
		process.exit();
	});
}