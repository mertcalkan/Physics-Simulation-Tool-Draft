function setup(){
    
}
function draw() {
    // display and background settings! 
    // user can set up their image to fit in to canvas.
    // scale things before display and when we will record , the sketch will be display as original rate(1)
    // initing borders and setting up 

    for (let border of borders) {
        border.display();
        if (!(border.subType !== "Circular" && border.type !== "Maze")) {
            border.update();
        }
        if (border.subType === "Polygonal" && border.type === "Maze") {
            let currentGap = 100 + (border.radius * (2 * sin(PI / border.sides)) - 150);
            border.checkPolygonEdges(currentGap);
        } else if (border.subType === "Polygonal" && border.type === "Border") {
            let currentGap = 100 + (border.radius * (2 * sin(PI / border.sides)));
            border.checkPolygonEdges(currentGap);
        }
    }

}