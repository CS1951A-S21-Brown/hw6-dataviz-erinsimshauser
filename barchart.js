const NUM_EXAMPLES = 20;
// TODO: Set up SVG object with width, height and margin
/*
    HINT: Our first call to select will select the id of the div in HTML where we want to insert our barplot

    HINT: To add a margin to your svg graph, add the attribute
    attr("transform", "translate(x, y)"), where x is the left margin
    and y is the top margin (defined in d3_lab.html). To access a variable
    defined in the HTML file, you can use the ${variable} notation.
 */
// TODO: Set up SVG object with width, height and margin
let filenames = ["data/genreall.csv", "data/genremovie.csv", "data/genretv.csv"];
let currfile = "data/genreall.csv"
let currcomp = desc

let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

// TODO: Create a linear scale for the x axis (number of occurrences)
let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);  // Improves readability
/*
    Here we will create global references to the x and y axis with a fixed range.
    We will update the domain of the axis in the setData function based on which data source
    is requested.
 */

// Set up reference to count SVG group
let countRef = svg.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label = svg.append("g");

// TODO: Add x-axis label
svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.right - margin.left) /2}, 300)`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Count");
// Since this text will not update, we can declare it outside of the setData function


// TODO: Add y-axis label
let y_axis_text = svg.append("text")
    .attr("transform", `translate(-160, ${(graph_1_height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle");

// TODO: Add chart title
let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, -10)`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);
/*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
 */


function setData() {
    console.log("hi")
    
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv(currfile).then(function(data) {
        
        // TODO: Clean and strip desired amount of data for barplot
        data = cleanData(data, currcomp, NUM_EXAMPLES);

        // TODO: Update the x axis domain with the max count of the provided data
        x.domain([0, d3.max(data, function(d) {return parseInt(d.count)})]);

        // TODO: Update the y axis domains with the desired attribute
        y.domain(data.map(function(d) { return d.genre; }));
        // HINT: Use the attr parameter to get the desired attribute for each data point

        // TODO: Render y-axis label
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        /*
            This next line does the following:
                1. Select all desired elements in the DOM
                2. Count and parse the data values
                3. Create new, data-bound elements for each data value
         */
        let bars = svg.selectAll("rect").data(data);

        // TODO: Render the bar elements on the DOM
        /*
            This next section of code does the following:
                1. Take each selection and append a desired element in the DOM
                2. Merge bars with previously rendered elements
                3. For each data point, apply styling attributes to each element

            Remember to use the attr parameter to get the desired attribute for each data point
            when rendering.
         */
        let color = d3.scaleOrdinal()
            .domain(data.map(function(d) { return d.genre }))
            .range(d3.quantize(d3.interpolateHcl("#6667FF", "#669AFF"), NUM_EXAMPLES));
        
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color(d.genre) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
            .attr("x", x(0))
            .attr("y", function(d) {return y(d.genre)})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("width", function(d) {return x(parseInt(d.count))})
            .attr("height",  y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

        /*
            In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
            bar plot. We will be creating these in the same manner as the bars.
         */
        let counts = countRef.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d) {return x(d.count) + 10})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function(d) {return y(d.genre) + 10 })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .style("font-size", "12px")
            .text(function(d) {return d.count});           // HINT: Get the count of the artist

        y_axis_text.text("Genre");
        console.log(y.domain())
        console.log(y.range())
        console.log(x.domain())
        console.log(x.range())
        title.text("Number of Titles per Genre on Netflix");

        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();
    });
}

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
function cleanData(data, comparator, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    sort_data = data.sort(comparator)
    return sort_data.slice(0, numExamples)
}

function asc(a, b) {
    return a.count - b.count
}

function desc(a, b) {
    return b.count - a.count
}

setData()

function setFile(i) {
    currfile = filenames[i]
}

function setComp(i) {
    currcomp = i
}


