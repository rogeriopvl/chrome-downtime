'use strict';

document.addEventListener('DOMContentLoaded', function() {
    var downtime = Downtime();
    var button = document.getElementById('start_button');
    button.addEventListener('click', downtime.start);
});

var Downtime = function() {
    var timer;

    var start = function(duration) {
        setProxy();
    };

    var stop = function() {
        unsetProxy();
    };

    var setProxy = function() {
        var config = {
            mode: 'fixed_servers',
            rules: {
                proxyForHttp: {
                    scheme: 'socks5',
                    host: '1.2.3.4'
                },
                // bypassList: ['foobar.com']
            }
        };
        chrome.proxy.settings.set({
            value: config,
            scope: 'regular'
        }, function() {
            console.log('Proxy set.');
        });
    };

    var unsetProxy = function() {
        chrome.proxy.settings.set({
            value: { mode: 'direct' },
            scope: 'regular'
        }, function() {
            console.log('Proxy resetted.');
        });
    };

    return {
        start: start,
        stop: stop
    }

};
