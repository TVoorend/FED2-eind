// POST FABION TIP var e = document.getElementById("ddlViewBy");
// var strUser = e.options[e.selectedIndex].value;
// http://stackoverflow.com/questions/1085801/how-to-get-the-selected-value-of-dropdownlist-using-javascript

// Maak namespace aan zodat je geen conflicten krijgt met andere libraries
var SCOREAPP = SCOREAPP || {};


// Self-invoking anonymous function
(function () {
	// Local scope == function scope == lexical scope
	// Zorgt ervoor dat je script in EMASCRIPT 5 draait
	"use strict";

    var options = {
        lines: 13, // The number of lines to draw
        length: 15, // The length of each line
        width: 10, // The line thickness
        radius: 25, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#2A3A48', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '200px', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };

    var spinner = new Spinner(options);
    var target = document.getElementById('spinner');

    spinner.startSpinning = function () {
        spinner.spin(target);
    },

	// SETTINGS
	SCOREAPP.settings = {
	//	scheduleURL:
		gameURL: 'https://api.leaguevine.com/v1/games',
		rankingURL: 'https://api.leaguevine.com/v1/pools/?tournament_id=19389&order_by=%5Bname%5D'

	},

	// Controller Init
	SCOREAPP.controller = {

		// Initialize; Dit is het eerste wat je wilt uitvoeren
		init: function () {
			console.log("1. CONTROLLER");
			// Initialize router
			SCOREAPP.router.init();
			SCOREAPP.touch.init();
		}
	},

	// Router
	// Routie plugin helpt bij het navigeren tussen verschillende "pagina's" op één pagina
	SCOREAPP.router = {

        init: function () {
            console.log("2. ROUTER"),

            routie({

            '/ranking': function(){
                SCOREAPP.page.ranking();

            },

            '/schedule': function(){
                SCOREAPP.page.schedule();

            },

            '/game/:id': function(id){
                SCOREAPP.page.game(id);
            },

            '*': function() {
                //home page of iets dergelijks

            }
        });
    },

		// Zorg ervoor dat de pagina's wisselen.
		// Change de sectie die is aangegeven.
		change: function (page) {
			console.log("router.change ");

			// Var route = Pagina naam
            var route = page;
            // Zoek alle secties
            var sections = qwery('section[data-route]');
            // Data route + sectie naam = de locatie van de pagina
            var section = qwery('[data-route=' + route + ']')[0];


            // Laat actieve sectie zien en verberg te andere
            if (section) {
                for (var i=0; i < sections.length; i++){
                    // Zet de sectie die actief is op non-actief
                    sections[i].classList.remove('active');
                }
                // Maak de sectie waarop geklikt is actief
                section.classList.add('active');
            }

            // Default route ( FALLBACK )
            if (!route) {
                sections[0].classList.add('active');
            }
        },

        currentItem1: function () {

        document.getElementById('item2').removeClass('current');
        document.getElementById('item1').addClass('current');
        console.log("current is schedule");

        },

        currentItem2: function () {


        document.getElementById('item1').removeClass('current');
        document.getElementById('item2').addClass('current');
        console.log("current is ranking");

        }
    };


SCOREAPP.touch = {

	init: function () {
	var swipeleft = Hammer(container).on("swipeleft", function() {
		SCOREAPP.page.ranking();
		history.pushState(null, null, '#ranking');
	});

	var swiperight = Hammer(container).on("swiperight", function() {
		SCOREAPP.page.schedule();
        history.pushState(null, null, '#schedule');
    });
}
};

	// Data objecten

	// Pages
	SCOREAPP.page = {

		//method
		ranking: function () {
			console.log("3. PAGE RENDEREN ranking");
			spinner.startSpinning(); // start spinner
            SCOREAPP.router.currentItem2(); //make ranking current item


			promise.get(SCOREAPP.settings.rankingURL).then(function(error, text, xhr) {
                if (error) {
                     alert('Error ' + xhr.status);
                    return;
                }

                // Omdat je een string krijgt moet je hem Parsen naar Javascript objecten om uit te kunnen lezen

                var result = JSON.parse(text);
                console.log(result);

                // SCOREAPP.poules zijn de objecten uit je parse
                SCOREAPP.ranking = JSON.parse(text);
                Transparency.render(qwery('[data-route=ranking')[0], SCOREAPP.ranking);
                spinner.stop();
                SCOREAPP.router.change("ranking");
			});
		},

		//method
		schedule: function () {
			console.log("3. PAGE RENDEREN  schedule");
			spinner.startSpinning();
            SCOREAPP.router.currentItem1();


			promise.get('https://api.leaguevine.com/v1/games/?tournament_id=19389&access_token=16efeb5be0').then(function(error, text, xhr) {
				// string parsen naar javascript objecten, zodat je hem kan uitlezen
                var result = JSON.parse(text);


                // als op Score wordt gedrukt ga dan naar #/game/game id
                var directivesGame = {
                    objects: {
                        thisID: {
                            href: function(params) {
                                return "#/game/" + this.id;
                            }
                        }
                    }
                };

                var poolName = result.objects[0].name;

                SCOREAPP.schedule = result;
                console.log('SCOREAPP.schedule +' , SCOREAPP.schedule);

                Transparency.render(qwery('[data-route=schedule')[0], SCOREAPP.schedule, directivesGame);
                spinner.stop();
			});
			SCOREAPP.router.change("schedule");

		},

		game: function (id) {
			console.log("3. PAGE RENDEREN game");
            spinner.startSpinning();
            SCOREAPP.router.currentItem1();


			var pakID = window.location.hash.slice(6);
			console.log(pakID);

			promise.get(SCOREAPP.settings.gameURL + pakID + '/').then(function(error, text, xhr) {
								if (error) {
            alert('Error ' + xhr.status);
            return;
            }
            // SCOREAPP.poules zijn de objecten uit je parse
            SCOREAPP.game = JSON.parse(text);

			Transparency.render(qwery('[data-route=game')[0], SCOREAPP.game);
			console.log("SCOREAPP GAME = ", SCOREAPP.game);
            spinner.stop();
			SCOREAPP.router.change("game");

			});


            var knopPost = document.getElementById("updateScore");

            var postTeamData = function () {
                console.log('Old score is: ' + SCOREAPP.game.team_1_score + ' - ' + SCOREAPP.game.team_2_score);
                console.log('New score is: ' + document.getElementById('team1score').value + ' - ' + document.getElementById('team2score').value);

                SCOREAPP.game.team_1_score = document.getElementById('team1score').value;
                SCOREAPP.game.team_2_score = document.getElementById('team2score').value;

                var newScore = JSON.stringify({
                    'game_id': SCOREAPP.game.id + "",
                    'team_1_score': SCOREAPP.game.team_1_score,
                    'team_2_score': SCOREAPP.game.team_2_score
                });

                var xhr = new XMLHttpRequest();

                xhr.open("POST", "https://api.leaguevine.com/v1/game_scores/?access_token=82996312dc", true);

                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.setRequestHeader("Authorization", "bearer  e236f54a35");
                xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
                xhr.send(newScore);
                xhr.onload = function () {
                    console.log("ik stuur iets");

                };

            };


            if (knopPost.addEventListener) {  // all browsers except IE before version 9
                knopPost.addEventListener("click", postTeamData, false);
                }

            else {
                if (knopPost.attachEvent) {   // IE before version 9
                knopPost.attachEvent("click", postTeamData);
              }
            }

			SCOREAPP.router.change();


		}
	};







	// DOM ready
	// Gebruik om de app te initialiseren wanneer DOM = ready
	domready(function () {
		// Zorg ervoor dat de app gaat starten
		SCOREAPP.controller.init();


	});

})();