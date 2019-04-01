function load_and_go() {
    
    load(); 
    
    // show and hide
    document.getElementById('the_form').style.display = "none";
    document.getElementById('my_canvas').style.display = "block";
    document.getElementById('labels_button').style.display = "inline";
    document.getElementById('load_and_go_button').style.display = "none";
    
    do_zoom();

    draw_nodes(svg, nodesArray, edgesArray);
    
    var zoom = d3.zoom();
    go();
}

function do_zoom() {
    svg.call( d3.zoom()
        .scaleExtent([1/10, 10])
        .on ("zoom", zoomed));    
}

function zoomed() {
    scale = d3.event.transform.k * 0.05;
    translatex = d3.event.transform.x;
    translatey = d3.event.transform.y;
    redraw_nodes(svg, nodesArray, edgesArray);
}

var edgesArray = [];
var nodesArray = [];
function load() {
    let form_txt = document.getElementById("tablePairsText").value;
    let lines = form_txt.split( '\n' );
    for (var i=0; i<lines.length; i++) {
        tables = lines[i].split( /\s+/ );
        if (tables.length < 2) {
            continue;
        }
        let edge = {
            first: tables[0],
            second: tables[1]
        };
        edgesArray.push( edge );        
    }
    var tableNames = edgesArray.map( x => x.first );
    tableNames = tableNames.concat( edgesArray.map( x => x.second ) );
    nodesArray = Array.from(new Set(tableNames))
                      .map(name => {
                          return {
                              x: (Math.random() * 1000) / scale, 
                              y: (Math.random() * 700) / scale, 
                              r: 10, 
                              text: name, 
                              vx: 10, 
                              vy: 10 };
                      });
}

var interval = null;
function go() {
    document.getElementById('go_button').style.display = "none";
    document.getElementById('pause_button').style.display = "inline";

    if (interval == null) {
        interval = setInterval(moveStuff, 20);
    } 
}

function pause() {
    document.getElementById('go_button').style.display = "inline";
    document.getElementById('pause_button').style.display = "none";
    
    clearInterval(interval);
    interval = null;
}

function moveStuff() {    
    let nodesDict = {};
    nodesArray.forEach( x => nodesDict[x.text] = x);

    // move nodes based on velocity
    nodesArray.forEach( n => {
        n.vx *= 0.8;
        n.vy *= 0.8;
        if (Math.abs(n.vx) > 100) {
            n.vx *= 100 / Math.abs(n.vx);
        }
        if (Math.abs(n.vy) > 100) {
            n.vy *= 100 / Math.abs(n.vy);
        }        
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
        let force = (distance - 100)*0.005 // spring force
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
            let force = -100000 / (distance * distance) // inverse square law (like charges)
            if (force < -1000000) {
                force = -1000000;
            }
            nodesArray[j].vx += force * deltax / distance;
            nodesArray[i].vx -= force * deltax / distance;
            nodesArray[j].vy += force * deltay / distance;
            nodesArray[i].vy -= force * deltay / distance;     
        }
    }

    redraw_nodes(svg, nodesArray, edgesArray);       
}
