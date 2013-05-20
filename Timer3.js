/**
Backbone.js based timer
*/

function Timer ( time ) {
    _.extend(this, Backbone.Events)

    var _this = this, _interval, _prevtime;

    this.currentTime = time || 0;
    this.paused = true;

    var _update = function () {
        var now = Date.now();
        _this.currentTime += now - _prevtime;
        _prevtime = now;
        _this.trigger('ticking', _this.currentTime);
    };

    this.play = function () {
        if ( _this.paused ) {
            _prevtime = Date.now();
            _interval = setInterval( _update, 0 );
            _this.paused = false;
            _this.trigger('playing');
        }
    };

    this.pause = function () {
        _this.paused = true;
        clearInterval( _interval );
        _this.trigger('pausing');

    };
    
    this.setTime = function (time) {
        _this.pause();
        _this.currentTime = time;
        _this.trigger('setting', time);
  };
}