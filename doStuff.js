function doStuff() {
    nodesArray.forEach( n => {
         n.x += n.vx; 
         n.y += n.vy; 
        } );
    
    redraw_nodes(svg, nodesArray, edgesArray);   
}
