function draw_nodes(svg, nodesArray, edgesArray)
{
    var nodesDict = {};
    nodesArray.forEach( x => nodesDict[x.text] = x);

    //edge
    let lines = svg.selectAll('line')
                   .data(edgesArray)
                   .enter()
                   .append('line');
    update_lines( lines, nodesDict );
    
    // node
    let nodes = svg.selectAll('circle')
                   .data(nodesArray)
                   .enter()
                   .append('circle');
    update_nodes( nodes );

    // label
    let labels = svg.selectAll('text')
                    .data(nodesArray)
                    .enter()
                    .append('text');
    update_labels( labels );
}

function redraw_nodes(svg, nodesArray, edgesArray) {
    let nodesDict = {};
    nodesArray.forEach( x => nodesDict[x.text] = x);

    // edges
    let lines = svg.selectAll('line')
                   .data(edgesArray);
    update_lines( lines, nodesDict );
    
    // node
    let nodes = svg.selectAll('circle')
                   .data(nodesArray);
    update_nodes( nodes );

    // label
    let labels = svg.selectAll('text')
                    .data(nodesArray);
    update_labels( labels );
}

function update_nodes (nodes) {
    nodes.attrs({
        cx: d => d.x,
        cy: d => d.y,
        r: d => d.r,
        fill: 'green'
    });
}

function update_labels (labels) {
    labels.text(d => d.text)
    .attrs({
        x: (d) => d.x,
        y: (d) => d.y + 5
    });
}

function update_lines ( lines, nodesDict ) {
    lines.attrs({
        x1: e => nodesDict[e.first].x,
        y1: e => nodesDict[e.first].y,
        x2: e => nodesDict[e.second].x,
        y2: e => nodesDict[e.second].y,
        style: "stroke:red;stroke-width:5"
    });
}