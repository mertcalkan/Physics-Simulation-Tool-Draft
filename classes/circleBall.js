class circleBall {
  constructor(uName,xPos, yPos, radius, xSpeed, ySpeed, fillColor, incMode , decMode , strokeColor, gravityActive, strokeWeightValue, collideOtherCircles, particleBorderCollide, particleBallCollide,playSound , addLinesAfterCollision , maskable) {
    this.name = uName
    this.position = createVector(xPos, yPos);
    this.velocity = createVector(xSpeed, ySpeed);
    this.radius = radius;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed
    this.fillColor = fillColor
    this.gravityActive = gravityActive
    this.strokeColor = strokeColor
    this.strokeWeightValue = strokeWeightValue
    this.collideOtherCircles = collideOtherCircles
    this.particleBorderCollide = particleBorderCollide
    this.particleBallCollide = particleBallCollide
    this.playSound = playSound
    this.addLinesAfterCollision = addLinesAfterCollision
    this.maskable = maskable
    this.incMode = incMode
    this.decMode = decMode
  }

  applyGravity() {
    if (this.gravityActive()) {
      this.velocity.y += gravity;
    }

  }

  update() {
    this.position.add(this.velocity);
  }

  checkLinearMazeCollision(lineStart, lineEnd) {
      let lineVec = p5.Vector.sub(lineEnd, lineStart);
      let lineLen = lineVec.mag();
      let normLineVec = lineVec.copy().normalize();

      let ballToLineStart = p5.Vector.sub(this.position, lineStart);
      let projLength = ballToLineStart.dot(normLineVec);
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
          if(this.playSound){
            soundArr[counterIndex % soundCount].play();
          }
          if(this.particleBorderCollide){
            createParticles(this.position.x, this.position.y);
          }
      
          let initialSpeed = this.velocity.mag();
          this.velocity.setMag(initialSpeed);
        }

        let penetrationDepth = this.radius - distToLine;
        this.position.add(p5.Vector.mult(collisionNormal, penetrationDepth));
      }
    } 


    checkCircularCollision(){
    let angle = atan2(this.y - centerY, this.x - centerX);
        let distanceToCenter = dist(this.x, this.y, centerX, centerY);
        let collisionX, collisionY;

        if (distanceToCenter < circleRadius) {
            collisionX = centerX + cos(angle) * (circleRadius - this.radius);
            collisionY = centerY + sin(angle) * (circleRadius - this.radius);
        } else {
            collisionX = centerX + cos(angle) * (circleRadius + this.radius);
            collisionY = centerY + sin(angle) * (circleRadius + this.radius);
        }

        this.x = collisionX;
        this.y = collisionY;

        let normal = createVector(this.x - centerX, this.y - centerY).normalize();
        let velocity = createVector(this.xSpeed, this.ySpeed);
        let dotProduct = velocity.dot(normal);
        let reflection = p5.Vector.mult(normal, -2 * dotProduct).add(velocity);
        this.xSpeed = reflection.x * 0.98;
        this.ySpeed = reflection.y * 0.96;
        if(this.playSound){
        soundArr[counterIndex % soundCount].play();
        }
        if(this.particleBorderCollide){
          createParticles(this.position.x, this.position.y);
      }
    }





  checkInsidePolygons(polygons) {
    for (let polygon of polygons) {
      for (let i = 0; i < polygon.vertices.length; i++) {
        let v1 = polygon.vertices[i];
        let v2 = polygon.vertices[(i + 1) % polygon.vertices.length];
        let v3 = polygon.vertices[(i + 2) % polygon.vertices.length];

        if (this.isInsideTriangle(this.position, v1, v2, v3)) {
          createParticles(this.position.x, this.position.y);
          return;
        }
      }
    }
  }

  isInsideTriangle(p, v1, v2, v3) {
    let d1 = this.sign(p, v1, v2);
    let d2 = this.sign(p, v2, v3);
    let d3 = this.sign(p, v3, v1);

    let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(hasNeg && hasPos);
  }

  sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

  display() {
    fill(this.color);
    stroke(this.strokeColor);
    strokeWeight(this.strokeWeightValue);
    ellipse(this.position.x, this.position.y, this.radius * 2);
    if(this.maskable){
      // masking image with required photos...
      maskImage()
    }
  }
}