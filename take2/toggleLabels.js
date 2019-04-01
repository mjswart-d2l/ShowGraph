var showLabels = false;

function toggle_labels() {
    showLabels = !showLabels;
    if (showLabels) {
        let labels = svg.selectAll('text')
                        .data(nodesArray)
                        .enter()
                        .append('text');
        update_labels(labels);
    } else {
        svg.selectAll('text')
           .remove();        
    }        
}