var app = angular.module('counter', []);

app.controller('controller', function($http) {
    var self = this;

    self.data = {
        "viewers": 0
    }

    self.calculate = function() {
        $http({
            method: 'GET',
            url: 'https://api.twitch.tv/kraken/streams/ealyn'
        }).then (function success(response) {
            self.data.game = response.data.stream.game;
            self.data.viewers = response.data.stream.viewers;
            self.data.preview = response.data.stream.preview.large;
            self.data.logo = response.data.stream.channel.logo;
            console.log(self.data);
        })
    }
});
