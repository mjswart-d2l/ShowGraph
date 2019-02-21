var interval = null;

function doStuff() {
    if (interval == null) {
        interval = setInterval(moveStuff, 20);
    } else {
        clearInterval(interval);
        interval = null;
    }
}

function moveStuff() {    
    let nodesDict = {};
    nodesArray.forEach( x => nodesDict[x.text] = x);

    // move nodes based on velocity
    nodesArray.forEach( n => {
        n.vx *= 0.9;
        n.vy *= 0.9;
        n.x += n.vx; 
        n.y += n.vy; 
    } );

    // change velocity based on springs
    edgesArray.forEach( e => {
        let firstx = nodesDict[e.first].x;
        let firsty = nodesDict[e.first].y;
        let secondx = nodesDict[e.second].x;
        let secondy = nodesDict[e.second].y;
        let deltax = firstx-secondx;
        let deltay = firsty-secondy;
        let distance = Math.sqrt(deltax*deltax + deltay*deltay);
        let force = (distance - 100)*0.01 // spring force
        nodesDict[e.second].vx += force * deltax / distance;
        nodesDict[e.first].vx -= force * deltax / distance;
        nodesDict[e.second].vy += force * deltay / distance;
        nodesDict[e.first].vy -= force * deltay / distance; 
    } );
    
    // everyone repel eachother
    for(let i = 0; i < nodesArray.length; i++) {
        for(let j = i+1; j < nodesArray.length; j++) {
            let firstx = nodesArray[i].x;
            let firsty = nodesArray[i].y;
            let secondx = nodesArray[j].x;
            let secondy = nodesArray[j].y;
            let deltax = firstx-secondx;
            let deltay = firsty-secondy;
            let distance = Math.sqrt(deltax*deltax + deltay*deltay);
            let force = -10000 / (distance * distance) // inverse square law (like charges)
            if (force < -100000) {
                force = -100000;
            }
            nodesArray[j].vx += force * deltax / distance;
            nodesArray[i].vx -= force * deltax / distance;
            nodesArray[j].vy += force * deltay / distance;
            nodesArray[i].vy -= force * deltay / distance;     
        }
    }

    redraw_nodes(svg, nodesArray, edgesArray);       
}