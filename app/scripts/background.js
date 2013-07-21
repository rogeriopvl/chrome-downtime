'use strict';

var DowntimeClock = function() {

    // setTimeout handler
    var timeoutID;

    /**
     * Starts the clock timer with given duration
     *
     * @param {Integer} duration the duration of the clock timer
     * @param {Function} cb callback to be fired when the timer stops
     */
    var start = function(duration, cb) {
        console.log(duration);
        if (typeof duration != 'number') {
            throw new Exception('Duration must be a number');
        }
        timeoutID = setTimeout(function() {
            stop(cb);
        }, duration);
    };

    /**
     * Stops the clock
     */
    var stop = function(cb) {
        console.log('calling stop');
        if (typeof timeoutID == 'number') {
            console.log('stop has id');
            clearTimeout(timeoutID);
            timeoutID = null;
            if (cb) { cb(); }
        }
    };

    /**
     * Check if clock is running
     *
     * @return {Boolean} true if running, false otherwise
     */
    var isRunning = function() {
        console.log(timeoutID);
        return !!timeoutID;
    };

    return {
        start: start,
        stop: stop,
        isRunning: isRunning
    };
};

var clock = new DowntimeClock();

chrome.extension.onConnect.addListener(function(port) {
    var notifyPopup = function() {
        console.log('notifiing stop');
        port.postMessage({action: 'stopped'});
    };
    console.log('CONNECTED');
    port.onMessage.addListener(function(msg) {
        console.log('GOT MESSAGE');
        switch(msg.action) {
            case 'start':
                clock.start(msg.duration, notifyPopup);
            break;
            case 'stop':
                clock.stop();
            break;
            default:
                console.log('Ignored action: ' + request.action);
            }
    });
});
