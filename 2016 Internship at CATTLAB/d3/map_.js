//Creates different data files
//var dataFile_NonInterstate = ['2012_Non_interstate.csv','2013_Non_interstate.csv','2014_Non_interstate.csv',"2015_Non_interstate.csv"];
//var dataFile_Interstate = ['2012_interstate.csv','2013_interstate.csv','2014_interstate.csv',"2015_interstate.csv"];

var dataFile_ = [['2012_Non_interstate.csv','2012_interstate.csv'],['2013_Non_interstate.csv'.'2013_interstate.csv'],
				 ['2014_Non_interstate.csv','2014_interstate.csv'],["2015_Non_interstate.csv","2015_interstate.csv"]];

//Defines the map size
var mapWidth = 400;
var mapHeight = 300;
var projection = d3.geo.albersUsa().scale(500).translate([mapWidth/2,mapHeight/2]);

//Creates a path for the map
var path = d3.geo.path().projection(projection)

//Shows the names for the maps
d3.select('#map1').append('text').text('INTERSTATE');
d3.select('#map2').append("text").text("NON-INTERSTATE")

//Draws the maps
var map
map[0] = d3.select('body')
	.select('#map1')
	.append('svg')
	.attr("width", mapWidth)
	.attr("height", mapHeight);

map[1] = d3.select('body')
	.select('#map2')
	.append('svg')
	.attr("width", mapWidth)
	.attr("height", mapHeight);

//Creates the color for maps
var color = d3.scale.linear().domain([70,99]).range(["white","#330000"])

function UpdateData(data_year,data_RT)
{
	d3.json("us1.json", function(error, us1)
	{
		if (error) throw error;
		
		d3.csv(dataFile_[data_year][data_RT],function(error,data)
		{
			if (error) throw error;

			map[0].selectAll(".state")
	      	.data(topojson.feature(us1, us1.objects.states).features)
	      	.enter().append("path")
	       	.attr("class", function(d,i){return "state"+i})
	       	.attr("d", path)
	       	.attr("fill",function(d,i){return color(data[i].value)})
	       	.style("stroke","white")
	       	.style("stroke-width","0.5")
	       	.on("mouseover",function(d,i){
	       		if(d3.select(this).style("opacity")!=0){
	       		map[0].selectAll(".state"+i)
	       			.style("opacity",0.4)
	       		}
	       	})
	       	.on("mouseout",function(d,i){
	       		map[0].selectAll(".state"+i).style("opacity",1)
	       		map[0].selectAll("text").remove()
	       	})

	       	map[1].selectAll(".state")
	      	.data(topojson.feature(us1, us1.objects.states).features)
	      	.enter().append("path")
	       	.attr("class", function(d,i){return "state"+i})
	       	.attr("d", path)
	       	.attr("fill",function(d,i){return color(data[i].value)})
	       	.style("stroke","white")
	       	.style("stroke-width","0.5")
	       	.on("mouseover",function(d,i){
	       		if(d3.select(this).style("opacity")!=0){
	       		map[1].selectAll(".state"+i)
	       			.style("opacity",0.4)
	       		}
	       	})
	       	.on("mouseout",function(d,i){
	       		map[1].selectAll(".state"+i).style("opacity",1)
	       		map[1].selectAll("text").remove()
	       	})
		})
	})
}

UpdateData(0,0);