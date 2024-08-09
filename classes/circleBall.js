class CircleBall {
  constructor(params) {
    Object.assign(this, params);
    this.position = createVector(params.xPos, params.yPos);
    this.velocity = createVector(params.xSpeed, params.ySpeed);
    this.collideWithOtherBalls = ballNumber > 1 && params.collideWithOtherBalls;
  }

  applyGravity(gravity) {
    if (this.gravityActive()) {
      this.velocity.y += gravity;
    }
  }

  update() {
    this.position.add(this.velocity);
    this.radius += this.autoIncMode.active ? this.autoIncMode.incUnit : this.autoDecMode.active ? -this.autoDecMode.decUnit : 0;
  }

  checkLinearMazeCollision(lineStart, lineEnd) {
    const closestPoint = this._getClosestPointOnLine(lineStart, lineEnd);
    const distToLine = p5.Vector.dist(this.position, closestPoint);

    if (distToLine < this.radius) {
      this._handleCollision(closestPoint, distToLine);
    }
  }

  _getClosestPointOnLine(lineStart, lineEnd) {
    const lineVec = p5.Vector.sub(lineEnd, lineStart);
    const projLength = p5.Vector.sub(this.position, lineStart).dot(lineVec.copy().normalize());

    return projLength < 0 ?
      lineStart.copy() :
      projLength > lineVec.mag() ?
      lineEnd.copy() :
      p5.Vector.add(lineStart, lineVec.copy().normalize().mult(projLength));
  }

  _handleCollision(closestPoint, distToLine) {
    const collisionNormal = p5.Vector.sub(this.position, closestPoint).normalize();
    const speed = this.velocity.dot(collisionNormal);

    if (speed < 0) {
      this.velocity.add(p5.Vector.mult(collisionNormal, -2 * speed));
      this.playSound && soundArr[counterIndex % soundCount].play();
      this.particleBorderCollide && createParticles(this.position.x, this.position.y);
    }

    this.position.add(p5.Vector.mult(collisionNormal, this.radius - distToLine));
  }

  checkCircularCollision(ball) {
    const distanceToCenter = dist(ball.x, ball.y, this.position.x, this.position.y);
    if (distanceToCenter > this.radius + ball.radius) {
      ball.handleEscape(this.index);
    } else {
      const angle = (degrees(atan2(ball.y - this.position.y, ball.x - this.position.x)) + 360) % 360;
      const effectiveStartAngle = (this.startAngle + this.rotationAngle) % 360;
      const effectiveEndAngle = (this.endAngle + this.rotationAngle) % 360;
      const isWithinArc = effectiveStartAngle < effectiveEndAngle ?
        angle >= effectiveStartAngle && angle <= effectiveEndAngle :
        angle >= effectiveStartAngle || angle <= effectiveEndAngle;

      if (distanceToCenter >= this.radius - ball.radius && isWithinArc) {
        ball.handleCollision(this.index);
      }
    }
  }

  addChanges() {
    this.ballCollideProperties.forEach(prop => {
      const {
        active,
        countParam,
        incUnit,
        decUnit
      } = prop.addRadius || {};

      if (active && totalBounces % countParam === 0) {
        this.radius += incUnit;
        prop.xSpeed && (this.velocity.x += prop.addXSpeed ? incUnit : -decUnit);
        prop.ySpeed && (this.velocity.y += prop.addYSpeed ? incUnit : -decUnit);
      }

      if (objectExists("Ball", "Star", objects) && prop.addStarSizes?.active) {  
        const starObjects = objects.filter(obj => obj.type === "Ball" && obj.subType === "Star");    
        // defining index of the stars
        starObjects.forEach((star, index) => {
          const ref = prop.addStarSizes.reference;
          switch (ref) {
            case "index":
              // Eğer referans indeks ise, yıldızın indeksine göre boyut ekleyin
              // Örneğin, belirtilen indeks 'prop.addStarSizes.index' olan yıldızın boyutunu artırmak için:
              if (index === prop.addStarSizes.index) {
                star.size += prop.addStarSizes.incrementValue; // Yıldızın boyutunu artır
              }
              break;
            case "color":
              // Eğer referans renk ise, belirli bir renkteki yıldızların boyutunu artırın
              const color = ref.color === "random" ? random(starBallColors) : ref.color;
              if (star.color === color) {
                star.size += prop.addStarSizes.incrementValue; // Belirtilen renkteki yıldızın boyutunu artır
              }
              break;
            case "starSizes":
              // Eğer referans yıldızın kenar sayısı ise, belirli bir kenar sayısına sahip yıldızların boyutunu artırın
              if (star.sides === ref.starSizeNumber) {
                star.size += prop.addStarSizes.incrementValue; // Belirtilen kenar sayısına sahip yıldızın boyutunu artır
              }
              break;
            case "name":
              // Eğer referans isim ise, belirli bir isimdeki yıldızın boyutunu artırın
              if (star.name === ref.name) {
                star.size += prop.addStarSizes.incrementValue; // Belirtilen isme sahip yıldızın boyutunu artır
              }
              break;
          }
        });
      }
      if (objectExists("Ball", "Polygon", objects) && prop.addPolygonSizes?.active) {  
        const polygonObjects = objects.filter(obj => obj.type === "Ball" && obj.subType === "Polygon");    
        // defining index of the stars
        polygonObjects.forEach((polygon, index) => {
          const ref = prop.addPolygonSizes.reference;
          switch (ref) {
            case "index":
              if (index === prop.addPolygonSizes.index) {
                polygon.sides = max(3, this.sides + prop.addPolygonSizes.incrementValue); 
              }
              break;
            case "color":
              
              const color = ref.color === "random" ? random(polygonBallColors) : ref.color;
              if (polygon.color === color) {
                polygon.sides = max(3, this.sides + prop.addPolygonSizes.incrementValue);
              }
              break;
            case "starSizes":
              if (polygon.sides === ref.starSizeNumber) {
                polygon.sides = max(3, this.sides + prop.addPolygonSizes.incrementValue); 
              }
              break;
            case "name":
              if (polygon.name === ref.name) {
                polygon.sides = max(3, this.sides + prop.addPolygonSizes.incrementValue);
              }
              break;
            case "number":
                
          }
        });
      }
      

      // changing ball type 
      else if (prop.changeBallType?.active && totalBounces % prop.changeBallType.countParam === 0) {
        let newBall;
        if (prop.changeBallType.type === "star") {
          newBall = new StarBall(params);
        } else if (prop.changeBallType.type === "polygon") {
          newBall = new PolygonBall(params);
        }
        if (newBall) {
          let index = objects.indexOf(this);
          if (index !== -1) {
            objects[index] = newBall;
          }
        }
      }

      else if (prop.addBall?.active && totalBounces % prop.addBall.countParam === 0) {
        // Add ball logic
      }
      // remove balls with references.
     else if (prop.removeBall?.active && totalBounces % prop.removeBall.countParam === 0) {
        const criteria = prop.removeBall.reference;
        const removeByCriteria = (obj) => {
          if (criteria === "index") {
            return obj.index === prop.removeBall.index;
          } else if (criteria === "name") {
            return obj.uName === prop.removeBall.name;
          } else if (criteria === "color") {
            return obj.color === prop.removeBall.color && obj.type === "Ball";
          } else if (criteria === "type") {
            return obj.shapeType === prop.removeBall.shapeType && obj.type === "Ball";
          } else if (criteria === "shapeSide") {
            return obj.subType === "polygon" && obj.sides === prop.removeBall.sides;
          } else if (criteria === "starSide") {
            return obj.subType === "star" && obj.sides === prop.removeBall.sides;
          }
        };

        objects = objects.filter(obj => !(obj.type === "Ball" && removeByCriteria(obj)));
      }

    });
  }

  checkInsidePolygons(polygons) {
    for (const polygon of polygons) {
      for (let i = 0; i < polygon.vertices.length; i++) {
        if (this.isInsideTriangle(this.position, polygon.vertices[i], polygon.vertices[(i + 1) % polygon.vertices.length], polygon.vertices[(i + 2) % polygon.vertices.length])) {
          createParticles(this.position.x, this.position.y);
          return;
        }
      }
    }
  }

  isInsideTriangle(p, v1, v2, v3) {
    const sign = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    const d1 = sign(p, v1, v2),
      d2 = sign(p, v2, v3),
      d3 = sign(p, v3, v1);
    return !(d1 < 0 || d2 < 0 || d3 < 0) || (d1 > 0 && d2 > 0 && d3 > 0);
  }

  display() {
    this.strokeColor ? stroke(this.strokeColor) : noStroke();
    strokeWeight(this.strokeWeightValue);
    this.fillColor ? fill(this.fillColor) : noFill();
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}