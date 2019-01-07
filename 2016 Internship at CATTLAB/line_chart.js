/*
  Make a line chart by the MAP21 LOTTR data
*/

//Seperates the line charts to interstate graph and Non-interstate graph
var road_type = ['Sample.csv','Sample_NONinterstate.csv'];

//Creates a select element in the HTML, containing the dropdown event
var dropDown = d3.select('#table_container').append('select')
                  .attr('id','state');

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 70},
    width = window.innerWidth - 250 - margin.left - margin.right,
    height = window.innerHeight - 200 - margin.top - margin.bottom;

// Set the ranges of axises
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(4);//Only four years will be displayed

var yAxis = d3.svg.axis().scale(y)
    .orient("left");

// Sets a color range
var colors = d3.scale.linear().domain([0,15,30,45,53])
                      .range(["red","yellow","brown","purple","pink"])

// Defines the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Adds the tooltip
var tooltip_ = d3.select('body').append('div')
                  .style('position','absolute')
                  .style('padding','0 10px')
                  .style('background','white')
                  .style('opacity',0)


var options;
var selectedValue;
var road_type_choice = 0;
d3.select('#state').append('option').text('Select A State').attr('value','Selection')
function UpdateData_line(road_type_choice,type){
  // Get the data

  //road_type_choice: distinguish interstate and non-interstate files
  //type: distinguish the general and single graphs

  d3.csv(road_type[road_type_choice], function(error, data) {
      data.forEach(function(d) {
          d.year = d.year;
          d.value = +d.value;
      });

      //Add both the value and name of states to the dropdown options
      options = dropDown.selectAll('option').data(data).enter().append('option')
      options.text(function(d){return d.state})
            .attr('value',function(d){return d.state;})
            .attr('id',function(d){ return "i" + d.year;})
            .attr('class',function(d){return d.state;});

      //Delete redundent state names in the dropdown manu
      d3.select('#state').selectAll('#i2013').remove();
      d3.select('#state').selectAll('#i2014').remove();
      d3.select('#state').selectAll('#i2015').remove();

      // Scale the range of the data
      x.domain([2012, 2015]);
      y.domain([20, 100]);

      //A nest array to store all the values for each state.

      if(type=="Single") {
          var dataNest = d3.nest()
            .key(function(d){
              if(d.state==selectedValue){ //selectedValue is the value from the dropdown manu
                return d.state;
              }
            })
            .entries(data);
      }

      else{
          var dataNest = d3.nest()
              .key(function(d){ return d.state;})
              .entries(data);
      }

      dataNest.forEach(function(d,i){
          // Assign the color range to lines
          if(type=="Single") {svg.select('path').remove();}

          svg.append("path")
          .attr('id',data[i].state)
          .attr("class", "line")
          .attr('id','svgPath')
          .attr("d", valueline(d.values))
          .style('stroke', colors(i))

          //remove the empty element

          d3.select('g').select("#None").remove()
          d3.select('#state').select('.None').remove()
          //Opacity changing reponses to the mouse movement
          //Add state name to the selected line
          svg.selectAll(".line")

          //When mouse is on the graph, changes the opacity and shows the name
            .on('mouseover',function(d,i)
            {
                d3.select(this).style('opacity',0.5)
                tooltip_.style('opacity',1)
                if(type=="Single")
                  { tooltip_.html(selectedValue) ;}

                else
                  { tooltip_.html(data[i+1].state); }
                    tooltip_.style('left',(d3.event.pageX) + 'px')
                        .style('top',(d3.event.pageY+ 20) + 'px')
            })
            //when mouse is out the graph, changes the opacity back
            .on('mouseout',function(d)
            {
              d3.select(this).transition().delay(150).style('opacity',1)
              svg.selectAll(".statelabel")
                    .remove()
                tooltip_.style('opacity',0  )
            })
          })
      //Add the axises to the graph
      addAxis();
  });
}

function addAxis(){
    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

//Initiate the graph
UpdateData_line(0,"Init");

function SingleState(){

    selectedValue = d3.event.target.value;
    d3.selectAll('#svgPath').remove();
    UpdateData_line(road_type_choice,"Single")
    svg.selectAll('g').remove();

}

//After change the manu
d3.select('#state').on('change',SingleState);



//Switch the graph to non-interstate data
function get_non_interstate_data(){

    road_type_choice = 1;
    d3.selectAll('#svgPath').remove();
    UpdateData_line(road_type_choice,"General");
    svg.selectAll('g').remove();
    addAxis();
}

//switch the graph to interstate data
function get_interstate_data(){

    road_type_choice = 0;
    d3.selectAll('#svgPath').remove();
    UpdateData_line(road_type_choice,"General");
    svg.selectAll('g').remove();
    addAxis();
}





























































































































































































































































































































































