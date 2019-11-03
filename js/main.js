/*  Laura Smith and Nicki Smith
    GEOG 575 Fall 2019
    Final Project - Sable Island Seals
*/

//initialize the map and set the view
var mymap = L.map('mapid').setView([43.929898, -59.906358], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(mymap);
