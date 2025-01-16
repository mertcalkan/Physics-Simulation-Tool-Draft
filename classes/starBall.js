class StarBall {
  constructor(params) {
    Object.assign(this, params);
    this.position = createVector(params.xPos, params.yPos);
    this.velocity = createVector(params.xSpeed, params.ySpeed);
    this.collideWithOtherBalls = params.ballNumber > 1 && params.collideWithOtherBalls;
    this.spinnable = params.spinnable;
    this.gapAngles = params.gapAngles || [];  // Array of gap angle ranges
  }

  applyGravity() {
    this.velocity.y += this.gravity;
  }

  update() {
    this.position.add(this.velocity);
  }

  getClosestPointOnLine(lineStart, lineEnd) {
    let lineVec = p5.Vector.sub(lineEnd, lineStart);
    let normLineVec = lineVec.copy().normalize();
    let projLength = p5.Vector.sub(this.position, lineStart).dot(normLineVec);

    if (projLength < 0) return lineStart.copy();
    if (projLength > lineVec.mag()) return lineEnd.copy();

    return p5.Vector.add(lineStart, normLineVec.mult(projLength));
  }

  handleCollision(normal) {
    let relativeVelocity = this.velocity.copy();
    let speed = relativeVelocity.dot(normal);

    if (speed < 0) {
      let impulse = p5.Vector.mult(normal, -2 * speed);
      this.velocity.add(impulse);
      this.velocity.setMag(relativeVelocity.mag());

      soundArr[counterIndex % soundCount].play();
      counterIndex++;
      createParticles(this.position.x, this.position.y);
    }
  }

  checkLinearCollision(lineStart, lineEnd) {
    let closestPoint = this.getClosestPointOnLine(lineStart, lineEnd);
    let distToLine = p5.Vector.dist(this.position, closestPoint);

    if (distToLine < this.radius) {
      let linearCollisionNormal = p5.Vector.sub(this.position, closestPoint).normalize();
      this.handleCollision(linearCollisionNormal);

      let penetrationDepth = this.radius - distToLine;
      this.position.add(p5.Vector.mult(collisionNormal, penetrationDepth));
    }
  }

  checkCircularCollision(centerX, centerY, circleRadius) {
    let distanceToCenter = dist(this.position.x, this.position.y, centerX, centerY);
    let angle = atan2(this.position.y - centerY, this.position.x - centerX);

    if (distanceToCenter >= circleRadius - this.radius && !this.isInGap(angle)) {
      this.position.set(
        centerX + cos(angle) * (circleRadius - this.radius),
        centerY + sin(angle) * (circleRadius - this.radius)
      );

      let normal = createVector(this.position.x - centerX, this.position.y - centerY).normalize();
      this.handleCollision(normal);

      this.velocity.mult(createVector(0.98, 0.96));
    }
  }

  isInGap(angle) {
    for (let gap of this.gapAngles) {
      if (angle >= gap.startAngle && angle <= gap.endAngle) {
        return true;
      }
    }
    return false;
  }

  display() {
    fill("purple");
    stroke("white");
    strokeWeight(2.75);
    push();
    translate(this.position.x, this.position.y);
    this.drawStar();
    pop();
  }

  drawStar() {
    beginShape();
    for (let i = 0; i < TWO_PI; i += TWO_PI / this.sides) {
      let x = cos(i) * this.radius;
      let y = sin(i) * this.radius;
      vertex(x, y);

      x = cos(i + PI / this.points) * this.radius * this.inset;
      y = sin(i + PI / this.points) * this.radius * this.inset;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
