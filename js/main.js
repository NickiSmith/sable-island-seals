/*  Laura Smith and Nicki Smith
    GEOG 575 Fall 2019
    Final Project - Sable Island Seals
*/

//------------------------------//
//----- create leaflet map -----//
//------------------------------//


var stylized = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 17
})

// -- custom tileset with seal data baked in --//
// -- possibly needs to be fixed on the tileset publishing side --//
/*var stylized = L.esri.tiledMapLayer({
  url: 'https://uw-mad.maps.arcgis.com/home/item.html?id=d4b7706885a84a0ca90c8ebdbbae5bf9#overview',
  maxZoom: 15
});*/

var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 17
});

var mymap = L.map('mapid', {
    center: [44.1, -60.5],
    zoom: 7.5,
    layers: [imagery, stylized]
});

var basemaps = {
    "Imagery": imagery,
    "Stylized": stylized
    
};

//----- create seal markers ------ //
//-- this could be updated to load from csv if we choose --//
var spot1=L.marker([44.01598,-59.699775]).bindPopup('You found seals!'),
    spot2=L.marker([44.005652,-59.717613]).bindPopup('You found seals!'),
    spot3=L.marker([43.981472,-59.753418]).bindPopup('You found seals!'), spot4=L.marker([43.979207,-59.753689]).bindPopup('You found seals!'), spot5=L.marker([43.935239,-60.063347]).bindPopup('You found seals!'), spot6=L.marker([43.935989,-60.049944]).bindPopup('You found seals!'), spot7=L.marker([43.955967,-59.804487]).bindPopup('You found seals!'), spot8=L.marker([43.973698,-59.765904]).bindPopup('You found seals!'), spot9=L.marker([43.977625,-59.759687]).bindPopup('You found seals!');

// -- create layer group and overlay for seal markers -- //
var sealSpots = L.layerGroup([spot1, spot2, spot3, spot4, spot5, spot6, spot7, spot8, spot9]);

var spotterOverlay = {
    "Seal Spotter": sealSpots
}

// ------- add basemaps and spotter overlay layers to map and layer control ----------- //
L.control.layers(basemaps, spotterOverlay).addTo(mymap);

//-----------------------------------------
//--- leaflet overlay pane script below ---
//-----------------------------------------

//create overlay pane
var svgOver = d3.select(mymap.getPanes().overlayPane).append("svg"),
    g = svgOver.append("g").attr("class", "pane");

//load park boundary polygon?
//this might be unecessary because it's just the shape of the island...
var parkData="data/NPboundary.geojson"

//load geojson seal data for seal paths
var sealData="data/allSeals.geojson";
var loadData = d3.json(sealData, function(error, collection) {
    if (error) throw error;
    function projectPoint(x, y) {
        var point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }
    
    var transform = d3.geoTransform({point: projectPoint})
    
    var path = d3.geoPath().projection(transform);
    
    // create paths
    var feature = g.selectAll("path")
    .data(collection.features)
    .enter()
    .append("path")
    .attr("class", function(d){
        return d.properties.ID;
    })
    .attr("opacity", "0")
    .attr("d", path);

    
    //resets svg when map is panned
    mymap.on("moveend", reset);
    reset();
    function reset(){  
      var bounds = path.bounds(collection),
          topLeft = bounds[0],
          bottomRight = bounds[1];
    
        svgOver
          .attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px")
          .style("background", "none")
          .style("opacity", "1");

        g
          .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
        
        feature.attr("d", path);
    }

    //----- line animation adapted from http://bl.ocks.org/fryford/2925ecf70ac9d9b51031 -----//
    //---- animate paths on click -------//
    
//Still working on how best to visualize these paths
    
    //--- seal#1 F104 ---//
    d3.select("#seal1").on("click", function(d, i) {
        d3.select(".F104").style("opacity", "1")
        d3.select(".F532").style("opacity", "0")
        d3.select(".K88").style("opacity", "0")
        d3.select(".S0749").style("opacity", "0")
        d3.select(".S0758").style("opacity", "0")
        
        // Determine the total length of the line 
        var totalLength =   d3.select(".F104").node().getTotalLength();
        
        //might be able to use this to fix starting and ending point of animation?
        //length = totalLength + "100";
    
        d3.select(".F104")
        // Set the line pattern to be a line followed by a gap
        .attr("stroke-dasharray", "100" + " " + totalLength)
        // Set the intial starting position so that only the gap is shown by offesetting by the total length of the line
        .attr("stroke-dashoffset", totalLength)
        // Then the following lines transition the line so that the gap is hidden...
        .style("stroke-width", "1")
        .transition()
        .duration(80000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        //.style("opacity", "1");
        
    })
    
    //--- seal#2 F532 ---//
    d3.select("#seal2").on("click", function(d, i) {
        d3.select(".F104").style("opacity", "0")
        d3.select(".F532").style("opacity", "1")
        d3.select(".K88").style("opacity", "0")
        d3.select(".S0749").style("opacity", "0")
        d3.select(".S0758").style("opacity", "0")
        
        // Determine the total length of the line 
        var totalLength =   d3.select(".F532").node().getTotalLength();
    
        d3.select(".F532")
        // Set the line pattern to be a long line  followed by an equally long gap
        //.attr("stroke-dasharray", totalLength + " " + totalLength)
        // Set the line pattern to be a line followed by a gap
        .attr("stroke-dasharray", "100" + " " + totalLength)
        // Set the intial starting position so that only the gap is shown by offesetting by the total length of the line
        .attr("stroke-dashoffset", totalLength)
        // Then the following lines transition the line so that the gap is hidden...
        .transition()
        .duration(100000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        //.style("opacity", "1");
    })
    
    //--- seal#3 K88 ---//
    d3.select("#seal3").on("click", function(d, i) {
        d3.select(".F104").style("opacity", "0")
        d3.select(".F532").style("opacity", "0")
        d3.select(".K88").style("opacity", "1")
        d3.select(".S0749").style("opacity", "0")
        d3.select(".S0758").style("opacity", "0")
        
        // Determine the total length of the line 
        var totalLength =   d3.select(".K88").node().getTotalLength();
    
        d3.select(".K88")
        // Set the line pattern to be a line followed by a gap
        .attr("stroke-dasharray", "100" + " " + totalLength)
        // Set the intial starting position so that only the gap is shown by offesetting by the total length of the line
        .attr("stroke-dashoffset", totalLength)
        // Then the following lines transition the line so that the gap is hidden...
        .transition()
        .duration(100000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        //.style("opacity", "1");
    })
    
    //--- seal#4 S0749 ---//
    d3.select("#seal4").on("click", function(d, i) {
        d3.select(".F104").style("opacity", "0")
        d3.select(".F532").style("opacity", "0")
        d3.select(".K88").style("opacity", "0")
        d3.select(".S0749").style("opacity", "1")
        d3.select(".S0758").style("opacity", "0")
        
        // Determine the total length of the line 
        var totalLength =   d3.select(".S0749").node().getTotalLength();
    
        d3.select(".S0749")
        // Set the line pattern to be a line followed by a gap
        .attr("stroke-dasharray", "100" + " " + totalLength)
        // Set the intial starting position so that only the gap is shown by offesetting by the total length of the line
        .attr("stroke-dashoffset", totalLength)
        // Then the following lines transition the line so that the gap is hidden...
        .transition()
        .duration(100000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        //.style("opacity", "1");
    })
    
    //--- seal#5 S0758 ---//
    d3.select("#seal5").on("click", function(d, i) {
        d3.select(".F104").style("opacity", "0")
        d3.select(".F532").style("opacity", "0")
        d3.select(".K88").style("opacity", "0")
        d3.select(".S0749").style("opacity", "0")
        d3.select(".S0758").style("opacity", "1")
        
        // Determine the total length of the line 
        var totalLength =   d3.select(".S0758").node().getTotalLength();
    
        d3.select(".S0758")
        // Set the line pattern to be a line followed by a gap
        .attr("stroke-dasharray", "100" + " " + totalLength)
        // Set the intial starting position so that only the gap is shown by offesetting by the total length of the line
        .attr("stroke-dashoffset", totalLength)
        // Then the following lines transition the line so that the gap is hidden...
        .transition()
        .duration(100000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        //.style("opacity", "1");
    })
    
        //--- make all seals visible ---//
    d3.select("#allSeals").on("click", function(d, i) {
        d3.selectAll("path").style("opacity", "1");
    })
    
 //-----  end of line animation -----//    
    
    
}); 


//------ end of svg overlay pane script -----//


//--------------------------------------------//
//---------- locator map script below --------//
//--------------------------------------------//

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
            var label = "<p>"+ "Sable Island" + "</p>"

            //add Sable Island marker to svg
            locatorMap.selectAll("circles.points")
                .data(point)
                .enter()
                .append("circle")
                .attr("r",5)
                .attr("transform", function(d) {return "translate(" + projection(point) + ")";})
                .attr("r", "3px")
                .attr("fill", "#8BA5D9")
                .attr("stroke", "#49556f");
            
        } //end of the callback() function
    } //end of setMap()
//-------- end of locator map script -------//

//--------- locator tool --------------//

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);

//---------end locator tool -----------//



// -------- add logo to the map -------//
		var imageUrl = 'img/logo.svg';
		var imageBounds = [[43.397331,-59.191303], [43.109271,-58.285365]];
		var logo = L.imageOverlay(imageUrl, imageBounds);
		logo.addTo(mymap);

// -------- end add the logo to the map --------//

//----------------------------------//
//------- Add button icons ---------//
//----------------------------------//

    $("#seal1").html("<img class='buttonIMG' src='img/seal1.png'>");
    $("#seal2").html("<img class='buttonIMG' src='img/seal2.png'>");
    $("#seal3").html("<img class='buttonIMG' src='img/seal3.png'>");
    $("#seal4").html("<img class='buttonIMG' src='img/seal4.png'>");
    $("#seal5").html("<img class='buttonIMG' src='img/seal5.png'>");


//----------------------------------//
//Slideshow
//----------------------------------//




//-----------------------------------------------
/*---------------- Resources --------------------
//-----------------------------------------------

https://gis.stackexchange.com/questions/34769/how-can-i-render-latitude-longitude-coordinates-on-a-map-with-d3

Getting svg path to resize on zoom in leaflet/d3
https://github.com/Leaflet/Leaflet/issues/5016

Animating the line
http://bl.ocks.org/fryford/2925ecf70ac9d9b51031

https://stackoverflow.com/questions/28682454/moving-a-circle-along-a-d3-path-animating-at-varying-speeds

stroke-dasharray
https://bl.ocks.org/mbostock/5649592

point-along-path
https://bl.ocks.org/mbostock/1705868

*/

