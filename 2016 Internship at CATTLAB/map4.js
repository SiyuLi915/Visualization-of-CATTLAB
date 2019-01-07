
var getNIyear = ['2012_Non_interstate.csv','2013_Non_interstate.csv','2014_Non_interstate.csv',"2015_Non_interstate.csv"];
var NmapWidth = 400;
var NmapHeight = 300;
var Nprojection=d3.geo.albersUsa()
					.scale(500)
					.translate([NmapWidth/2,NmapHeight/2])
var NIpath = d3.geo.path()
			.projection(Nprojection)

d3.select('#map2').append("text")
						.text("NON-INTERSTATE")
var nonInterstate_map =d3.select("body").select('#map2').append("svg")
    .attr("width", NmapWidth)
    .attr("height", NmapHeight);

function UpdateData2(m){  		

 nonInterstate_map.transition();
d3.json("us1.json", function(error, us1) {
  if (error) throw error;
  var color3 = d3.scale.linear()
                    .domain([70,99])
                    .range(["white","#330000"])

  d3.csv(getNIyear[m],function(error,ndata){

  	  if(error) throw error;
  	
  	  var tooltip2 = d3.select('body').select('#map2').append('div').attr('class','ntooltip')
                  .style('position','absolute')
                  .style('padding','0 10px')
                  .style('background','white')
                  .style('opacity',0)
	  nonInterstate_map.selectAll(".state")
	      .data(topojson.feature(us1, us1.objects.states).features)
	      .enter().append("path")
	       .attr("class", function(d,i){return "nstate"+i})
	       .attr("d", NIpath)
	       .attr("fill",function(d,i){return color3(ndata[i].value)})
	       .style("stroke","white")
	       .style("stroke-width","0.5")
	       .on("mouseover",function(d,i){
	       	if(d3.select(this).style("opacity")!=0){
	       		nonInterstate_map.selectAll(".nstate"+i)
	       			.style("opacity",0.4)
	       		tooltip2.style('opacity',1)
			    tooltip2.html(ndata[i].state + " " + ndata[i].value)
			          .style('left',(d3.event.pageX) + 'px')
			          .style('top',(d3.event.pageY+ 20) + 'px')
	       	}
	       })
	       .on("mouseout",function(d,i){
	       	nonInterstate_map.selectAll(".nstate"+i)
	       		.style("opacity",1)
	       	tooltip2.style('opacity',0)
	       })
	   })
})}


UpdateData2(0);
var mndfe2 = 1
var year2 = 2012;
function showYear(){d3.select('.year')
		.append("text")
          	.text("YEAR:" + year2)
         year2=year2 + 1}
 showYear()
function myFunction2() {
	d3.selectAll('.ntooltip').remove()
	d3.select('#map2').select('svg').transition().duration(30).remove();
	d3.select('.year').select('text').remove();
	UpdateData2(mndfe2);	
	showYear()
	if(mndfe2 < 3)
		{mndfe2 = mndfe2 + 1;
		}
	else 
		{mndfe2 = 0;
			year2 = 2012}	
}


setInterval(myFunction2,1500);