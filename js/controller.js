var app = angular.module('counter', []);

app.controller('controller', function($http, $interval) {
    var self = this;
    var TIMEOUT = 60000;

    self.channelName = 'Ealyn';
    self.lastCheckedName = 'Ealyn';

    self.initDefaults = function () {
        self.calculating = false;
        self.timer = null;
        self.history = {
            'minymax': {
                'max': 0,
                'maxTime': parseDate(new Date()),
                'min': 100000000,
                'minTime': parseDate(new Date()),
                'mean': 0,
                'totalTime': 0,
                'count': 0,
                'firstDate': new Date()
            }
        };
        self.data = {
            "viewers": 0,
            "channelStatus": "Hello World!",
            "game": "I don't play.",
            "date": new Date(),
            "images":{
                "preview": "http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_WhiteonPurple.png",
                "logo": "http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_WhiteonPurple.png"
            }
        }
        self.parsedDate = parseDate(self.data.date);
    }
    self.initDefaults();

    self.toggleCalculate = function () {
        self.calculating = !self.calculating;

        if (self.calculating) {
            startCalculate();
        } else {
            stopCalculate();
        }
    }

    function startCalculate () {
        if (self.channelName !== self.lastCheckedName) {
            self.initDefaults();
            self.lastCheckedName = self.channelName;
        }
        self.calculating = true;
        self.calculate();
        self.timer = $interval (function() {
                self.calculate();
            }, TIMEOUT);
    }

    function stopCalculate () {
        self.calculating = false;
        $interval.cancel(self.timer);
        askDownload();
    }

    function askDownload () {
        var confirmMessage = "¿Desea descargar el histórico de viewers?"
        if (confirm(confirmMessage)) {
            downloadHistory();
        }
    }

    function paintData () {
        var viewers = document.getElementById('viewers').getContext('2d');
        new Chart(viewers, {
            type: "line",
            data: parseChartData(),
        });
    }

    function parseChartData () {
        var labels = [];
        var values = [];

        Object.keys(self.history).forEach (function(key) {
            if (key != 'minymax') {
                labels.push(parseDate(new Date(+key)));
                values.push(self.history[key]);
            }
        });

        var data = {
            labels : labels,
            datasets : [
        		{
                    label : "# de Viewers",
        			fillColor : "rgba(172,194,132,0.4)",
        			strokeColor : "#ACC26D",
        			pointColor : "#fff",
        			pointStrokeColor : "#9DB86D",
        			data : values,
                    lineTension: 0
        		}
        	]
        };

        return data;
    }

    function downloadHistory () {
        var content = JSON.stringify(self.history);
        var uriContent = "data:application/octet-stream;filename=history.json," + encodeURIComponent(content);
        var filename = 'history.json';
        saveAs(uriContent, filename);
    }

    function saveAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); // Firefox requires the link to be in the body
            link.download = filename;
            link.href = uri;
            link.click();
            document.body.removeChild(link); // remove the link when done
        } else {
            location.replace(uri);
        }
    }

    self.calculate = function() {
        var apiUrl = 'https://api.twitch.tv/kraken/streams/' + self.channelName;
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

            if (self.history.minymax.count === 0) {
                self.history.minymax.startDate = new Date();
            } else {
                var date = new Date();
                self.history.minymax.totalTime = date.getTime() - self.history.minymax.startDate.getTime();
            }

            var total = self.history.minymax.mean * self.history.minymax.count;
            self.history.minymax.count++;
            total += self.data.viewers;
            self.history.minymax.mean = total / self.history.minymax.count;

            if (self.data.viewers > self.history.minymax.max) {
                self.history.minymax.max = self.data.viewers;
                self.history.minymax.maxTime = parseDate(self.data.date);
            }

            if (self.data.viewers < self.history.minymax.min) {
                self.history.minymax.min = self.data.viewers;
                self.history.minymax.minTime = parseDate(self.data.date);
            }

            self.history[self.data.date.getTime()] = self.data.viewers;
            paintData();
        })
    }

    self.getName = function(field) {
        var name = field;
        switch (field) {
            case 'viewers':
                name = 'Viewers';
                break;
            case 'channelStatus':
                name = 'Estado del Canal';
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
