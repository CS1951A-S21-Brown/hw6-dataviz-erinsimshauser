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

    let title = svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, -10)`)       // HINT: Place this at the top middle edge of the graph
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text('Top Actor Pairs based on Number of Movies made Together');

    d3.csv("data/actorpairs.csv").then(function (data) {
        var graph = {
            'nodes': [],
            'links': []
        };
        data.forEach(function (d) {
            var status = graph.nodes.some(n => n.name === d.source)
            if (graph.nodes.some(n => n.name === d.source)) {
                i = graph.nodes.findIndex(o => o.name === d.source);
                orig_name = graph.nodes[i].name
                new_count = parseInt(graph.nodes[i].count) + parseInt(d.count)

                graph.nodes[i] = {name: orig_name, count: new_count, group: new_count/4}
            }
            if (graph.nodes.some(n => n.name === d.target)) {
                i = graph.nodes.findIndex(o => o.name === d.target);
                orig_name = graph.nodes[i].name
                new_count = parseInt(graph.nodes[i].count) + parseInt(d.count)

                graph.nodes[i] = {name: orig_name, count: new_count, group: new_count/4}
             }
            if (!graph.nodes.some(n => n.name === d.source)) {
                c = parseInt(d.count)
                graph.nodes.push({name: d.source, count: c, group: c/4})
            }
            
            if (!graph.nodes.some(n => n.name === d.target)) {
                c = parseInt(d.count)
                graph.nodes.push({name: d.target, count: c, group: c/4})
            }
            graph.links.push({ source: d.source, target: d.target, num: d.count })
        });



        let flow = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink()      
                .id(function(d) {return d.name})
                .links(graph.links)
            )
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("center", d3.forceCenter((graph_3_width / 3), graph_3_height / 2))
            .force("x", d3.forceX(graph_3_width / 2).strength(1))
            .force("y", d3.forceY(graph_3_height / 2).strength(1))
            .on("tick", ticked);

            let linkmouseover = function (d) {
                let color_span = `<span style="color: #6667FF;">`;
                let html = `${color_span}${d.num} movies between
                            ${d.source.name} & ${d.target.name}</span>`;
                tooltip.html(html)
                    .style("left", `${(d3.event.pageX)}px`)
                    .style("top", `${(d3.event.pageY) - 30}px`)
                    .style("box-shadow", `2px 2px 5px #669AFF`)
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
            .attr("stroke", "gray")
            .attr("stroke-opacity", 0.5)
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .join("line")
            .attr("stroke-width", 2)
            .on("mouseover", linkmouseover)
            .on("mouseout", linkmouseout);


        let mouseover = function (d) {
            let color_span = `<span style="color: #6667FF;">`;
            let html = `${d.name}</span>`;
            tooltip.html(html)
                .style("left", `${(d3.event.pageX)}px`)
                .style("top", `${(d3.event.pageY) - 30}px`)
                .style("box-shadow", `2px 2px 5px #669AFF`)
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

        let colors = d3.scaleQuantize()
            .domain([0, d3.max(graph.nodes, function(d) { return d.group })])
            .range(["#66FFFE", "#65CCFF", "#669AFF", "#6667FF"]);
        
        
        let node = svg
            .selectAll("circle")
            .data(graph.nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", function(d) {return Math.sqrt(d.count) + d.count/15})
            .attr("fill", function(d) {return colors(d.group) })
            .style("stroke", "gray")
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