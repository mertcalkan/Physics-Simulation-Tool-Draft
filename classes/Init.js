
let bgColor = ""
let ballTypes = ["polygon", "circle" , "star"]
let borderTypes = ["polygon" , "circle" ]
let trigFunctions = ["sin" , "cos", "tan"  , "cot" , "arcsin", "arccos", "arctan", "arccot" , "arccos", "arcsec" ]
let borders = []
let objects = []
let balls 
let circleBalls
function setup(){
   
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

}



function startSimulation(){

}


function stopSimulation(){

}


function clickObjects(){
    // implement the clicking of objects here.
}


function recordSimulation(){
    
}


function applyChanges(){

}


function checkNameDifferences(new_uName, allObj) {
    for (let obj of allObj) {
        if (obj.uName === new_uName) {
            return false;
        }
    }
    return true;
}

function radiusDifferencesBetweenSameBorders(newRadius,){
    for (let obj of allObj) {
        if (obj.uName === new_uName) {
            return false;
        }
    }
    return true;
}





function deleteSimulation(){

}

function saveSimulation(key,objArr){
    const jsonString = JSON.stringify(objArr);
    localStorage.setItem(key, jsonString);
}

function openSavedSimulation(key){
    const jsonString = localStorage.getItem(key);
    return JSON.parse(jsonString);
}


function detectObject(){
    
}


function selectRandomFromArray(number , arr){

}


function objectExists(objType , objSubType , allObj){
    for (let obj of allObj) {
        if (obj.type == objType && obj.subType == objSubType) {
            return true
        }
    }
    return false;
}