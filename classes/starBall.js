class StarBall {
  constructor(xPos, yPos, radius, xSpeed, ySpeed, points, inset, gravity, spinnable , type , subType) {
    this.position = createVector(xPos, yPos);
    this.velocity = createVector(xSpeed, ySpeed);
    this.radius = radius;
    this.points = points;
    this.inset = inset;
    this.gravity = gravity
    this.spinnable = spinnable
    this.type = type
    this.subType = subType
  }

  applyGravity() {
    this.velocity.y += this.gravity;
  }

  update() {
    this.position.add(this.velocity);
  }

  checkCollisionWithPolygonalBorderOrMaze(lineStart, lineEnd) {
    let lineVec = p5.Vector.sub(lineEnd, lineStart);
    let lineLen = lineVec.mag();
    let normLineVec = lineVec.copy().normalize();
    let starToLineStart = p5.Vector.sub(this.position, lineStart);
    let projLength = starToLineStart.dot(normLineVec);
    let closestPoint;

    if (projLength < 0) {
      closestPoint = lineStart.copy();
    } else if (projLength > lineLen) {
      closestPoint = lineEnd.copy();
    } else {
      let projVec = normLineVec.copy().mult(projLength);
      closestPoint = p5.Vector.add(lineStart, projVec);
    }

    let distToLine = p5.Vector.dist(this.position, closestPoint);

    if (distToLine < this.radius) {
      let collisionNormal = p5.Vector.sub(this.position, closestPoint).normalize();
      let relativeVelocity = this.velocity.copy();
      let speed = relativeVelocity.dot(collisionNormal);

      if (speed < 0) {
        let impulse = p5.Vector.mult(collisionNormal, -2 * speed);
        this.velocity.add(impulse);
        soundArr[counterIndex % soundCount].play();
        counterIndex++;
        createParticles(this.position.x, this.position.y);
        let initialSpeed = this.velocity.mag();
        this.velocity.setMag(initialSpeed);
      }
      let penetrationDepth = this.radius - distToLine;
      this.position.add(p5.Vector.mult(collisionNormal, penetrationDepth));
      if (this.spinnable) {

      } else {

      }
    }
  }

  checkCollisionWithCircularPlatform() {

  }

  display() {
    fill("purple");
    stroke("white");
    strokeWeight(2.75);
    push();
    translate(this.position.x, this.position.y);
    beginShape();
    for (let i = 0; i < TWO_PI; i += TWO_PI / this.points) {
      let angle = i;
      let x = cos(angle) * this.radius;
      let y = sin(angle) * this.radius;
      vertex(x, y);
      x = cos(angle + PI / this.points) * this.radius * this.inset;
      y = sin(angle + PI / this.points) * this.radius * this.inset;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}