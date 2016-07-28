var app = angular.module('counter', []);

app.controller('controller', function() {
    var self = this;

    self.data = {
        "viewers": 0
    }

    slef.calculate = function() {
        self.data.viewers += 1;
        console.log(self.data.viewers);
    }
});
