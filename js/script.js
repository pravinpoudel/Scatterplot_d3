var global_dataset;
var x_scaleplot, y_scaleplot, xAxis, yAxis;
const SVG_HEIGHT = 600;
const SVG_WIDTH = 600;
const LEFT_PADDING = 80;
const BOTTOM_PADDING = 70;
const RIGHT_PADDING = 30;
const TOP_PADDING = 45;

function file_load() {
  var data = [];
  d3.json("https://next.json-generator.com/api/json/get/V1OqfcoK_")
    .then(function (dataset) {
      dataset.forEach((d, i) => {
        data.push({
          age: +d.age,
          balance: +Number(d.balance.replace(/[^0-9.-]+/g, "")),
          name: d.name.first + " " + d.name.last,
        });
      });
      global_dataset = data;
      console.log(data);
      x_scaleplot = build_xscale(data);
      y_scaleplot = build_yscale(data);
      build_xaxis();
      build_yaxis();
      add_labels();
      draw_circles(data);
    })
    .catch(() => console.log("could not load a file"));
}

function draw_circles(dataset) {
  d3.select("svg")
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => x_scaleplot(d.age))
    .attr("cy", (d) => x_scaleplot(d.balance))
    .attr("r", 5)
    .attr("fill", "black")
    .attr("class", (d) => d.name);
  console.log("finished");
}
function build_xscale(dataset) {
  var span = d3.extent(dataset, (d) => d.age);
  // var maximum = d3.max(dataset, (d) => d.age);
  var scalepadding = (span[1] - span[0]) * 0.1;
  return d3
    .scaleLinear()
    .domain([span[0] - scalepadding, span[1] + scalepadding])
    .rangeRound([LEFT_PADDING, SVG_WIDTH - RIGHT_PADDING]);
}

function build_yscale(dataset) {
  var min = d3.min(dataset, (d) => d.balance);
  var max = d3.max(dataset, (d) => d.balance);
  var scalepadding = (max - min) * 0.1;
  console.log(SVG_HEIGHT - BOTTOM_PADDING, TOP_PADDING);
  return d3
    .scaleLinear()
    .domain([min - scalepadding, max + scalepadding])
    .rangeRound([SVG_HEIGHT - BOTTOM_PADDING, TOP_PADDING]);
}

function add_labels() {
  d3.select("svg")
    .append("text")
    .attr("transform", "translate(290, 575)")
    .text("Age");

  d3.select("svg")
    .append("text")
    .attr("transform", "translate(30, 300) rotate(-90)")
    .text("Balance");
}
function build_xaxis() {
  var translate_string = "translate(0," + (SVG_HEIGHT - BOTTOM_PADDING) + ")";
  xAxis = d3.axisBottom().scale(x_scaleplot);
  d3.select("svg")
    .append("g")
    .attr("transform", translate_string)
    .attr("id", "xaxis")
    .call(xAxis);
}

function build_yaxis() {
  var translate_string = "translate(" + LEFT_PADDING + ",0)";
  yAxis = d3.axisLeft().scale(y_scaleplot);
  d3.select("svg")
    .append("g")
    .attr("transform", translate_string)
    .attr("id", "yaxis")
    .call(yAxis);
}

function lnx(xcoord) {
  d3.select("svg")
    .append("line")
    .attr("x1", xcoord)
    .attr("y1", 0)
    .attr("x2", xcoord)
    .attr("y2", 600)
    .attr("stroke", "green")
    .attr("stroke-width", 2);
}

function lny(ycoord) {
  d3.select("svg")
    .append("line")
    .attr("x1", 0)
    .attr("y1", ycoord)
    .attr("x2", 600)
    .attr("y2", ycoord)
    .attr("stroke", "green")
    .attr("stroke-width", 2);
}

function circle(x, y) {
  d3.select("svg")
    .append("circle")
    .attr("cx", x_scaleplot(x))
    .attr("cy", y_scaleplot(y))
    .attr("r", 5)
    .attr("fill", "black");
}
function clean_data(d) {
  console.log("i am here");
  let balance = d.balance;
  balance = balance.splice(1);
  return { age: +d.age, balance: +balance };
}

file_load();
