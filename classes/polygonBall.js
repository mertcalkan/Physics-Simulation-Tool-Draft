class PolygonBall {
    constructor({
        xPos,
        yPos,
        radius,
        sides,
        xSpeed,
        ySpeed,
        gravity,
        collisionOptions,
        fillColor,
        trailMode,
        escapeOptions,
    }) {    
        this.position = createVector(xPos, yPos);
        this.radius = radius;
        this.sides = sides;
        this.velocity = createVector(xSpeed, ySpeed);
        this.gravity = gravity;
        this.fillColor = fillColor;
        this.trailMode = trailMode;
        this.trail = trailMode ? [] : null;
        this.fixedColor = fixedColor
        this.collisionOptions = collisionOptions
        this.escapeOptions = borders.some(item => item.type == "Maze") ? escapeOptions : null    
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.y += this.gravity;
        this.handleCollision();
        if (this.trailMode) this.recordTrail();
    }

    handleCollision() {
        for(let i = 0 ; i < circleBorders.length; i++){
            let distanceToCenter = dist(this.position.x, this.position.y, centerX, centerY);
            if (distanceToCenter >= circleBorders[i].radius - this.radius) {
                let angle = atan2(this.position.y - centerY, this.position.x - centerX);
                if (!isInGap(angle)) {
                    this.adjustPosition(angle);
                    this.bounceBack();
                    this.updateSides();
                    if (this.trailMode) particleSystem.createBigCircleParticles(centerX, centerY, circleBorders[i].radius, 360);
                    this.applyEffects();
                }
                else {
                    particleSystem.createParticles(this.position.x, this.position.y);
                }
        }
    }
    }

    adjustPosition(angle) {
        this.position.x = centerX + cos(angle) * (circleRadius - this.radius);
        this.position.y = centerY + sin(angle) * (circleRadius - this.radius);
    }

    bounceBack() {
        let normal = createVector(this.position.x - centerX, this.position.y - centerY).normalize();
        let dotProduct = this.velocity.dot(normal);
        this.velocity.sub(p5.Vector.mult(normal, 1.98 * dotProduct));
    }

    updateSides() {
        if (this.decMode) {
            this.sides = max(3, this.sides - 1);
        } else if (this.incMode) {
            this.sides = max(3, this.sides + 1);
        }
    }

    applyEffects() {
        if (this.changeColor) {
            this.fillColor = random(colors);
        }
        if (this.addLinesAfterCollision) {
            // Implement line addition logic if needed
        }
    }
    addAnotherBall(ballType){
        if(this.addAnotherBall){
            if(ballType == "random"){

            }
            else if(ballType = "circle"){
    
            }
            else if(ballType == "polygon"){
    
            }
        }
        
    }

    removeBall(ballType){
        if(this.removeBall){
            if(ballType == "random"){

            }
            else if(ballType = "circle"){
    
            }
            else if(ballType == "polygon"){
    
            }
        }
        
    }

    changeBorderProperties(borderIndex){
    
    }
    recordTrail() {
        if (this.trail.length >= trailLength) this.trail.shift();
        this.trail.push({ x: this.position.x, y: this.position.y });
    }

    display() {
        strokeWeight(5.7);
        stroke("white");
        this.drawPolygon();
        if (this.trailMode) this.drawTrail();
    }

    drawPolygon() {
        let angle = TWO_PI / this.sides;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.position.x + cos(a) * this.radius;
            let sy = this.position.y + sin(a) * this.radius;
            vertex(sx, sy);
        }
        if(this.fixedColor){
            fill(this.fillColor);
        }
        else{
            // fill with r,g,b with millis() paramteers and sin & cos functionalities.
        }
        
        endShape(CLOSE);
    }

    playSound(){
        if(this.playSound){
            //implementing playing Sound Effect.
        }
    }

    drawTrail() {
        for (let i = 0; i < this.trail.length - 1; i++) {
            let alpha = map(i, 0, this.trail.length - 1, 255, 0);
            stroke(trailColor);
            strokeWeight(20);
            line(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y);
        }
    }
}

// Usage Example
let polygonBall = new PolygonBall({
    xPos: centerX,
    yPos: centerY - circleRadius + polygonRadius,
    radius: polygonRadius,
    sides: polygonSides,
    xSpeed: -1.3,
    ySpeed: 0.545,
    gravity: 0.75,
    spinnable: true,
    decMode: true,
    incMode: false,
    changeColor: true,
    changeSize: false,
    fillColor: 'red',
    trailMode: true,
    addLinesAfterCollision: false
});
