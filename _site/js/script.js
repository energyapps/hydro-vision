var labels = [
  {
    "id": "NORW",
    "name": "Northwest (WECC subregion)"
  },
  {
    "id": "CALN",
    "name": "California-North (WECC subregion)"
  },
  {
    "id": "CALS",
    "name": "California-South (WECC subregion)"
  },
  {
    "id": "BASN",
    "name": "Basin (WECC subregion)"
  },
  {
    "id": "DSW",
    "name": "Desert Southwest (WECC subregion)"
  },
  {
    "id": "MAPP",
    "name": "Mid-Continent Area Power Pool"
  },
  {
    "id": "ROCK",
    "name": "Rockies (WECC subregion)"
  },
  {
    "id": "SPP",
    "name": "Southwest Power Pool"
  },
  {
    "id": "MISO-US",
    "name": "Midwest Independent Transmission System Operator"
  },
  {
    "id": "ERCOT",
    "name": "Electric Reliability Council of Texas"
  },
  {
    "id": "PJM",
    "name": "PJM Interconnection"
  },
  {
    "id": "SERC-W",
    "name": "SERC Reliability Corporation West"
  },
  {
    "id": "SERC-SE",
    "name": "SERC Reliability Corporation South East"
  },
  {
    "id": "SERC-N",
    "name": "SERC Reliability Corporation North"
  },
  {
    "id": "SERC-E",
    "name": "SERC Reliability Corporation East"
  },
  {
    "id": "FRCC",
    "name": "Florida Reliability Coordinating Council"
  },
  {
    "id": "NYISO",
    "name": "New York Independent System Operator"
  },
  {
    "id": "ISO-NE",
    "name": "ISO New England, Inc."
  }
]

console.log(labels)

var ø = 0;

var redata = ["nerc2010","nerc2020","nerc2030","nerc2040","nerc2050"];
var totalDiv = document.getElementById('totalDiv')
var boxWidth = 40;

// Set some variables
var width = parseInt(d3.select("#master_container").style("width")),
  height = width / 2;

var projection = d3.geo.albers();

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select("#map_container")
  .attr("width", width)
  .attr("height", height);

var radius = d3.scale.sqrt()  
				.domain([0,10])
				.range([(2), (width / 15)]); 

var legend = svg.append("g")
  .attr("class", "legend")    
  .selectAll("g")
	.data([1, 5, 10])
	.enter().append("g");

var imgWidth = 50;
var imgHeight = 50;

// Pie chart colors 
var color = d3.scale.ordinal()
    .range(["#8BCC00", "#19A9E2"]);

(function ($) { 
// load some data
// d3.json("/sites/prod/files/wind_vision_50m_contiguous.json", function(error, us) {
d3.json("js/nerc_topo3.json", function(error, us) {
	if (error) return console.error(error);
	ø += 1;
	// console.log('%cDATA FUNCTION: No: '+ ø , 'font-size: 2em; color: TURQUOISE;');

	var TheData = topojson.feature(us, us.objects.nerc_boundary).features		

	// YEAR SELECTOR! (WHEN YOU CLICK OUT OF CYCLE)
		$('.year').click(function(e) {
			ø += 1;
			// console.log('%cYEAR FUNCTION: No: '+ ø , 'font-size: 2em; color: orange;');
			if (m === 1) {
				$('.rpt2 span img').attr('src', 'img/mediaButtons_play.png');				
				m-=1;
			};
			clearInterval(play);
			var width = parseInt(d3.select("#master_container").style("width"));
			$('.year').removeClass('activea');
			$(this).addClass('activea');
			i =  Number($(this).attr("idnum"));
			BuildBubbles(width);
			// console.log("this is m: " + m)
		});	

		//build a map outside of resize
		svg.selectAll(".state")
	    .data(topojson.feature(us, us.objects.nerc_boundary).features)
	    .enter().append("path")
	      .attr("class", function(d) {return "state " + d.id; });

	      //this is building of the USA shape
		svg.append("path")
	    .datum(topojson.mesh(us, us.objects.nerc_boundary, function(a,b) {return a !== b;}))
	    .attr("class", "state-boundary");

// build the bubbles/pies outside of the loop so that when you rebuild, 
// you are replacing the existing, not creating all new

		// Resize function
		function resize() {						
			ø += 1;
			// console.log('%cRESIZE FUNCTION: No: '+ ø , 'font-size: 2em; color: CORAL;');

			//for first load????
			if (k = "undefined") { k = 0;};
			d3.selectAll(".lg").remove();

			// resize width
			var width = parseInt(d3.select("#master_container").style("width")),
		    height = width / 2;

			// resize projection
		  // Smaller viewport
			if (width <= 800) {
				projection
					.scale(width * 1.05)
					.translate([width / 2, ((height / 2) + 45)])             
			} else if (width <= 900) {
				projection
					.scale(width * 1.2)
					.translate([width / 2, ((height / 2) + 30)])  
			} 

			// full viewport
			else {
				projection
					.scale(width)
					.translate([width / 2, ((height / 2) + 10)])   
			};	    

			var margin	= width / 20;
			var top = 10;
			var left = margin;
			var boxWidth = 40;
			var boxMargin = margin*1.5;
			var boxSegment = 3*boxWidth + (boxMargin);
			var barWidth = width - margin - boxSegment;   

			var radius = d3.scale.sqrt()  
				.domain([0,10])
				.range([(2), (width / 15)]); 

	    // resize paths of states
			svg.selectAll('path.state')
	    	.attr("d", path);

	  	svg.selectAll('path.state-boundary')
	  		.attr("d", path);

////////////////////////
// ///////////// Remove and place the legend every time the map is refreshed or resized //////////
////////////////////////

			// create the legend
			legend.append("circle")

	    legend.append("text")
	      .attr("dy", "1.3em")
	      .text(function(d){return d});

	      // hang the legend based on louisiana's location
			var lgspot = [(path.centroid(TheData[5])[0] + (width / 7)),(path.centroid(TheData[5])[1] + (width / 20))] //using louisiana as reference

			legend  
				.attr("transform", function(d) { 
	        return "translate(" + lgspot + ")"; });

	    legend.selectAll("circle")
	    	.attr("class","lg")
	      .attr("cy", function(d) { return -radius(d); })
	      .attr("r", radius);

	    legend.selectAll("text")
	    	.attr("class","lg")
	      .attr("y", function(d) { return -2 * radius(d); }); 

      var legendText = svg.append("g")
			.attr("class", "legendText lg")
			.append("text")
			.attr("dy", "1.3em")		  
		  .attr("text-anchor","middle")
		  .attr("fill","rgb(51,51,51)")
			.attr("transform", function(d) { 
	        return "translate(" + lgspot + ")"; });		  

		  legendText.append("tspan")
		  	.text("Pumped Storage Hydropower Capacity")
		  	.attr("x",0)
	      .attr("y",0);

		  legendText.append("tspan")
		  	.text("In Gigawatts (GW)")
		  	.attr("x",0)
	      .attr("y",30);

			/////////////end the legend creation //////////////////

			///////////// call the build bubbles '///////////////'			
			//define here instead of there because if global resets it to 0 automatically which is NOT good :)
			// var type = typeArray[k] // where to start
			var type = 0;

			BuildBubbles(width, type);
		}		

		function BuildBubbles(w, type) {		
			ø += 1;
			// console.log('%cBUILD BUBBLES FUNCTION: No: '+ ø , 'font-size: 2em; color: TEAL;');
			// console.log("you selected the year, at index: " + i)

			// remove the pies and tools for next build
			d3.selectAll(".tool").remove();
			d3.selectAll(".bubbles").remove();
			
			var name = redata[i]
			// console.log(redata[i])
			
			//Set the new activea category before the build, then you just rebuild the new one
			var gotype = $('.activea').attr('datayear');

		     if (gotype == "10") { var k = 0; var gotypename = "2010"; var total = 22.24;} 
		// else if (gotype == "16") { var k = 1; var gotypename = "2016"; var total = 22.24;} 
		else if (gotype == "20") { var k = 1; var gotypename = "2020"; var total = 22.30;} 
		else if (gotype == "30") { var k = 2; var gotypename = "2030"; var total = 38.49;} 
		else if (gotype == "40") { var k = 3; var gotypename = "2040"; var total = 48.91;} 
		else if (gotype == "50") { var k = 4; var gotypename = "2050"; var total = 57.76;};

			if (gotypename < 2020) {
				totalDiv.innerHTML = '<h3>United States</h3><h2>Total PSH Installed: ' + total + ' GW</h2>';			
			} else {
				totalDiv.innerHTML = '<h3>United States</h3><h2>Total PSH Projected: ' + total + ' GW</h2>';			
			};
			
			// redifine the radius of circles
			var radius = d3.scale.sqrt()  
				.domain([0,10])
				.range([(2), (w / 15)]); 

					//Build the pie in D3 create a pie box for this particular state's pie
					
// THIS IS WHERE THE PARTY STARTS!

svg.append("g")
    .attr("class", "bubbles")
  .selectAll("circle")
    .data(topojson.feature(us, us.objects.nerc_boundary).features
    	.sort(function(a, b) { 
    		return b.properties.nerc2050 - a.properties.nerc2050; }))
  .enter().append("circle")
    .attr("class", "negB")
    .attr("transform", function(d) { 
    	var center = path.centroid(d)
    	// center[0] = center[0] + 0;
      return "translate(" + center + ")"; })
    .attr("r", function(d) { 
          return radius(d.properties[redata[i]])
        })
     .attr("text", function(d){ return d.properties.name})
     	.on('mouseover', hoverdata)
     	.on('mouseout', mouseout);

			var margin	= w / 20;
			// var barWidth = w - margin*2 - 50;

			var boxWidth = 40;
			var boxMargin = margin*1.5;
			var boxSegment = 3*boxWidth + (boxMargin);
			var barWidth = w - margin - boxSegment;
			var barPoint = margin + ((barWidth / num)*i)

		} //end bubbles function

// mouseout for tooltip
	function mouseout(d) { 			
			BuildBubbles(width);
	}

	// create the tooltip
	function hoverdata(d) { 


		for (var π = labels.length - 1; π >= 0; π--) {
			if (labels[π].id === d.properties.name) {
				var namew = labels[π].name;				
			};
		};
		
		var gotypename = redata[i].slice(4,8);
		var regiontotal = Math.round(d.properties[redata[i]]*100) / 100;

		if (gotypename < 2020) {
				totalDiv.innerHTML = '<h3>' +namew + '</h3><h2>PSH Installed in ' + gotypename + ": " + regiontotal + 'GW</h2>';			
			} else {
				totalDiv.innerHTML = '<h3>' +namew + '</h3><h2>PSH Projected in ' + gotypename + ": " + regiontotal + 'GW</h2>';			
			};
	}
		

		// begin looping stuff
		var num	= 4; //number of iterations, i.e. years		
		var i = 0; // which year you are on when you start 
		var play;

		var m=1;

		function start() {
			// Starts loop of 'mechanic', 'rebuild', and 'build bubbles' functions first time. 
			ø += 1;
			// console.log('%cSTART FUNCTION: No: '+ ø , 'font-size: 2em; color: GREEN;');
			
			if (play != "undefined") {
				clearInterval(play);	
			};
			
			if (i === num) {
				i -= (num);
			};			
			play = setInterval(mechanic,1000);	
		}

		// PAUSE PLAY AND RELOOP
		function pause() {
			ø += 1;
			// console.log('%cPAUSE/PLAY FUNCTION: No: '+ ø , 'font-size: 2em; color: YELLOW;');

			if (m === 0 && i != num) {				
				// PLAY
				$('.rpt2 span img').attr('src', 'img/mediaButtons_pause.png');				
				m+=1;
				// console.log('PLAY')
				// console.log("this is m: " + m)
				play = setInterval(mechanic,1000);	
				// clearInterval(play);		 
			} else if (m === 1 && i != num) {
				// PAUSE
				$('.rpt2 span img').attr('src', 'img/mediaButtons_play.png');				
				m-=1;
				// play = setInterval(mechanic,1000);
				clearInterval(play);	
				// console.log('you cleared the interval in "pause"')
				// console.log("this is m: " + m)
			} else {
				// REPLAY
				// THIS IS TRIGGERED WHEN YOU HIT THE REPLAY LOOP BUTTON
			
				// console.log('end of loop and rebiginng')
				// 			// console.log("this is m: " + m)

				$('.rpt2 span img').attr('src', 'img/mediaButtons_pause.png'); //restart at the beginning??
				i = -1;
				play = setInterval(mechanic,1000);	
				// here i want to reset the variables to i=0 m=0
			}		
			// console.log('you hit pause at: ' + i)		
		}

		// what to do each iteration
		function mechanic() {			
			ø += 1;
			// console.log('%cMECHANIC FUNCTION: No: '+ ø , 'font-size: 2em; color: silver;');
			
			i += 1;		
			rebuildLoop(i);	
		}

		function rebuildLoop(i) {		
			// Changes classes active in the year bar

			ø += 1;
			// console.log('%cREBUILD FUNCTION: No: '+ ø , 'font-size: 2em; color: PURPLE;');	
			// define this type, then send it in
			// var type = typeArray[k]
			
			// Wish I didn't have to go to the window EVERY time we build the bubbles. 
			// Wish i could do it on every change of window, set "globally" till next change...but alas.
			var width = parseInt(d3.select("#master_container").style("width"));			

			//convaluted way to add next and next and next color to lis.			
			if (i === 0) {
				$('.year').removeClass('activea');
				$('.year:first-child').addClass('activea')							
			} else {
				$('.activea').next().addClass('activea2')
				$('.year').removeClass('activea');
				$('.activea2').addClass('activea');
				$('.activea').removeClass('activea2');
			};


			// $(this).addClass('activea');
			BuildBubbles(width);

			// console.log('rebuildloop is at: ' + i)
			// BuildBubbles(width, type)
			if (i === num) {							
				$('.rpt2 span img').attr('src', 'img/mediaButtons_redo.png');				
				clearInterval(play);		 
				// console.log('you cleared the interval by reaching the end of mechanic')
			}	
		}
		
	  // initial run
	  resize(); 	    
	  start();		  

	  d3.select(window).on('resize', resize); 
	  d3.selectAll("circle.negB").on('mouseover', hoverdata);
	  // d3.selectAll("g.arc").on('click', arctip);      
	  $('.rpt2').click(function(e) {
	  	pause();
	  });
	  // Do something on keystroke of escape....escape == 27.
	  $(document).keyup(function(e) {
		  if (e.keyCode == 27) { 
				d3.selectAll(".tool").remove();		  	
		  }   
		});

	  //function to add commas
		function numberWithCommas(x) {
		  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
}); //end states.json
		}(jQuery));  

