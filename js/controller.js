var app = angular.module('counter', []);

app.controller('controller', function($http, $interval) {
    var self = this;
    var TIMEOUT = 5000;

    self.calculating = false;
    self.timer = null;

    self.data = {
        "viewers": 0,
        "channelName": "you",
        "game": "none",
        "images":{
            "preview": "http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_WhiteonPurple.png",
            "logo": "http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_WhiteonPurple.png"
        }
    }

    self.toggleCalculate() {
        self.calculating = !self.calculating;

        if (self.calculating) {
            startCalculate();
        } else {
            stopCalculate();
        }
    }

    function startCalculate () {
        self.calculating = true;
        self.timer = $interval (self.calculate(), TIMEOUT);
    }

    function stopCalculate () {
        self.calculating = false;
        $interval.cancel(self.timer);
    }

    self.calculate = function() {
        var apiUrl = 'https://api.twitch.tv/kraken/streams/' + self.channelName;
        $http({
            method: 'GET',
            url: apiUrl
        }).then (function success(response) {
            self.loading = false;
            self.data.channelName = self.channelName;
            self.data.game = response.data.stream.game;
            self.data.viewers = response.data.stream.viewers;
            self.data.images.preview = response.data.stream.preview.large;
            self.data.images.logo = response.data.stream.channel.logo;
        })
    }
});
