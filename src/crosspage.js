
import "https://cdnjs.cloudflare.com/ajax/libs/attrchange/2.0.1/attrchange.min.js";

var sections_color;
var locked = false;
var header_shrinked = false;
var bodyRect;
var counters_run = false;
var header_el;
var mobile_menu;
var m_mstyle;

function update_header() {
  if ($('html, body').css("overflow") === 'hidden') return;

  if (!header_shrinked && (window.scrollY > 119)) {
    $('#header_grid').addClass('short');
    $('#nav').addClass('nav_effect');
    header_shrinked = true;
  }
  if (header_shrinked && (window.scrollY <= 119)) {
    $('#header_grid').removeClass('short');
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

    if (hsp>185) { // Using the HSP value, determine whether the color is light or dark
        return false; //'day'
      }
    else {
        return true; //'night'
      }
  }

    bodyRect = document.body.getBoundingClientRect();
    var header_el = $(".header-sticky");
    for (var i=0; i < sections_color.length; i++) {
      var offset1 = sections_color[i].getBoundingClientRect().top - bodyRect.top - header_el[0].offsetHeight;
      var offset2 = sections_color[i].getBoundingClientRect().top - bodyRect.top + sections_color[i].getBoundingClientRect().height - header_el[0].offsetHeight;
      if (i < sections_color.length-1)
        offset2 = sections_color[i+1].getBoundingClientRect().top - bodyRect.top - header_el[0].offsetHeight;
      if ((window.scrollY >= offset1) && (window.scrollY < offset2)) {
        header_el[0].style.backgroundColor = getComputedStyle(sections_color[i], null).backgroundColor;
        if (isNight(getComputedStyle(sections_color[i], null).backgroundColor) && i>0) {
          $('.nav-link').addClass('night');
          $('.nav-logo').addClass('night');
          $('.nav-logo-link').addClass('night');
          $('.menu_button').addClass('night');
        } else {
          $('.nav-link').removeClass('night');
          $('.nav-logo').removeClass('night');
          $('.nav-logo-link').removeClass('night');
          $('.menu_button').removeClass('night');
        }
        locked = false;
        break;
      }
    }
}

$(document).ready(function() {
  sections_color = document.getElementsByClassName("section");
  update_header();

  $(".w-nav-overlay").attrchange({
    trackValues: true,
    callback: function(event) {
       mobile_menu = document.getElementsByClassName("w-nav-overlay");
      m_mstyle = mobile_menu[0].style.display;
      if (m_mstyle === "none") {
          document.getElementById("header_grid").style.background = "none";
          update_header();
          $('html, body').css({overflow: 'auto'});
        } else {
          $('html, body').css({overflow: 'hidden'});
          document.getElementById("header_grid").style.background = "white";
          $('.menu_button').removeClass('night');
          $('.nav-link').removeClass('night');
          $('.nav-logo-link').removeClass('night');
        }
    }
  });


    $(window).scroll(function() {
    if (!locked) {
      locked = true;
      setTimeout(update_header(), 150);
    }
    if ((window.scrollY > sections_color[5].getBoundingClientRect().top - bodyRect.top - sections_color[5].getBoundingClientRect().height*1.5) && !counters_run) {
      counters_run = true;
      $('.factoid').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 2500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now)+'%');
            }
        });
        });
    }
  });


});
