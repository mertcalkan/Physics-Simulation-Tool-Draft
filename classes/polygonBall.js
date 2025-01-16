class PolygonBall {
    constructor(params) {
      this.position = createVector(params.xPos, params.yPos);
      this.velocity = createVector(params.xSpeed, params.ySpeed);
      this.trail = this.trailMode ? [] : null;
    }
  
    update() {
      this.applyMovement();
      this.handleCollision();
      if (this.trailMode) this.recordTrail();
    }
  
    applyMovement() {
      this.position.add(this.velocity);
      this.velocity.y += this.gravity;
    }
    checkLinearCollision(polygonBorder) {
        const ballVertices = this.getVertices();
        const frameVertices = polygonBorder.getVertices();
    
        // Poligon topun her bir kenarını, çerçevenin her bir kenarı ile karşılaştır
        for (let i = 0; i < ballVertices.length; i++) {
          let ballStart = ballVertices[i];
          let ballEnd = ballVertices[(i + 1) % ballVertices.length];
    
          for (let j = 0; j < frameVertices.length; j++) {
            let frameStart = frameVertices[j];
            let frameEnd = frameVertices[(j + 1) % frameVertices.length];
            // Kenarların kesişip kesişmediğini kontrol et
            if (this.doLineSegmentsIntersect(ballStart, ballEnd, frameStart, frameEnd)) {
              // getting the normal of the collision
              let collisionNormal = p5.Vector.sub(frameEnd, frameStart).rotate(HALF_PI).normalize();
              this.separateFromFrame(collisionNormal)
              // velocity change after collision
              this.bounceBack(collisionNormal);
    
              // apply effects
              this.applyEffects();
              return; // we exit the function
            }
          }
        }
      }
    checkCircularCollision() {
        const distanceToCenter = dist(this.position.x, this.position.y, centerX, centerY);
        if (distanceToCenter >= border.radius - this.radius) {
          const angle = atan2(this.position.y - centerY, this.position.x - centerX);
          if (!this.isInGap(angle)) {   
            this.adjustPosition(angle, border.radius);
            this.bounceBack();
            this.updateSides();
            this.applyEffects();
          } else {
            particleSystem.createParticles(this.position.x, this.position.y);
          }
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

      getVertices() {
        let vertices = [];
        const angle = TWO_PI / this.sides;
        for (let a = 0; a < TWO_PI; a += angle) {
          const vx = this.position.x + cos(a) * this.radius;
          const vy = this.position.y + sin(a) * this.radius;
          vertices.push(createVector(vx, vy));
        }
        return vertices;
      }
    
      doLineSegmentsIntersect(p1, p2, p3, p4) {
        const d1 = this.direction(p3, p4, p1);
        const d2 = this.direction(p3, p4, p2);
        const d3 = this.direction(p1, p2, p3);
        const d4 = this.direction(p1, p2, p4);
    
        if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
            ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
          return true;
        }
                                                     
        if (d1 === 0 && this.onSegment(p3, p4, p1)) return true;
        if (d2 === 0 && this.onSegment(p3, p4, p2)) return true;
        if (d3 === 0 && this.onSegment(p1, p2, p3)) return true;
        if (d4 === 0 && this.onSegment(p1, p2, p4)) return true;
    
        return false;
      }
    
      direction(p1, p2, p3) {
        return (p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x);
      }
    
      onSegment(p1, p2, p) {
        return (min(p1.x, p2.x) <= p.x && p.x <= max(p1.x, p2.x)) &&
               (min(p1.y, p2.y) <= p.y && p.y <= max(p1.y, p2.y));
      }
    
      separateFromFrame(collisionNormal) {
        let penetrationDepth = this.radius;
        let separationVector = p5.Vector.mult(collisionNormal, penetrationDepth);
        this.position.add(separationVector);
      }
    
      bounceBack(collisionNormal) {

        let dotProduct = this.velocity.dot(collisionNormal);
        this.velocity.sub(p5.Vector.mult(collisionNormal, 2 * dotProduct));
      }
  
    adjustPosition(angle, borderRadius) {
      this.position.set(
        centerX + cos(angle) * (borderRadius - this.radius),
        centerY + sin(angle) * (borderRadius - this.radius)
      );
    }
  
    bounceBack() {
      const normal = createVector(this.position.x - centerX, this.position.y - centerY).normalize();
      const dotProduct = this.velocity.dot(normal);
      this.velocity.sub(p5.Vector.mult(normal, 1.98 * dotProduct));
    }
  
    updateSides() {
      if (this.effects.decMode) this.sides = max(3, this.sides - 1);
      if (this.effects.incMode) this.sides = max(3, this.sides + 1);
    }
  
    applyEffects() {
      if (this.effects.changeColor) this.fillColor = random(colors);
      if (this.effects.playSound) this.playSound();
      if (this.effects.addLinesAfterCollision) this.addLines();
    }
  
    recordTrail() {
      if (this.trail.length >= trailLength) this.trail.shift();
      this.trail.push({ x: this.position.x, y: this.position.y });
    }
  
    display() {
      this.drawPolygon();
      if (this.trailMode) this.drawTrail();
    }
  
    drawPolygon() {
      const angle = TWO_PI / this.sides;
      beginShape();
      for (let a = 0; a < TWO_PI; a += angle) {
        const sx = this.position.x + cos(a) * this.radius;
        const sy = this.position.y + sin(a) * this.radius;
        vertex(sx, sy);
      }
      this.applyFillColor();
      endShape(CLOSE);
    }
  
    applyFillColor() {
      if (this.fixedColor) {
        fill(this.fillColor);
      } else {
        const dynamicColor = color(
          map(sin(millis() * 0.001), -1, 1, 0, 255),
          map(cos(millis() * 0.001), -1, 1, 0, 255),
          map(sin(millis() * 0.002), -1, 1, 0, 255)
        );
        fill(dynamicColor);
      }
    }
  
    playSound() {
      // Implement sound effect logic here
    }
  
    addLines() {
      // Implement line addition logic if needed
    }
  
    drawTrail() {
      for (let i = 0; i < this.trail.length - 1; i++) {
        const alpha = map(i, 0, this.trail.length - 1, 255, 0);
        stroke(trailColor);
        strokeWeight(20);
        line(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y);
      }
    }
  
    addOrRemoveBall(action, ballType) {
      if (action === "add") {
        // Implement adding ball logic here
      } else if (action === "remove") {
        // Implement removing ball logic here
      }
    }
  
      changeBorderProperties(borderIndex) {
        // Implement logic to change border properties if needed
      }
  }
  
 