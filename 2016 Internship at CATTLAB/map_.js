//Creates different data files
var dataFile_ = [['2012_Non_interstate.csv','2012_interstate.csv'],['2013_interstate.csv','2013_Non_interstate.csv'],
				 ['2014_Non_interstate.csv','2014_interstate.csv'],["2015_interstate.csv","2015_Non_interstate.csv"]];

//Defines the map size
var mapWidth = window.innerWidth / 2 - 250;
var mapHeight = window.innerHeight / 2 - 100;
var projection = d3.geo.albersUsa().scale(500).translate([mapWidth/2,mapHeight/2]);

//Creates a path for the map
var path = d3.geo.path().projection(projection)

//Shows the names for the maps
d3.select('#map1').append('text').text('INTERSTATE');
d3.select('#map2').append("text").text("NON-INTERSTATE")

//Draws the maps
var mapLeft
var mapRight
var map_left
var map_right

//Useful variables
var year = 2012;
var countLoop = 1;
var countyear = 0;

mapLeft = d3.select('body').select('#map1').append('svg').attr("width", mapWidth).attr("height", mapHeight);
mapRight = d3.select('body').select('#map2').append('svg').attr("width", mapWidth).attr("height", mapHeight);

//Creates the color for maps
var color = d3.scale.linear().domain([70,99]).range(["white","#330000"])

//Using variables to create two different maps
function UpdateData(data_year,data_RT)
{	
	//change the map by year
	mapLeft.transition()
	mapRight.transition()

	//create tooptip to show the value and the states
	var tooltip_left = tooltipMaker("#map1",'tooltip_left');
	var tooltip_right = tooltipMaker("#map2",'tooltip_right');

	//make maps
	d3.json("us1.json", function(error, us1)
	{
		if (error) throw error;
		
		//choose document from the two dimensional array dataFile, create the first map on the right
		d3.csv(dataFile_[data_year][data_RT],function(error,data)
		{
			if (error) throw error;
			
			map_right = mapRight.selectAll(".state")
			//using method and variables to create the map for a certain road type and year
	      	fillStates(map_right,us1,data)
	      	//Allow interactive activities with mouse
	       	mouseOn_Out(mapRight,map_right,tooltip_right,data)
		})
		//create the second map on the left
		d3.csv(dataFile_[data_year][(data_RT+1)%2],function(error,data)
		{
			if (error) throw error;

			map_left = mapLeft.selectAll(".state")
	      	fillStates(map_left,us1,data)
	       	mouseOn_Out(mapLeft,map_left,tooltip_left,data)
		})
	})
}

//the function that makes tooltip
function tooltipMaker(map_id,tooltipNumber)
{
	var tooltip = d3.select('body').select(map_id).append('div').attr('class',tooltipNumber)
                  .style('position','absolute')
                  .style('padding','0 10px')
                  .style('background','white')
                  .style('opacity',0)
    return tooltip;
}

//the function that put all the states with different color
function fillStates(mapAttrName,us1,data)
{
	mapAttrName = mapAttrName.data(topojson.feature(us1, us1.objects.states).features)
		      	.enter().append("path")
		       	.attr("class", function(d,i){return "state"+i})
		       	.attr("d", path)
		       	.attr("fill",function(d,i){return color(data[i].value)})
		       	.style("stroke","white")
		       	.style("stroke-width","0.5")
	map_left = mapAttrName
	map_right = mapAttrName
}

//a function that uses transition to select certain states on the map and show the value and name
function mouseOn_Out(mapName,mapAttrName,tooltip,data)
{
	mapAttrName.on("mouseover",function(d,i){
	       		if (d3.select(this).style("opacity")!=0)
	       		{
	       			mapName.selectAll(".state"+i)
	       				.style("opacity",0.4) //use different opacity to indicate selected states
	       			tooltip.style('opacity',1)
			    	tooltip.html(data[i].state + " " + data[i].value) //use tooptip to show value
			          .style('left',(d3.event.pageX) + 'px')
			          .style('top',(d3.event.pageY+ 20) + 'px')
		       	}

		       	})
		       	.on("mouseout",function(d,i){
		       		mapName.selectAll(".state"+i).style("opacity",1)
		       		mapName.selectAll("text").remove()
		       		tooltip.style('opacity',0)
		       	})
}

//show the year on website
function showYear()
{
	d3.select('.year')
		.append("text")
      	.text("YEAR:" + year)
    year ++;
} 

UpdateData(0,0);
showYear();

//let the maps automatically change the color according to the value in different years
function loopOver()
{
	d3.selectAll('.tooltip_left').remove()
	d3.selectAll('.tooltip_right').remove()
	d3.select('#map1').select('#map2').selectAll('svg').transition().duration(30).remove();
	d3.select('#map1').selectAll('svg').transition().duration(30).remove();
	d3.select('.year').select('text').remove();
	UpdateData(countLoop,countLoop%2);
	showYear();
	if(countLoop < 3) {	countLoop++; }
	else {	countLoop = 0; year = 2012;	}
}

setInterval(loopOver,1500); //the map will change every 1.5 seconds