var fs = require('fs');
var spawn = require('child_process').spawn;
var cadeUtil = require('./util');
var scrapeDb = require('./tgdb');
var request = require('request');

$(document).ready(function() {
  var owl = $('#owl-example');
  owl.owlCarousel({
    singleItem: true,
    pagination: false
  });

  $(document).keydown(function(e) {
    switch(e.which) {
      case 37: // left
        owl.trigger('owl.prev');
        break;

      case 38: // up
        break;

      case 39: // right
        owl.trigger('owl.next');
        break;

      case 40: // down
        break;

      case 119: // F8
        spawn('xterm');
        break;

      default:
        //console.log('unhandled keydown event: ' + e.which);
        return;
    }
    e.preventDefault();
  });
});
