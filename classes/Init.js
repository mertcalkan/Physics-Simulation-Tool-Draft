let bgColor = ""
let objectTypes = ["ball","border"]
let ballTypes = ["polygon", "circle", "star"]
let borderTypes = ["polygon", "circle"]
let trigFunctions = ["sin", "cos", "tan", "cot", "arcsin", "arccos", "arctan", "arccot", "arccos", "arcsec"]
let borders = []
let objects = []
let balls
let circleBalls

function setup() {

}

function draw() {
    background(bgColor)
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
    checkCollisionWithOtherBalls()

}



function startSimulation() {

}


function stopSimulation() {

}


function clickObjects() {
    // implement the clicking of objects here.
}


function recordSimulation() {

}


function applyChanges() {

}


function checkNameDifferences(new_uName, allObj) {
    for (let obj of allObj) {
        if (obj.uName === new_uName) {
            return false;
        }
    }
    return true;
}

function radiusDifferencesBetweenSameBorders(newRadius, ) {
    for (let obj of allObj) {
        if (obj.uName === new_uName) {
            return false;
        }
    }
    return true;
}





function deleteSimulation() {

}

function saveSimulation(key, objArr) {
    const jsonString = JSON.stringify(objArr);
    localStorage.setItem(key, jsonString);
}

function openSavedSimulation(key) {
    const jsonString = localStorage.getItem(key);
    return JSON.parse(jsonString);
}


function detectObject() {

}


function selectRandomFromArray(number, arr) {

}


function objectExists(objType, objSubType, allObj) {
    for (let obj of allObj) {
        if (obj.type == objType && obj.subType == objSubType) {
            return true
        }
    }
    return false;
}

function checkCollisionWithOtherBalls() {
    const allBalls = objects.filter(obj => obj.type === "Ball");
    if (allBalls.length > 1) {
        for (let i = 0; i < allBalls.length; i++) {
            for (let j = i + 1; j < allBalls.length; j++) {
                if (allBalls[i].collideable && allBalls[j].collideable) {
                    if (allBalls[i].subType == "Circle" && allBalls[j].subType == "Circle") {
                        let d = dist(allBalls[i].xPos, allBalls[i].yPos, allBalls[j].xPos, allBalls[j].yPos);
                        if (d <= ballRadius * 2) {
                            let angle = atan2(
                                allBalls[i].yPos - allBalls[j].yPos,
                                allBalls[i].xPos - allBalls[j].xPos
                            );
                            let overlap = ballRadius * 2 - d;
                            let dx = overlap * cos(angle);
                            let dy = overlap * sin(angle);
                            allBalls[i].xPos += dx / 2;
                            allBalls[i].yPos += dy / 2;
                            allBalls[j].xPos -= dx / 2;
                            allBalls[j].yPos -= dy / 2;
                            let tempXSpeed = xSpeedArr[i];
                            let tempYSpeed = ySpeedArr[i];
                            xSpeedArr[i] = xSpeedArr[j];
                            ySpeedArr[i] = ySpeedArr[j];
                            xSpeedArr[j] = tempXSpeed;
                            ySpeedArr[j] = tempYSpeed;
                            strokeArr[i] -= 0.2;
                            strokeArr[j] -= 0.2;
                        }
                    } else if (allBalls[i].subType == "Star" && allBalls[j].subType == "Star") {
                        // will implement logic.
                    } else if (allBalls[i].subType == "Polygon" && allBalls[j].subType == "Polygon") {
                        // will implement logic.
                    }
                }
            }
        }
    }

}