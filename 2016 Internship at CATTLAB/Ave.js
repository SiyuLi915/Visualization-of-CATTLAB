
d3.select('#show').append('div').html('Orange:interstate.');
d3.select('#show').append('div').html('Brown:non-interstate');


// Set the dimensions of the canvas / graph
var marginAve = {top: 30, right: 20, bottom: 30, left: 200},
    widthAve = window.innerWidth - 550 - margin.left - margin.right,
    heightAve = window.innerHeight - 400 - margin.top - margin.bottom;

// Set the ranges of axises
var xAve = d3.scale.linear().range([0, widthAve]);
var yAve = d3.scale.linear().range([heightAve, 0]);

// Define the axes
var xAxisAve = d3.svg.axis().scale(xAve)
    .orient("bottom").ticks(4);//Only four years will be displayed

var yAxisAve = d3.svg.axis().scale(yAve)
    .orient("left");

// Sets a color range
var colorsAve = d3.scale.linear().domain([0,2])
                      .range(['orange','brown'])

// Defines the line
var valuelineAve = d3.svg.line()
    .x(function(d) { return xAve(d.year); })
    .y(function(d) { return yAve(d.value); });

// Adds the svg canvas
var svgAve = d3.select("body")
    .append("svg")
        .attr('class','svg_ave')
        .attr("width", widthAve + marginAve.left + marginAve.right)
        .attr("height", heightAve + marginAve.top + marginAve.bottom)
    .append("g")
        .attr("transform",
              "translate(" + marginAve.left + "," + marginAve.top + ")");

// Adds the tooltip
var toolTipAve = d3.select('body').append('div')
                  .style('position','absolute')
                  .style('padding','0 10px')
                  .style('background','white')
                  .style('opacity',0)

function UpdateDataAve(){
  // Get the data
  //road_type_choice: distinguish interstate and non-interstate files
  //type: distinguish the general and single graphs

  d3.csv('Ave.csv', function(error, data) {
      data.forEach(function(d) {
          d.year = d.year;
          d.value = +d.value;
      });

      // Scale the range of the data
      xAve.domain([2012, 2015]);
      yAve.domain([80, 100]);

      //A nest array to store all the values for each state.

      var dataNestAve = d3.nest()
              .key(function(d){ return d.state;})
              .entries(data);

      dataNestAve.forEach(function(d,i){
          // Assign the color range to lines
          svgAve.append("path")
          .attr("class", "line")
          .attr("d", valuelineAve(d.values))
          .style('stroke', colorsAve(i))

          dot = svgAve.selectAll('dot')
          .data(data)
          .enter().append('circle')
           .attr('r',5)
           .style("fill","#708284")
           .attr('cx',function(d){ return xAve(d.year); })
           .attr('cy',function(d){ return yAve(d.value); })

          .on('mouseover',function(d,i)
            {
                d3.select(this).style('opacity',0.5)
                toolTipAve.style('opacity',1)
                toolTipAve.html(data[i].value);
                toolTipAve.style('left',(d3.event.pageX) + 'px')
                        .style('top',(d3.event.pageY+ 20) + 'px')
            })
            //when mouse is out the graph, changes the opacity back
            .on('mouseout',function(d)
            {
              d3.select(this).transition().delay(150).style('opacity',1)
              svgAve.selectAll(".statelabel")
                    .remove()
                toolTipAve.style('opacity',0  )
          })
    })



      //Add the axises to the graph
      addAxisAve();
  });
}

function addAxisAve(){
    // Add the X Axis
    svgAve.append("g")
        .attr("class", "x1 axis")
        .attr("transform", "translate(0," + heightAve + ")")
        .call(xAxisAve);

    // Add the Y Axis
    svgAve.append("g")
        .attr("class", "y1 axis")
        .call(yAxisAve);
}

//Initiate the graph
UpdateDataAve();
