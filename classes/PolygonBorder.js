class PolygonalBorder {
    constructor(params) {
        Object.assign(this, params);
        this.spinAroundItself = params.subType == "Maze";
        this.rotationSpeed = this.spinAroundItself ? params.rotationSpeed : 0;
        this.spinAroundOtherself = params.spinAroundOtherself;
        this.updateVertices();
    }

    updateVertices() {
        this.vertices = [];
        for (let i = 0; i < this.sides; i++) {
            let angle = (TWO_PI / this.sides) * i + this.angle;
            let x = this.cx + cos(angle) * this.radius;
            let y = this.cy + sin(angle) * this.radius;
            this.vertices.push(createVector(x, y));
        }
    }

    update() {
        this.angle += this.rotationSpeed;
        this.updateVertices();
    }

    display() {
        let currentTime = millis();
        let r = map(sin(currentTime * (0.00012 + this.standardIndex * 0.00015)), -1, 1, 105, 205);
        let g = map(cos(currentTime * (0.0017 + this.standardIndex * 0.0003)), -1, 1, 25, 185);
        let b = map(sin(currentTime * (0.0008 + this.standardIndex * 0.0004) + PI / 2), -1, 1, 25, 100);
        stroke(r, g, b);
        strokeWeight(9);
        fill(200, 100, 100, 50);

        for (let i = 0; i < this.vertices.length; i++) {
            let nextIndex = (i + 1) % this.vertices.length;
            let start = this.vertices[i];
            let end = this.vertices[nextIndex];
            if (i === this.gappedIndex) {
                this.drawGappedLine(start, end);
            } else {
                line(start.x, start.y, end.x, end.y);
            }
        }
    }

    drawGappedLine(start, end) {
        let lineVec = p5.Vector.sub(end, start);
        let currentGap = 100 + (this.radius * (2 * sin(PI / this.sides)) - 150);
        let gapVec = lineVec.copy().normalize().mult(currentGap / 2);
        let gapStart = p5.Vector.add(start, gapVec);
        let gapEnd = p5.Vector.sub(end, gapVec);
        line(start.x, start.y, gapStart.x, gapStart.y);
        line(gapEnd.x, gapEnd.y, end.x, end.y);
    }
}