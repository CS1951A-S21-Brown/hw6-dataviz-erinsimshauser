(function () {
    // TODO: Set up SVG object with width, height and margin
    let svg = d3.select("#graph2")      // HINT: div id for div containing scatterplot
        .append("svg")
        .attr("width", graph_1_width)     // HINT: width
        .attr("height", graph_1_height)     // HINT: height
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

    // Set up reference to tooltip
    let tooltip = d3.select("#graph2")     // HINT: div id for div containing scatterplot
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    /*
        Create tooltip as a div right underneath the SVG scatter plot.
        Initially tooltip is invisible (opacity 0). We add the tooltip class for styling.
     */



    // TODO: Load the billboard CSV file into D3 by using the d3.csv() method
    d3.csv("data/duration.csv").then(function (data) {
        // TODO: Filter the data for songs of a given artist (hard code artist name here)
        // TODO: Nest the data into groups, where a group is a given song by the artist
        // let nestedData = d3.nest()
        //     .key(function(d) { return d.song })
        //     .entries(data);
        /*
            HINT: The key() function is used to join the data. We want to override the default key
            function to use the artist song. This should take the form of an anonymous function
            that returns the song corresponding to a given data point.
         */
        data = data.sort(function (a, b) { return a.release_year - b.release_year })
        console.log(data)
        // TODO: Get a list containing the min and max years in the filtered dataset
        let extent = d3.extent(data, function (d) { return Date.parse(d.release_year); });
        /*
            HINT: Here we introduce the d3.extent, which can be used to return the min and
            max of a dataset.

            We want to use an anonymous function that will return a parsed JavaScript date (since
            our x-axis is time). Try using Date.parse() for this.
         */

        // TODO: Create a time scale for the x axis
        let x = d3.scaleTime()
            .domain(extent)
            .range([0, graph_1_width - margin.left - margin.right]);
        console.log(x.domain())

        // TODO: Add x-axis label
        svg.append("g")
            .attr("transform", `translate(0, ${graph_1_height - margin.top - margin.bottom})`)       // HINT: Position this at the bottom of the graph. Make the x shift 0 and the y shift the height (adjusting for the margin)
            .call(d3.axisBottom(x));
        // HINT: Use the d3.axisBottom() to create your axis

        //let extenty = d3.extent(data, function (d) { return d.avg; });

        // TODO: Create a linear scale for the y axis
        let y = d3.scaleLinear()
            .domain([240, 0])
            .range([0, graph_1_height - margin.top - margin.bottom]);
        console.log(y.domain())
        /*
            HINT: The domain should be an interval from 0 to the highest position a song has been on the Billboard
            The range should be the same as previous examples.
         */

        // TODO: Add y-axis label
        svg.append("g")
            .call(d3.axisLeft(y));

        // Create a list of the groups in the nested data (representing songs) in the same order
        //let groups = nestedData.map(function(d) { return d.key });

        // Mouseover function to display the tooltip on hover
        let mouseover = function (d) {
            let color_span = `<span style="color: #669AFF;">`;
            let html = `Year: ${d.release_year}<br/>
                    Average Duration: ${color_span}${d.avg}</span>`;       // HINT: Display the song here

            // Show the tooltip and set the position relative to the event X and Y location
            tooltip.html(html)
                .style("left", `${(d3.event.pageX)}px`)
                .style("top", `${(d3.event.pageY)  - 50}px`)
                .style("box-shadow", `2px 2px 5px #669AFF`)    // OPTIONAL for students
                .transition()
                .duration(200)
                .style("background",'white')
                .style("padding", "5px")
                .style("opacity", 0.9);
        };

        //Mouseout function to hide the tool on exit
        let mouseout = function (d) {
            // Set opacity back to 0 to hide
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                // .curve(d3.curveBasis) // Just add that to have a curve instead of segments
                .x(function (d) { return x(Date.parse(d.release_year)) })
                .y(function (d) { return y(d.avg) })
            )

        // Creates a reference to all the scatterplot dots
        let dots = svg.selectAll("dot").data(data);

        // TODO: Render the dot elements on the DOM
        dots.enter()
            .append("circle")
            .style("fill", "#669AFF")
            .attr("cx", function (d) { return x(Date.parse(d.release_year)); })      // HINT: Get x position by parsing the data point's date field
            .attr("cy", function (d) { return y(d.avg); })      // HINT: Get y position with the data point's position field
            .attr("r", 4)       // HINT: Define your own radius here
            .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", mouseout);

        // Add x-axis label
        svg.append("text")
            .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                        ${(graph_1_height - margin.top - margin.bottom) + 30})`)       // HINT: Place this at the bottom middle edge of the graph
            .style("text-anchor", "middle")
            .text("Release Year");

        // Add y-axis label
        svg.append("text")
            .attr("transform", `translate(-110, ${(graph_1_height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph
            .style("text-anchor", "middle")
            .text("Average Duration (mins)");
        // Add chart title
        svg.append("text")
            .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)       // HINT: Place this at the top middle edge of the graph
            .style("text-anchor", "middle")
            .style("font-size", 15)
            .text('Average Movie Duration over the Years');
    });


    /**
     * Filters the given data to only include songs by the given artist
     */
    function filterData(data, artist) {
        return data.filter(function (a) { return a.artist === (artist); });
    }
})();
