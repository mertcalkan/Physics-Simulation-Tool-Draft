class CircularBorder {
    constructor(params) {
        Object.assign(this, params);
        this.position = createVector(params.xPos, params.yPos);
        this.velocity = params.moveable ? createVector(params.xSpeed, params.ySpeed) : createVector(0,0)
        this.collideWithOtherBalls = ballNumber > 1 && params.collideWithOtherBalls;
        this.subType =  (params.startAngle == 0 && params.endAngle == 360) ? "Border" : params.subType;
        this.startAngle = params.subType == "Border" ? 0 : params.startAngle
        this.endAngle = params.subType == "Border" ? 360 : params.endAngle
        this.spinAroundItself = params.subType == "Maze" ? true : false
        this.spinAroundOtherself = params.spinAroundOtherself
    }

    display() {
        if (!this.strokeable) {
            noStroke();
        } else {
            if (this.constantColorMode) {
                stroke(this.strokeColor)
            } else {
                let currentTime = millis();
                let r = map(sin(currentTime * (0.0006 + this.index * 0.0001)), -1, 1, 125, 255);
                let g = map(cos(currentTime * (0.0007 + this.index * 0.0001)), -1, 1, 125, 255);
                let b = map(sin(currentTime * (0.0008 + this.index * 0.0001) + PI / 2), -1, 1, 125, 255);
                stroke(r, g, b);
            }
        }

        if (!this.fillable) {
            noFill();
        } else {
            if (constantColorMode) {
                fill(this.fillColor)
            } else {
                let currentTime = millis();
                let r = map(sin(currentTime * (0.0006 + this.index * 0.0001)), -1, 1, 125, 255);
                let g = map(cos(currentTime * (0.0007 + this.index * 0.0001)), -1, 1, 125, 255);
                let b = map(sin(currentTime * (0.0008 + this.index * 0.0001) + PI / 2), -1, 1, 125, 255);
                fill(r, g, b);
            }
        }
        push();
        translate(this.x, this.y);
        if(this.spinAroundOtherself){
            rotate(radians(this.rotationAngle));
        }
        arc(0, 0, this.radius * 2, this.radius * 2, radians(this.startAngle), radians(this.endAngle));
        pop();



    }

}