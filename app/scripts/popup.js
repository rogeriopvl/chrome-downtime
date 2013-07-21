'use strict';

var ProxyManager = {
    setProxy: function() {
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
    },
    unsetProxy: function() {
        chrome.proxy.settings.set({
            value: { mode: 'direct' },
            scope: 'regular'
        }, function() {
            console.log('Proxy resetted.');
        });
    }
};

var Downtime = function() {

    var connection = chrome.extension.connect({name: "downtime"});

    var disableNetwork = function(duration) {
        ProxyManager.setProxy();
        startTimer(duration);
    };

    var enableNetwork = function() {
        ProxyManager.unsetProxy();
        stopTimer();
    };

    var startTimer = function(duration) {
        connection.postMessage({
            action: 'start',
            duration: +duration
        });
        connection.onMessage.addListener(function(msg) {
            console.log('notified:' + msg);
            if (msg.action == 'stopped') {
                enableNetwork();
            }
        });
    };

    var stopTimer = function() {
        // send message to background
    };

    var isTimerRunning = function() {
        // send message to background
    };

    return {
        disableNetwork: disableNetwork,
        enableNetwork: enableNetwork
    };
};

document.addEventListener('DOMContentLoaded', function() {

    var downtime = Downtime(),
        button = document.getElementById('toggle_button'),
        duration = document.getElementById('duration').value || 60;

    duration = duration * 1000; // convert to miliseconds

    button.value = 'Start';//timer.isRunning() ? 'Stop' : 'Start';

    button.addEventListener('click', function() {
        downtime.disableNetwork(duration);
    });
});
