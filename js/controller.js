var app = angular.module('counter', []);

app.controller('controller', function($http) {
    var self = this;

    self.data = {
        "viewers": 0
    }

    self.calculate = function() {
        self.data.viewers += 1;
        $http({
            method: 'GET',
            url: 'https://api.twitch.tv/kraken/streams/ealyn'
        }).then (function success(response) {
            console.log("Succ, wait for it...");
            console.log(response.data.stream.viewers);
            console.log("ess");
        })
        console.log(self.data.viewers);
    }
});
