(function () {

    let svg = d3.select("#graph3")
        .append("svg")
        .attr("width", graph_3_width)     // HINT: width
        .attr("height", graph_3_height)    // HINT: height
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

    let tooltip = d3.select("#graph3")     // HINT: div id for div containing scatterplot
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.csv("data/actorpairs.csv").then(function (data) {
        //array of nodes
        var graph = {
            'nodes': [],
            'links': []
        };
        data.forEach(function (d) {
            
            //check if node is present if not add that in the array to get unique nodes.
            if (graph.nodes.indexOf(d.source.trim()) < 0) {
                //sorce node not there so add
                graph.nodes.push(d.source.trim())
            }
            if (graph.nodes.indexOf(d.target.trim()) < 0) {
                //target node not there so add
                graph.nodes.push(d.target.trim())
            }
            //link to map the nodes with its index.
            graph.links.push({ source: graph.nodes.indexOf(d.source.trim()), target: graph.nodes.indexOf(d.target.trim()), num: d.count, pair1: d.source, pair2: d.target })
        });
        graph.nodes = graph.nodes.map(function (n) {
            return { name: n }
        })

        //console.log(graph)

        let flow = d3.forceSimulation(graph.nodes)                 // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink()                               // This force provides links between nodes
                // This provide  the id of a node
                .links(graph.links)
                .distance(50).strength(1)                                 // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-500))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", d3.forceCenter((graph_3_width / 4), graph_3_height / 2))     // This force attracts nodes to the center of the svg area
            .force("x", d3.forceX(graph_3_width / 10).strength(1))
            .force("y", d3.forceY(graph_3_height / 2).strength(1))
            .on("tick", ticked);

            let linkmouseover = function (d) {
                let color_span = `<span style="color: #6667FF;">`;
                let html = `${color_span}${d.num} movies between
                            ${d.pair1} & ${d.pair2}</span>`;       // HINT: Display the song here
    
                // Show the tooltip and set the position relative to the event X and Y location
                tooltip.html(html)
                    .style("left", `${(d3.event.pageX)}px`)
                    .style("top", `${(d3.event.pageY) - 30}px`)
                    .style("box-shadow", `2px 2px 5px #669AFF`)    // OPTIONAL for students
                    .transition()
                    .duration(200)
                    .style("background", 'white')
                    .style("padding", "5px")
                    .style("opacity", 0.9);
            };
    
            //Mouseout function to hide the tool on exit
            let linkmouseout = function (d) {
                // Set opacity back to 0 to hide
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            };

        let link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.3)
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .join("line")
            .attr("stroke-width", 3)
            .on("mouseover", linkmouseover) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", linkmouseout);


        let mouseover = function (d) {
            let color_span = `<span style="color: #6667FF;">`;
            let html = `${d.name}</span>`;       // HINT: Display the song here

            // Show the tooltip and set the position relative to the event X and Y location
            tooltip.html(html)
                .style("left", `${(d3.event.pageX)}px`)
                .style("top", `${(d3.event.pageY) - 30}px`)
                .style("box-shadow", `2px 2px 5px #669AFF`)    // OPTIONAL for students
                .transition()
                .duration(200)
                .style("background", 'white')
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

        let node = svg
            .selectAll("circle")
            .data(graph.nodes)
            .enter()
            .append("circle")
            //.call(drag(simulation))
            .attr("class", "node")
            .attr("r", 5)
            .style("fill", "#6667FF")
            .style("stroke", "black")
            .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", mouseout);


        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        }
    });
})();