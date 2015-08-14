var async = require('async');
var gamesdb = require('tgdb-api');
var _ = require('underscore');
var mkdirp = require('mkdirp');
var config = require(process.env.HOME + '/.nodecade/config');

mkdirp(process.env.HOME + '/.nodecade/cache');

var exitOnErr = function(err, task) {
  if (err) {
    console.log('Exiting due to error:');
    console.log(task);
    console.log(err)
    process.exit(1);
  }
};

gamesdb.GetPlatformsList({}, function(err, res) {
  exitOnErr(err, 'Error when fetching platform list');

  var platformList = {};

  // fetch tgdb platform ID for each configured emulator
  _.each(config.emulators, function(emulator) {
    var tgdb = _.find(res.Platforms.Platform, function(platform) {
      return platform.alias === emulator.tgdbAlias;
    });

    if (!tgdb) {
      console.log('WARN: Emulator ' + emulator.shortName + ' not found in tgdb. Skipping.');
    } else {
      platformList[emulator.shortName] = tgdb.id;
    }
  });

  async.eachSeries(_.keys(platformList), function(platform, cb) {
    console.log('Fetching fanart for ' + platform);
    var id = platformList[platform];
    gamesdb.GetPlatform({id:id}, function(err, res) {
      exitOnErr(err, 'Error while getting platform info');

      if (_.isArray(res.Platform.Images.fanart)) {
        _.each(res.Platform.Images.fanart, function(fanart) {
          console.log(res.baseImgUrl + fanart.original._);
        });
      } else {
        console.log(res.baseImgUrl + res.Platform.Images.fanart.original._);
      }
      cb();
    });
  });
});
