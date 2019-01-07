var getYear = ['2012_interstate.csv','2013_interstate.csv','2014_interstate.csv',"2015_interstate.csv"];
var mapWidth = 400
var mapHeight = 300

var projection=d3.geo.albersUsa()
					.scale(500)
					.translate([mapWidth/2,mapHeight/2])
var path = d3.geo.path()
			.projection(projection)

d3.select('#map1').append("text")
						.text("INTERSTATE")
var interstate_map =d3.select("body").select('#map1').append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);


function UpdateData1(m){  		
 interstate_map.transition();
d3.json("us1.json", function(error, us1) {
  if (error) throw error;
  var color3 = d3.scale.linear()
                    .domain([70,99])
                    .range(["white","#330000"])
  d3.csv(getYear[m],function(error,data){

  	  if(error) throw error;
  	
  	  var tooltip1 = d3.select('body').select('#map1').append('div').attr('class','tooltip')
                  .style('position','absolute')
                  .style('padding','0 10px')
                  .style('background','white')
                  .style('opacity',0)
	  interstate_map.selectAll(".state")
	      .data(topojson.feature(us1, us1.objects.states).features)
	      .enter().append("path")
	       .attr("class", function(d,i){return "state"+i})
	       .attr("d", path)
	       .attr("fill",function(d,i){return color3(data[i].value)})
	       .style("stroke","white")
	       .style("stroke-width","0.5")
	       .on("mouseover",function(d,i){
	       	if(d3.select(this).style("opacity")!=0){
	       		interstate_map.selectAll(".state"+i)
	       			.style("opacity",0.4)
	       		tooltip1.style('opacity',1)
			    tooltip1.html(data[i].state + " " + data[i].value)
			          .style('left',(d3.event.pageX) + 'px')
			          .style('top',(d3.event.pageY+ 20) + 'px')
	       	}
	       })
	       .on("mouseout",function(d,i){
	       	interstate_map.selectAll(".state"+i)
	       		.style("opacity",1)
	       	interstate_map.selectAll("text")
	       		.remove()
	       	tooltip1.style('opacity',0)
	       })
	   })
})}


UpdateData1(0);
var mndfe = 1

function myFunction() {
	d3.selectAll('.tooltip').remove()
	d3.select('#map1').select('svg').transition().duration(30).remove();

	UpdateData1(mndfe);	

	if(mndfe < 3)
		{mndfe = mndfe + 1;
		}
	else 
		{mndfe = 0;
			year = 2012}	
}


setInterval(myFunction,1500);