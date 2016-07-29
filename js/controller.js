var app = angular.module('counter', []);

app.controller('controller', function($http, $interval) {
    var self = this;
    var TIMEOUT = 5000;

    self.calculating = false;
    self.timer = null;
    self.history = {};
    self.channelStatus = 'Ealyn';
    
    self.data = {
        "viewers": 0,
        "channelStatus": "you",
        "game": "none",
        "date": new Date(),
        "images":{
            "preview": "http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_WhiteonPurple.png",
            "logo": "http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_WhiteonPurple.png"
        }
    }
    self.parsedDate = parseDate(self.data.date);

    self.toggleCalculate = function () {
        self.calculating = !self.calculating;

        if (self.calculating) {
            startCalculate();
        } else {
            stopCalculate();
        }
    }

    function startCalculate () {
        self.calculating = true;
        self.timer = $interval (function() {
                self.calculate()
            }, TIMEOUT);
    }

    function stopCalculate () {
        self.calculating = false;
        $interval.cancel(self.timer);
    }

    self.calculate = function() {
        var apiUrl = 'https://api.twitch.tv/kraken/streams/' + self.channelStatus;
        $http({
            method: 'GET',
            url: apiUrl
        }).then (function success(response) {
            self.loading = false;
            self.data.date = new Date();
            self.parsedDate = parseDate(self.data.date);
            self.data.channelStatus = response.data.stream.channel.status;
            self.data.game = response.data.stream.game;
            self.data.viewers = response.data.stream.viewers;
            self.data.images.preview = response.data.stream.preview.large;
            self.data.images.logo = response.data.stream.channel.logo;

            self.history[self.data.date.getTime()] = self.data.viewers;
        })
    }

    self.getName(field) {
        var name = field;
        switch (field) {
            case 'viewers':
                name = 'Viewers';
                break;
            case 'channelStatus':
                name = 'Nombre del Canal';
                break;
            case 'game':
                name = 'Jugando';
                break;
            case 'date':
                name = 'Fecha de la última actualización';
                break;
        }
        return name;
    }

    function parseDate (date) {
        return twoNumbers(date.getDate()) + "/" + parseMonth(date.getMonth()) + "/" + date.getFullYear() + " - " + twoNumbers(date.getHours()) + ":" + twoNumbers(date.getMinutes()) + ":" + twoNumbers(date.getSeconds());
    }

    function twoNumbers (num) {
        if (num < 10) {
            num = '0' + num;
        }
        return num;
    }

    function parseMonth (month) {
        month = month + 1;
        return twoNumbers(month);
    }
});
