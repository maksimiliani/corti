$('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/maksimiliani/corti@57633ee/css/crosspage-style.css">');

var sections_color;
var locked = false;
var header_shrinked = false;
var bodyRect;
var header_el;
var mobile_menu;
var m_mstyle = "none";

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function update_header(colourr) {

	if ($('html, body').css("overflow") === 'hidden') return;

	if (!header_shrinked && (window.scrollY > 119)) {
		$('#header_grid').addClass('short');
		$('#submenu_social').addClass('short');
		$('#nav_link_dropdown_container').addClass('short');
		$('#nav_link_dropdown_container2').addClass('short');
		$('#nav').addClass('nav_effect');
		header_shrinked = true;
	}
	if (header_shrinked && (window.scrollY <= 119)) {
		$('#header_grid').removeClass('short');
		$('#submenu_social').removeClass('short');
		$('#nav_link_dropdown_container').removeClass('short');
		$('#nav_link_dropdown_container2').removeClass('short');
		$('#nav').removeClass('nav_effect');
		header_shrinked = false;
	}

	function isNight(color) {
		var r, g, b, hsp; // Variables for red, green, blue values
		if (color.match(/^rgb/)) { // Check the format of the color, HEX or RGB?
			color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/); // If HEX --> store the red, green, blue values in separate variables
			r = color[1];
			g = color[2];
			b = color[3];
		}
		else { // If RGB --> Convert it to HEX: http://gist.github.com/983661
			color = +("0x" + color.slice(1).replace(
				color.length < 5 && /./g, '$&$&'));
			r = color >> 16;
			g = color >> 8 & 255;
			b = color & 255;
		}
		hsp = Math.sqrt( // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
			0.299 * (r * r) +
			0.587 * (g * g) +
			0.114 * (b * b)
		);

		if (hsp > 185) { // hsp>127.5 Using the HSP value, determine whether the color is light or dark
			return false; //'day'
		}
		else {
			return true; //'night'
		}
	}


	header_el = $(".header-sticky");
	bodyRect = document.body.getBoundingClientRect();

	for (var i = 0; i < sections_color.length; i++) {
		var offset1 = sections_color[i].getBoundingClientRect().top - bodyRect.top - header_el[0].offsetHeight;
		var offset2 = sections_color[i].getBoundingClientRect().top - bodyRect.top + sections_color[i].getBoundingClientRect().height - header_el[0].offsetHeight;
		if (i < sections_color.length - 1)
			offset2 = sections_color[i + 1].getBoundingClientRect().top - bodyRect.top - header_el[0].offsetHeight;
		if ((window.scrollY >= offset1) && (window.scrollY < offset2)) {

			var new_colourr = getComputedStyle(sections_color[i], null).backgroundColor;
			if ((i == 0) && (colourr != null)) {
				new_colourr = colourr;
			}
			if (header_shrinked) { header_el[0].style.backgroundColor = new_colourr; } else { header_el[0].style.background = "none"; }

			if (isNight(new_colourr)) {
				$('.menu-divider').addClass('night');
				$('.nav-bar-container > .nav-link').addClass('night');
				$('.nav-logo').addClass('night');
				$('.nav-logo-link').addClass('night');
				$('.menu_button').addClass('night'); $('.nav-bar-container > .nav-link-expandable').addClass('night');
				$('.nav-logomark').addClass('night');
			} else {
				$('.menu-divider').removeClass('night');
				$('.nav-bar-container > .nav-link').removeClass('night');
				$('.nav-logo').removeClass('night');
				$('.nav-logo-link').removeClass('night');
				$('.menu_button').removeClass('night'); $('.nav-bar-container > .nav-link-expandable').removeClass('night');
				$('.nav-logomark').removeClass('night');
			}
			locked = false;
			break;
		}
	}
}

$(document).ready(function () {

	const inputs_per_form = 4; //4 fields per form
	const events_count = $('.input-field').length / inputs_per_form;

	for (let i = 0; i < events_count; i++) {
		$('.input-field')[i * inputs_per_form].addEventListener('focus', event => {
			//document.getElementsByClassName('input-field hidden')[i].value = $('.event_restaurant')[i].textContent;
			setCookie("event_name", $('.event_title_code')[i].textContent, 30);
			setCookie("event_address", $('.event_address')[i].textContent, 30);
			setCookie("event_date", $('.event_date')[i].textContent, 30);
			setCookie("event_restaurant", $('.event_restaurant')[i].textContent, 30);
			setCookie("event_phone", $('.event_phone')[i].textContent, 30);
		});
	}

	const add_to_gmail_button = $('#add_to_gmail')[0];
	const add_to_microsoft_button = $('#add_to_microsoft')[0];
	if (add_to_gmail_button) {
		let event_date = new Date(getCookie("event_date"));
		let event_date_end = new Date(getCookie("event_date"));
		event_date_end.setHours(event_date_end.getHours() + 5);
		let event_loca = encodeURI(getCookie("event_address"));
		let event_name = encodeURI(getCookie("event_name"));
		let event_restaurant = encodeURI(getCookie("event_restaurant"));
		let event_phone = encodeURI(getCookie("event_phone"));
		add_to_gmail_button.setAttribute("href", `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${event_date.toISOString().replace(/[^a-zA-Z0-9]/g, '')}%2F${event_date_end.toISOString().replace(/[^a-zA-Z0-9]/g, '')}&details=${event_restaurant}%0A${event_loca}%0A${event_phone}%0A%0AI%27ll%20be%20joining%20a%20handful%20of%20my%20peers%20over%20a%20lunch%20and%20learn%20about%20how%20organizations%20like%20mine%20are%20addressing%20their%20most%20pressing%20telemedicine%20issues.%0A%0AQuestions%3F%20Reach%20Leo%20Lambert%2C%20Corti%2C%20at%20%3Ca%20href%3D%22mailto%3All%40corti.ai%22%3Ell%40corti.ai%3C%2Fa%3E&location=${event_loca}&text=Lunch%20and%20Learn%3A%20${event_restaurant}`);

		add_to_microsoft_button.setAttribute("href", `https://outlook.live.com/calendar/0/deeplink/compose?body=${event_restaurant}%0A${event_loca}%0A${event_phone}%0A%0AI%27ll%20be%20joining%20a%20handful%20of%20my%20peers%20over%20a%20lunch%20and%20learn%20about%20how%20organizations%20like%20mine%20are%20addressing%20their%20most%20pressing%20telemedicine%20issues.%0A%0AQuestions%3F%20Reach%20Leo%20Lambert%2C%20Corti%2C%20at%20%3Ca%20href%3D%22mailto%3All%40corti.ai%22%3Ell%40corti.ai%3C%2Fa%3E&enddt=${event_date_end.toISOString()}&location=${event_loca}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=${event_date.toISOString()}&subject=Lunch%20and%20Learn%3A%20${event_restaurant}`);
	}

	/* Setup for static pages
	const event_nm = $('#event_name')[0];
	if (event_nm) {
		$('#event_title').val(event_nm.textContent);
		setCookie("event_name", event_nm.textContent, 30);
		setCookie("event_address", $('#event_address')[0].textContent, 30);
		setCookie("event_date", $('#event_date')[0].textContent, 30);
	}

	const result_ttl = $('#result_title')[0];
	if (result_ttl) {
		result_ttl.innerHTML = result_ttl.textContent + ` <strong>${getCookie("event_name")}</strong>`;
		$('#result_address')[0].textContent = getCookie("event_address");
		$('#result_date')[0].textContent = getCookie("event_date");
	}*/

	sections_color = document.getElementsByClassName("section");
	update_header(null);
	$('.nav-link-dropdown-horizontal').attr('tabindex', '-1');

	$(".nav-dropdown").hover(function () {
		if (m_mstyle === "none") {
			//$('.nav-link-dropdown-container-horizontal').css({'padding-top': (parseInt($('#header_grid').css("height").replace(/px/,""))/2 + 14)+"px"});
		} else {
			$('.nav-link-dropdown-container-horizontal').css({ 'padding-top': "0px" });
		}
		//update_header('#231E23');

		if (!header_shrinked && (window.scrollY <= 119)) {
			$('#nav').addClass('nav_effect');
		}
	}, function () {
		update_header(null);

		if (!header_shrinked && (window.scrollY <= 119)) {
			$('#nav').removeClass('nav_effect');
		}
	});

	$(".w-nav-overlay").attrchange({
		trackValues: true,
		callback: function (event) {
			mobile_menu = document.getElementsByClassName("w-nav-overlay");
			m_mstyle = mobile_menu[0].style.display;
			if (m_mstyle === "none") {
				document.getElementById("header_grid").style.background = "none";
				update_header(null);
				$('html, body').css({ overflow: 'auto' });
			} else {
				$('html, body').css({ overflow: 'hidden' });
				document.getElementById("header_grid").style.backgroundColor = "white";
				$('.menu_button').removeClass('night');
				$('.nav-link').removeClass('night');
				$('#nav_link_dropdown_container').removeClass('night');
				$('#nav_link_dropdown_container2').removeClass('night');
				$('#nav_link_dropdown_container3').removeClass('night');
				$('#nav_link_dropdown_container4').removeClass('night');
				$('.nav-logo-link').removeClass('night'); $('.nav-link-expandable').removeClass('night');
			}
		}
	});


	$(window).scroll(function () {
		if (!locked) {
			locked = true;
			setTimeout(update_header(null), 150);
		}
	});


});
