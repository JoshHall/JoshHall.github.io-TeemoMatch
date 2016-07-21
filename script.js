/**
 * Created by hallj on 4/20/2016.
 */
// Create the route module and name it routeApp
var app = angular.module('matchApp',['ngRoute']);

// Config the routes
app.config(function($routeProvider) {
    $routeProvider
    // route for the home page
        .when('/home', {
            templateUrl: 'home.html'
            // controller: 'homeCtrl'
        })
        // route for the settings page
        .when('/settings',{
            templateUrl: 'settings.html'
            // controller: 'settingsCtrl'
        })
        // route for the about page
        .when('/about',{
            templateUrl: 'about.html'
            // controller: 'aboutCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
});

//Globals
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 0;
var match_counter = 0;
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

//array to randomize(saving to call)
var add_images = [
    'images/super_teemo.jpg',
    'images/teemo_blind.jpg',
    'images/teemo_mushroom.jpg',
    'images/omega_squad.jpg',
    'images/puppy_eye_teemo.jpg',
    'images/teemo_run.jpg',
    'images/teemo_background_sunset.png',
    'images/teemopanda.jpg',
    'images/teemo_backgroun_watermark.jpg'
];

//document ready
$(document).ready(function() {
    new_game();
    display_stats();
    games_played = 0;
    total_possible_matches = $('.card').length / 2;
    $('#game-area').on('click', ".card", card_clicked);
    $('.stats_container').on('click', ".reset", reset);
});

//reset = games_played++
function reset() {
    $('.game_area').html('');
    games_played++;
    reset_stats();
    display_stats();
    new_game();
    first_card_clicked = null;
    second_card_clicked = null;
}

//click Card Function
function card_clicked() {
    if ($(this).children('.front').hasClass('animate-card') && second_card_clicked == null) {
        flip_card(this);
        if (first_card_clicked == null) {
            first_card_clicked = this;
            return;
        }
        else {
            second_card_clicked = this;
            attempts++;
            if ($(first_card_clicked).find('.front img').attr('src') == $(second_card_clicked).find('.front img').attr('src')) {
                match_counter++;
                matches++;
                accuracy = Math.round(100 * (matches / attempts));
                display_stats();
                setTimeout(match, 1000);
                if (match_counter == total_possible_matches) {
// >>>>>>>>> // >>>>>> Make this a modal that pops out and is teemo coming back to life! <<<<<<<<<<<< \\ <<<<<<<<<<<<<<<<<  \\
                    setTimeout(win, 1300);
                }
            }
            else {
                accuracy = Math.round(100 * (matches / attempts));
                display_stats();
                setTimeout(incorrect, 1500);
                return;
            }
        }
        function incorrect() {
            $(first_card_clicked).find('.back, .front').toggleClass('animate-card');
            $(second_card_clicked).find('.back, .front').toggleClass('animate-card');
            first_card_clicked = null;
            second_card_clicked = null;
            display_stats();
        }
        function match() {
            $(first_card_clicked).find('.front img, .back img').css('visibility', 'hidden');
            $(second_card_clicked).find('.front img, .back img').css('visibility', 'hidden');
            first_card_clicked = null;
            second_card_clicked = null;
            display_stats();
            background_change();
        }
        function win() {
            $('#win').css('visibility', 'visible');
        }
        // Display stats
        display_stats();
    }
}
// create a function to randomize the array of images
    //Creates the DOM Objects
    //adds random image to the src
function new_game () {
    var duplicated_array = add_images.concat(add_images);
    var random_array = [];
    for (var i = duplicated_array.length; i > 0; i--) {
        var rand_select = Math.floor(Math.random() * duplicated_array.length);
        random_array.push(duplicated_array[rand_select]);
        var blank_card = $('<div>').addClass('card');
        var front = $('<div>').addClass('front animate-card');
        var front_img = $('<img>').attr('src', duplicated_array[rand_select]);
        var back = $('<div>').addClass('back');
        var back_img = $('<img>', {
            src: 'images/back_of_card.jpg'
        });
        front.append(front_img);
        back.append(back_img);
        blank_card.append(front, back);
        $('#game-area').append(blank_card);
        //splice out the random after everything is created
        duplicated_array.splice(rand_select, 1);
    }
}

// Display stats
function display_stats() {
    $('.games-played .value').text(games_played);
    $('.attempts .value').text(attempts);
    $('.accuracy .value').text(accuracy + "%");
}

//Reset Stats
function reset_stats() {
    matches = 0;
    attempts = 0;
    accuracy = 0;
    display_stats();
    $('body').css('background-image', 'url("images/teemo_wallpaper_by_tll_mathex-d6oe34r.jpg")');
}

// Flip card function
function flip_card (x) {
    $(x).children('div').toggleClass('animate-card');
}

function background_change () {
    if (matches == Math.floor(total_possible_matches * (1 / 3))) {
        $('body').css('animation', 'backToOrange 1s');
        setTimeout(function (){
            $('body').css('background-image', 'url("images/teemo_wallpaper_orange.jpg")');
            $('#game-area').css('animation', 'teemoBlind 15s');
        }, 1000);
    }
    else if (matches == Math.floor(total_possible_matches * (3 / 4))) {
        $('body').css('animation', 'backToRed 1s');
        setTimeout(function (){
            $('body').css('background-image', 'url("images/teemo_wallpaper_red.jpg")');
        }, 1000);
    }
    else if (matches == total_possible_matches) {
        $('.stats_container').css('background', 'rgba(56, 54, 32, 0.9)');
        $('body').css('animation', 'backToDevil 2s 2');
        setTimeout(function (){
            $('body').css('background-image', 'url("images/satan_teemo1.jpg")');
        }, 1000);
    }
}

