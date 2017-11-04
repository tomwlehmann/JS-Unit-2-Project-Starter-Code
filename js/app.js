/*
  Please add all Javascript code to this file.

  Feedr App
  GA JS-SF-8
  Tom Lehmann
  Oct/Nov 2017

  Functionality: 
  	 - Displays top 10 stories from two different news sources: Reddit and the Economist
  	 - Displays popups for both news sources with images for reddit and descriptions for the Economist
  	 - Provides links directly to original articles 
*/

let articles = [];
let economistDisplayed = false;

// making api call to retreive data from reddit
// also stores results in an array locally for popup window reference
// no api key needed for reddit
let getReddit = function() {
	$.get('https://www.reddit.com/r/popular.json', function(response) {
		articles = [];
		for (let i = 0; i < 10; i++) {
			let image = response.data.children[i].data.thumbnail;
			let title = response.data.children[i].data.title;
			let impressions = response.data.children[i].data.ups;
			addArticle(i, image, title, impressions, 'Reddit');
			articles.push(response.data.children[i].data);
		}
		economistDisplayed = false;
	});
};

let getEconomist = function() {
	$.get('https://newsapi.org/v1/articles?source=the-economist&sortBy=latest&apiKey=YOUR_API_KEY_HERE', function(response) {
		articles = [];
		for (let i = 0; i < 10; i++) {
			let image = response.articles[i].urlToImage;
			let title = response.articles[i].title;
			let impressions = ''; //no impression data available
			addArticle(i, image, title, impressions, 'The Economist');
			articles.push(response.articles[i]);
		}
		economistDisplayed = true;
	});
};

//function to create new article using template literal
//accepts parameters so can be called by any news api to create article
let addArticle = function(articleNum, image, title, impressions, source) {
	let newArticle = `
	<article class="article" id="${articleNum}">
	<section class="featuredImage">
	  <img src="${image}" alt="" />
	</section>
	<section class="articleContent">
	    <a href="#"><h3>${title}</h3></a>
	    <h6>${source}</h6>
	</section>
	<section class="impressions">
	  ${impressions}
	</section>
	<div class="clearfix"></div>
	</article>
	`;
	$('#main').append(newArticle);
};


//event listener to bring up popup
//implement logic to handle whether economist or reddit is being displayed
$('#main').on('click', '.article', function(event) {
	event.preventDefault();
	$('#popUp').removeClass('loader hidden');
	$('#popUp h1').html($(this).find('h3').text());
	if (economistDisplayed) {
		$('#popUp p').html(articles[$(this).attr('id')].description);
		$('#popUp img').attr('src', '');
	} else {
		$('#popUp p').html('');
		$('#popUp img').attr('src', articles[$(this).attr('id')].thumbnail);
	}
	$('#popUp a').attr('href', articles[$(this).attr('id')].url);
});

//event listener to remove popup
$('.closePopUp').on('click', function(event) {
	event.preventDefault();
	$('#popUp').addClass('loader hidden');
});

//event listener to run economist articles 
$('#economist').on('click', function(event) {
	event.preventDefault();
	$('#main').html('');
	getEconomist();
});

//event listener to run reddit articles 
$('#reddit').on('click', function(event) {
	event.preventDefault();
	$('#main').html('');
	getReddit();
});

//load reddit at first, by default
$(document).ready(function() {
	getReddit();
});