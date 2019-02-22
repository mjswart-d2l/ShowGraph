var curYPos = 0;
var curXPos = 0;
var curDown = false;

function wheelHandler(event) {
    let newscale = event.deltaY > 0 ? scale * 0.95 : scale / 0.95;
    var x = event.clientX;
    var y = event.clientY;
    translatex = scale * x + translatex - newscale * x;
    translatey = scale * y + translatey - newscale * y;
    scale = newscale;
    redraw_nodes(svg, nodesArray, edgesArray);
    event.preventDefault();
}

function mousedownHandler (event) {
    curDown = true;
    curYPos = event.pageY; 
    curXPos = event.pageX; 
    event.preventDefault();
}

function mouseupHandler (event) {
    curDown = false;
}

function mouseMoveHandler (event) {
    if (curDown === true) {
      translatex += event.pageX - curXPos;
      translatey += event.pageY - curYPos;
      curXPos = event.pageX;
      curYPos = event.pageY;
    }
    redraw_nodes(svg, nodesArray, edgesArray);
  }

document.addEventListener('wheel', wheelHandler);
document.addEventListener('mousedown', mousedownHandler);
document.addEventListener('mouseup', mouseupHandler);
document.addEventListener('mousemove', mouseMoveHandler);
