var selectedData = 0;

// The svg
//Height and width of map
var svg = d3.select("#my_dataviz");
  // width = 1200; //+svg.attr("width"),
  // height = 650; //+svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(120)
  //.center([0,20])
  .translate([400,400]);

// Data and color scale
var data = d3.map();
var currentCountry;

//slider
var slider = document.getElementById("mySlider");

// PieChart
const pie_svg = d3.selectAll("#pieChart");

// SortFunctions
let unsorted = (a, b) => 0;
let sortAsc = (a, b) => a.value - b.value;
let sortDesc = (a, b) => b.value - a.value;
let currentSort = unsorted;

//create a tooltip
var tooltip = d3.select("#tooltip")
    .append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden")

//normalise data for better colour scaling
function normalisedata(val, min, max) {
  return (val - min)/(max - min);
}

//mouse functions
function mouseOver(d){
  d3.selectAll(".Country")
    .transition()
    .duration(20)
    .style("opacity", .2)
  d3.select(this)
    .transition()
    .duration(20)
    .style("opacity", 1)
    .style("stroke", "black")
  tooltip
    .style("visibility", "visible")
    .text(myData[selectedData].tooltipText(data, d))
}

function mouseMove(d){
  tooltip.style("top", (event.clientY + 2)+"px").style("left",(event.clientX + 20)+"px");
}

function mouseLeave(d){
  d3.selectAll(".Country")
    .transition()
    .duration(20)
    .style("opacity", 1)
    .style("stroke", "transparent")
  d3.select(this)
    .transition()
    .duration(20)
    .style("stroke", "transparent");
  tooltip
    .style("visibility", "hidden");
}

var asdfasdf;

function mouseClick(e){
    if (data.get(e.properties.name)===undefined){
      d3.select('#dataTable').text("There is no data for " + e.properties.name + ". Select a new country that provides a tooltip value to view detailed information");

    }
    else{
      d3.queue()      
          .defer(d3.csv, "data",  function(d){
            if (e.properties.name == d.Name) {
              currentCountry = d;
            }        
          })
          .await(tableData);
    } 
}

function tableData(error, csvData){
  if (error) {
    console.log("Had an error loading file.");
    return;
  }

//drawing the table
  var sortAscending = true;
  
  //d3.select("#dataTable").selectAll("*").remove();
  d3.select('#dataTable').text(" ");
  var table = d3.select('#dataTable').append('table');

  var dataForCount = Object.keys(currentCountry)
    .map(key => ({
      name: key,
      value: currentCountry[key]
    }));

  var rows = table
    .append('tbody')
    .selectAll('tr')
    .data(dataForCount)
    .enter()
    .append('tr')
  var td = rows
    .selectAll('td')
    .data(function(d, i){ return Object.values(d); })
    .enter()
    .append('td')
    .text(function(d) { 
      return GetPrettyText(d); 
    }); 
}

//data visualization
function refreshData(leData) {
  //Load external data and boot
  selectedData = leData;

  d3.queue()
    .defer(d3.json, "worldTopoData")
    .defer(d3.csv, "data",  function(d){data.set(d.Name, myData[leData].selector(d))})
    .await(ready);
}
refreshData(0)

function ready(error, topo) {
  if (error) {
    console.log("Had an error loading file.");
    return;
  }

  setSliderMax(data.keys().length);

  chartData(data.keys().length, unsorted);
  pieData(data.keys().length);
  
  svg.selectAll("*").remove();

  legend({
    color: d3.scaleSequential(data.values(), myData[selectedData].colorScale),
    title: myData[selectedData].title,

  })

  // Draw the map
  svg
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {   
        return getColour(data.get(d.properties.name) || 0)  
      })
      //map assignments
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", 1)
      .on("mouseover", mouseOver)
      .on("mousemove", mouseMove)
      .on("click", mouseClick)
      .on("mouseleave", mouseLeave);

}

function setSliderMax(maxRange) {
  slider.max = maxRange;
  slider.value = maxRange;
}

function limitResults(value) {
  chartData(value, currentSort);
  pieData(value);
}

//chart
var Aldata;
var gx;
var x;
var y;
var bar;

  xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));
    
  yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());

// update = chart.update(order)
function chartData(maxValue, sortFunc){
 
 let someArray = [];
 data.each(function(d, i) {
  if (d != undefined) {
    someArray.push({key: i, value: d});
    //someArray.push({key: i, value: count});
  }
 });
 Aldata = [...someArray].sort(sortFunc).slice(0, maxValue);

  margin = ({top: 100, right: 100, bottom: 100, left: 100})
  height = 500
  width = screen.width - 1750

  x = d3.scaleBand()
    .domain(Aldata.map(d => d.key))
    .range([margin.left, width - margin.right])
    // .attr("transform", "rotate(-65)")

  y = d3.scaleLinear()
    .domain([0, d3.max(Aldata, d => Math.ceil(d.value))]).nice()
    .range([height - margin.bottom, margin.top])

  d3.selectAll("#chart").selectAll("*").remove();
  const chart_svg = d3.selectAll("#chart")
      .attr("viewBox", [0, 0, width, height]);
  
  bar = chart_svg.append("g")
    .selectAll("rect")
    .data(Aldata)
    .enter().append("rect")
      .on("mouseover", mouseOver)
      .on("mousemove", mouseMove)
      .on("mouseleave", mouseLeave)
      .attr("x", d => x(d.key))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth());


  gx = chart_svg.append("g")
      .call(xAxis)
      .selectAll("text")
        .attr("transform", "rotate(65)")
        .style("text-anchor", "start")
        .attr("x", 9)
        .attr("visibility", function() {
          if (maxValue > 30) {
            return "hidden"
          }
          return "visible"
        })
  
  const gy = chart_svg.append("g")
      .call(yAxis);
}

function sortGraph(sortFunc) {
  currentSort = sortFunc;
  let chart_svg = d3.selectAll("#chart");
  height = 500

    var oldData = [...Aldata];
    var newData = [...Aldata];

    newData.sort(sortFunc);

    x.domain(newData.map(d => d.key));

    const t = chart_svg.transition()
        .duration(250);

    const barwidth = x.bandwidth();

    bar.data(Aldata)
      .order()
      .transition(t)
      .delay((d, i) => i * 20)
      .attr("transform", function(d, i){
        let newPos =  newData.map(e => e.key).indexOf(d.key);
        let oldPos =  oldData.map(e => e.key).indexOf(d.key);
        let translate = barwidth * (newPos - oldPos);
        return `translate(${translate},0)`
      });
}


//PIE!
let stickyText = false;
function pieData(maxValue) {
  //let pieData = d3.csv("population-by-age.csv", d3.autoType);
  let pieCdim = Math.min(window.innerWidth, window.innerHeight);
  //let screendim = Math.min(screen.width, screen.height);
  console.log(pieCdim)
  pie_svg.selectAll("*").remove();
  pie_svg
    .attr("viewBox", [-pieCdim / 2, -pieCdim / 2, pieCdim, pieCdim])
    //.attr("transform", `scale(0.5+${pieCdim / screendim})`)
  

  if(selectedData > 3){
    pie_svg.append("text")
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .style('fill', 'darkOrange')
        .text("Cannot display Pie Chart for this data selection."))
      .call(text => text.append("tspan")
        .attr("x", 0)
        .attr("y", "1.5em")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .style('fill', 'darkOrange')
        .text("Use the buttons to select a new dataset."))
    return;
  }

  let pieData = [];
  
  let count = 0;
  let someArray = [];
   data.each(function(d, i) {
    if (d != undefined && count < maxValue) {
      someArray.push({key: i, value: d});
      //someArray.push({key: i, value: 10});
      count++;
    }
   });
    pieData = [...someArray].sort(sortDesc);

  const radius = Math.min(pieCdim, pieCdim) / 2 * 0.8;

  let arc = d3.arc()
    .innerRadius(radius * 0.68)
    .outerRadius(radius - 1);

  let pie = d3.pie()
    .sort(null)
    .value(d => d.value);

  let arcs = pie(pieData);

  let total = 0;
  pieData.forEach(a => {
    let parsedValue = parseInt(a.value)
    total += parsedValue
  });

  pie_svg.append("g")
    .selectAll("path")
    .data(arcs)
    .enter().append("path")
      .attr("stroke", "white")
      .style("stroke-width", 1)
      .attr("fill", d => getColour(d.data.value))
      .attr("d", arc)
      .on("mouseover", function(d){
        if (!stickyText) {
          appendPieChartText(d, total)
        }
      })
      .on("click", function(d){
          pie_svg
            .selectAll("text").remove()
            //.selectAll("path").remove()

          stickyText = !stickyText
          appendPieChartText(d, total)
 
          if (stickyText) {
            d3.select(this)
              .transition()
              .duration(20)
              .style("stroke", "darkOrange")
              .style('stroke-width', 15)
          }
          else {
            d3.selectAll("path")
              .transition()
              .duration(20)
              .attr("stroke", "white")
              .style("stroke-width", 1)
          }
      })
      .on("mouseleave", function(d) { 
        if (!stickyText) {
          pie_svg.selectAll("text").remove() 
        }
      })
    .append("title")
      .text(d => `${d.data.key}: ${d.data.value.toLocaleString()}`);

  pie_svg.append("g")
      .attr("font-family", "helvetica")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .enter();
};

function getColour(value) {
        let max = Math.ceil(Math.max(...data.values()));
        let min = Math.floor(Math.min(...data.values()));
        let val = normalisedata(value, min, max);
        let norm = Math.pow(val, 1/4);
        let color = myData[selectedData].colorScale(norm);
        return color;
}

function appendPieChartText(d, total) {
  pie_svg.append("text")
            .call(text => text.append("tspan")
                .attr("class", "pieText")
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .text(d.data.key))
            .call(text => text.append("tspan")
                .attr("class", "pieTextinner")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("text-anchor", "middle")
                .attr("fill-opacity", 0.7)
                .text(d.data.value.toLocaleString()))
            .call(text => text.append("tspan")
                .attr("class", "pieTextinner")
                .attr("x", 0)
                .attr("y", "1.7em")
                .attr("text-anchor", "middle")
                .attr("fill-opacity", 0.7)
                .text(`(${parseFloat(d.data.value / total * 100).toFixed(2)}%)`))
}