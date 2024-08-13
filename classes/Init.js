let bgColor = ""
let objectTypes = ["ball", "border"]
let ballTypes = ["polygon", "circle", "star"]
let borderSubTypes = ["polygon", "circle"]
let borderTypes = ["Maze", "Border"]
let trigFunctions = ["sin", "cos", "tan", "cot", "arcsin", "arccos", "arctan", "arccot", "arccos", "arcsec"]
let objects = []
let currentBalls
let circleBalls

function setup() {

}

function draw() {
    background(bgColor)
    // display and background settings! 
    // user can set up their image to fit in to canvas.
    // scale things before display and when we will record , the sketch will be display as original rate(1)
    // initing currentBorders and setting up 

    for (let border of currentBorders) {
        border.display();

    }
    let currentBorders = objects.filter(obj => obj.type === "Border");
    let currentBalls = objects.filter(obj => obj.type === "Ball");

    currentBalls.forEach(ball => {
        currentBorders.forEach(border => {
            if (border.subType === "Polygonal") {
                ball.subType === "Polygonal" ?
                    ball.checkLinearCollision(border) :
                    border.vertices.forEach((start, n) => ball.checkLinearCollision(start, border.vertices[(n + 1) % border.vertices.length]));
            } else if (border.subType === "Circle") {
                ball.subType === "Circular" ?
                    ball.checkCircularCollision(border) :
                    ball.subType === "Star" ?
                    ball.checkCircularCollision(border.centerX, border.centerY, border.radius) :
                    ball.checkCircularCollision();
            }
        });
    });

    checkCollisionWithOtherBalls();

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
                    handleCollision(allBalls[i], allBalls[j]);
                }
            }
        }
    }
}

function handleCollision(ball1, ball2) {
    if (isSameSubtype(ball1, ball2, "Circle") || isSameSubtype(ball1, ball2, "Polygon")) {
        handleSimpleCollision(ball1, ball2);
    } else if (isSameSubtype(ball1, ball2, "Star")) {
        handleStarCollision(ball1, ball2);
    } else if (isDifferentSubtype(ball1, ball2, "Star", "Circle")) {
        handleStarCircleCollision(ball1, ball2);
    } else if (isDifferentSubtype(ball1, ball2, "Circle", "Polygon")) {
        handleCirclePolygonCollision(ball1, ball2);
    } else if (isDifferentSubtype(ball1, ball2, "Polygon", "Star")) {
        handlePolygonStarCollision(ball1, ball2);
    }
}

function isSameSubtype(ball1, ball2, subtype) {
    return ball1.subType === subtype && ball2.subType === subtype;
}

function isDifferentSubtype(ball1, ball2, subtype1, subtype2) {
    return (ball1.subType === subtype1 && ball2.subType === subtype2) || 
           (ball1.subType === subtype2 && ball2.subType === subtype1);
}

function handleSimpleCollision(ball1, ball2) {
    let d = dist(ball1.xPos, ball1.yPos, ball2.xPos, ball2.yPos);
    if (d <= ballRadius * 2) {
        let angle = atan2(ball1.yPos - ball2.yPos, ball1.xPos - ball2.xPos);
        let overlap = ballRadius * 2 - d;
        let dx = overlap * cos(angle);
        let dy = overlap * sin(angle);
        ball1.xPos += dx / 2;
        ball1.yPos += dy / 2;
        ball2.xPos -= dx / 2;
        ball2.yPos -= dy / 2;
        [ball1.xSpeed, ball2.xSpeed] = [ball2.xSpeed, ball1.xSpeed];
        [ball1.ySpeed, ball2.ySpeed] = [ball2.ySpeed, ball1.ySpeed];
    }
}

function handleStarCollision(star1, star2) {
    let distance = p5.Vector.dist(star1.position, star2.position);
    if (distance < star1.radius + star2.radius) {
        handleCollisionReaction(star1, star2);
    }
}

function handleStarCircleCollision(star, circle) {
    if (circle.subType === "Star") [star, circle] = [circle, star];
    let distance = dist(star.position.x, star.position.y, circle.xPos, circle.yPos);
    if (distance < star.radius + circle.radius) {
        handleCollisionReaction(star, circle);
        let penetrationDepth = (star.radius + circle.radius) - distance;
        star.position.add(p5.Vector.mult(collisionNormal, penetrationDepth));
    }
}

function handleCirclePolygonCollision(circle, polygon) {
    if (polygon.subType === "Circle") [circle, polygon] = [polygon, circle];
    for (let n = 0; n < polygon.vertices.length; n++) {
        let nextIndex = (n + 1) % polygon.vertices.length;
        let start = polygon.vertices[n];
        let end = polygon.vertices[nextIndex];
        let closestPoint = circle.getClosestPointOnLine(start, end);
        let distance = p5.Vector.dist(createVector(circle.xPos, circle.yPos), closestPoint);
        if (distance < circle.radius) {
            handleCollisionReaction(circle, { position: closestPoint });
        }
    }
}

function handlePolygonStarCollision(polygon, star) {
    if (star.subType === "Polygon") [polygon, star] = [star, polygon];
    for (let n = 0; n < polygon.vertices.length; n++) {
        let nextIndex = (n + 1) % polygon.vertices.length;
        let start = polygon.vertices[n];
        let end = polygon.vertices[nextIndex];
        let closestPoint = star.getClosestPointOnLine(start, end);
        let distance = p5.Vector.dist(star.position, closestPoint);
        if (distance < star.radius) {
            handleCollisionReaction(star, { position: closestPoint });
        }
    }
}

function handleCollisionReaction(ball1, ball2) {
    let collisionNormal = p5.Vector.sub(ball1.position, ball2.position).normalize();
    let relativeVelocity = p5.Vector.sub(ball1.velocity, ball2.velocity);
    let speed = relativeVelocity.dot(collisionNormal);
    if (speed < 0) {
        let impulse = p5.Vector.mult(collisionNormal, -2 * speed);
        ball1.velocity.add(impulse);
        ball2.velocity.sub(impulse);
        ball1.velocity.mult(0.98);
        ball2.velocity.mult(0.98);
        soundArr[counterIndex % soundCount].play();
        counterIndex++;
        createParticles(ball1.position.x, ball1.position.y);
    }
}
