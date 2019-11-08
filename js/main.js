/*  Laura Smith and Nicki Smith
    GEOG 575 Fall 2019
    Final Project - Sable Island Seals
*/

/* to do on 11/8:
add multiline to leaflet map
animated line
*/

var stylized = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 17
}),
    imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 17
});

var mymap = L.map('mapid', {
    center: [43.929898, -59.906358],
    zoom: 13,
    layers: [imagery, stylized]
});

var basemaps = {
    "Imagery": imagery,
    "Stylized": stylized
    
};

L.control.layers(basemaps).addTo(mymap);


//---------- d3 svg script below --------
//begin script when window loads
window.onload = setMap();

    //set up map
    function setMap(){

        //map frame dimensions
        var width = 250,
            height = 250;

        //create new svg container for the map
        var locatorMap  = d3.select("#locator")
          .append("svg")
          .attr("class", "locatorMap")
          .attr("width", width)
          .attr("height", height);
        
        //create projection
        var projection = d3.geoConicConformal()
          .center([8, 55])
          .rotate([90, 0, 0])
          .parallels([30, 30])
          .scale(200)
          .translate([width / 2, height / 2])
          //.clipExent([[0, 0], [width, height]]);

        var path = d3.geoPath()
          .projection(projection);
        
        //use queue to parallelize asynchronous data loading
        d3.queue()
          .defer(d3.json, "data/ne_110m_coastline.topojson")
          .await(callback);

        function callback(error, data){
            //translate states TopoJSON
            var coastlines = topojson.feature(data, data.objects.ne_110m_coastline).features;
        
            //console.log(data);
            //console.log(coastlines);
            
           //draw paths
            locatorMap.selectAll(".coasts")
              .data(coastlines)
              .enter()
              .append("path")
              .attr("class", "coasts")
              .attr("d", path)
            
            //create point for Sable Island
            var point = [-59.914991, 43.926013]
            
            //create label for point
            //var label = "Sable Island"
            
            //add Sable Island marker to svg
            locatorMap.selectAll("circles.points")
                .data(point)
                .enter()
                .append("circle")
                .attr("r",5)
                .attr("transform", function(d) {return "translate(" + projection(point) + ")";})
                .attr("r", "3px")
                .attr("fill", "#acacde")
                .attr("stroke", "#49556f");
            
            //add text label for point
            locatorMap.selectAll("text")
            .data(point)
            .enter()
            .append("text")
            .attr("transform", function(d) {return "translate(" + projection(point) + ")";});
            
            //Add the text attributes
            var textLabels = text
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "20px")
                 .attr("fill", "black");

        } //end of the callback() function
    } //end of setMap()
//---------- end of d3 svg script ----------

