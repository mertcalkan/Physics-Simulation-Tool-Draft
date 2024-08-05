class circularBorder {
    constructor(uName , x, y, type, subType, radius, startAngle, endAngle, rotationSpeed, fillable, strokeable, constantColorMode, fillColor, strokeColor,maskable) {
        this.name = uName
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.type = type;
        this.subType = subType
        this.startAngle = (this.type == "Border") ? 0 : startAngle;
        this.endAngle = (this.type == "Border") ? 360 : endAngle;
        this.rotationAngle = (this.type == "Border") ? 360 : rotationAngle;
        this.rotationSpeed = (this.type == "Border") ? 360 : rotationSpeed;
        this.fillable = fillable
        this.strokeable = strokeable
        this.constantColorMode = constantColorMode;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.maskeable = (this.type == "Border") && numOfCircularBorders < 2 ? maskable : false;

    }

    display() {
        if (!this.strokeable) {
            noStroke();
        } else {
            if (constantColorMode) {
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
        rotate(radians(this.rotationAngle));
        arc(0, 0, this.radius * 2, this.radius * 2, radians(this.startAngle), radians(this.endAngle));
        pop();
        if (this.type == "Maze") {
            this.rotationAngle += this.rotationSpeed / 10;
        }


    }

    checkCollision(ball) {
        let distanceToCenter = dist(ball.x, ball.y, this.x, this.y);
        if (distanceToCenter > this.radius + ball.radius) {
            ball.handleEscape(this.index);
        } else {
            let angle = atan2(ball.y - this.y, ball.x - this.x);
            angle = degrees(angle);
            if (angle < 0) angle += 360;
            let effectiveStartAngle = (this.startAngle + this.rotationAngle) % 360;
            let effectiveEndAngle = (this.endAngle + this.rotationAngle) % 360;
            let isWithinArc = (effectiveStartAngle < effectiveEndAngle) ?
                (angle >= effectiveStartAngle && angle <= effectiveEndAngle) :
                (angle >= effectiveStartAngle || angle <= effectiveEndAngle);

            if (distanceToCenter >= this.radius - ball.radius && isWithinArc) {
                ball.handleCollision(this.index);
            }
        }
    }
}