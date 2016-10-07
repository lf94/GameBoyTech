const Express = require('express');
e = Express();
const AngularTemplate = require('angular-template');

const options = {
    prefix: 'ng',
    includeDirs: ['./templates']
};

$compileProvider = function(options) {
    return a => b => AngularTemplate(a, b, options);
};

$compile = $compileProvider(options);

// Should be in a db
const index = [
    {
        name: 'Communities',
        links: [
            { link: 'https://reddit.com/r/gameboy', text: '/r/gameboy Subreddit' },
            { link: 'http://gbdev.gg8.se/forums/', text: 'gbdev.gg8.se Forums' }
        ]
    },
    {
        name: 'Communication',
        links: [
            { link: 'https://kiwiirc.com/client/irc.efnet.net/#gbdev', text: '#gbdev irc.efnet.net IRC' }
        ]
    },
    {
        name: 'Resources',
        links: [
            { link: 'http://gbdev.gg8.se/wiki/', text: 'gbdev Wiki' },
            { link: '/archive', text: 'gameboy.tech Archive' }
        ]
    },
    {
        name: 'Tools',
        links: [
            { link: 'http://bgb.bircd.org/', text: 'BGB Emulator' },
            { link: '/tools/bivertless', text: 'Invert DMG ROM' }
        ]
    },
    {
        name: 'Vendors',
        links: [
        ]
    },
    {
        name: 'Media',
        links: [
        ]
    },
    {
        name: 'Classifieds',
        links: [
        ]
    }
];

let depth = index.reduce((a, e) =>  Math.max(e.links.length, a), 0);

let headings = index.map(section => section.name);
let rows = (new Array(depth)).fill(0).map((e, r) => index.map((section, i) => section.links[r]));
let table = { headings, rows };

$rootScope = {
    table
};

const pages = {
    '/': {
        template: 'landing.html',
        controller: function ($scope){
            return $scope;
        }
    },
    '/home': {
        template: 'master.html',
        controller: function ($scope){

            $scope.title = ' | Home';
            $scope.content = $compile('home.html')({});

            return $scope;
        }
    },
    '/tools/bivertless': {
        template: 'master.html',
        controller: function ($scope, $path) {

            $scope.title = ' | Tools';
            $scope.content = $compile($path + '/index.html')({});

            return $scope;
        }
    }
};

for(let key in pages) {
    e.get(key, (req, res) => {
        const html = $compile(pages[key].template)(pages[key].controller($rootScope, key));
        res.send(html);
    });
}

e.use(Express.static('public'));
e.listen(3000);
