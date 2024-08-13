class CircleBall {
  constructor(params) {
    Object.assign(this, params);
    this.position = createVector(params.xPos, params.yPos);
    this.velocity = createVector(params.xSpeed, params.ySpeed);
    this.collideWithOtherBalls = ballNumber > 1 && params.collideWithOtherBalls;
    this.spinnable = params.spinnable;  // Fixed assignment operator
  }

  applyGravity(gravity) {
    if (this.gravityActive()) {
      this.velocity.y += gravity;
    }
  }

  update() {
    this.position.add(this.velocity);
    const incDecUnit = this.autoIncMode.active 
      ? this.autoIncMode.incUnit 
      : this.autoDecMode.active 
      ? -this.autoDecMode.decUnit 
      : 0;
    this.radius += incDecUnit;
  }

  checkLinearCollision(lineStart, lineEnd) {
    const closestPoint = this._getClosestPointOnLine(lineStart, lineEnd);
    const distToLine = p5.Vector.dist(this.position, closestPoint);

    if (distToLine < this.radius) {
      this._handleLinearCollision(closestPoint, distToLine);
    }
  }

  _getClosestPointOnLine(lineStart, lineEnd) {
    const lineVec = p5.Vector.sub(lineEnd, lineStart);
    const projLength = p5.Vector.sub(this.position, lineStart).dot(lineVec.copy().normalize());

    if (projLength < 0) return lineStart.copy();
    if (projLength > lineVec.mag()) return lineEnd.copy();
    
    return p5.Vector.add(lineStart, lineVec.copy().normalize().mult(projLength));
  }

  _handleLinearCollision(closestPoint, distToLine) {
    const collisionNormal = p5.Vector.sub(this.position, closestPoint).normalize();
    const speed = this.velocity.dot(collisionNormal);
    if (speed < 0) {
      this.velocity.add(p5.Vector.mult(collisionNormal, -2 * speed));
      this.playSound && soundArr[counterIndex % soundCount].play();
      this.particleBorderCollide && createParticles(this.position.x, this.position.y);
      this.addChanges()
    }
    this.position.add(p5.Vector.mult(collisionNormal, this.radius - distToLine));
  }



  checkCircularCollision(b,i,this) {
    const distanceToCenter = dist(this.x, this.y, this.position.x, this.position.y);
    if (distanceToCenter > this.radius + this.radius) {
      this.handleEscape(this.index);
    } else if (this._isWithinArc(this, distanceToCenter)) {
      this._handleCircularCollision(b,i);
    }
  }
  _handleCircularCollision(b,i) {
    let angle = atan2(this.position.y - this.centerY, this.position.x - centerX);
    let distanceToCenter = dist(this.position.x, this.position.y, centerX, centerY);
   
    let collisionX, collisionY;
  
    if (distanceToCenter < this.circleRadius) {
      collisionX = centerX + cos(angle) * (b[i].radius - this.radius);
      collisionY = centerY + sin(angle) * (b[i].radius - this.radius);
    } else {
      collisionX = centerX + cos(angle) * (b[i].radius + this.radius);
      collisionY = centerY + sin(angle) * (b[i].radius + this.radius);
    }
    this.position.set(collisionX, collisionY);
    let normal = createVector(this.position.x - centerX , this.position.y - centerY).normalize();
    let velocity = this.velocity.copy();
    let dotProduct = velocity.dot(normal);
    let reflection = p5.Vector.mult(normal, -2 * dotProduct).add(velocity);
    this.velocity.set(reflection.x * 0.98, reflection.y * 0.96);
    createParticles(this.position.x, this.position.y);
  }
  
  _isWithinArc(this, distanceToCenter) {
    const angle = (degrees(atan2(this.y - this.position.y, this.x - this.position.x)) + 360) % 360;
    const effectiveStartAngle = (this.startAngle + this.rotationAngle) % 360;
    const effectiveEndAngle = (this.endAngle + this.rotationAngle) % 360;

    const isWithinArc = effectiveStartAngle < effectiveEndAngle
      ? angle >= effectiveStartAngle && angle <= effectiveEndAngle
      : angle >= effectiveStartAngle || angle <= effectiveEndAngle;

    return distanceToCenter >= this.radius - this.radius && isWithinArc;
  }

  addChanges() {
    this.ballCollideProperties.forEach(prop => {
      this._applyRadiusChange(prop);
      this._handleSpecialObjects("Ball", "Star", prop.addStarSizes, objects);
      this._handleSpecialObjects("Ball", "Polygon", prop.addPolygonSizes, objects);
      this._changeBallType(prop);
      this._addOrRemoveBalls(prop);
      this._changeBorderType(prop);
      this._addOrRemoveBorders(prop);
      this._addOrRemoveBorderSize(prop)
    });
  }

  _applyRadiusChange(prop) {
    const { active, countParam, incUnit, decUnit } = prop.addRadius || {};
    if (active && totalBounces % countParam === 0) {
      this.radius += incUnit;
      this._adjustSpeed(prop, incUnit, decUnit);
    }
  }

  _adjustSpeed(prop, incUnit, decUnit) {
    if (prop.xSpeed) this.velocity.x += prop.addXSpeed ? incUnit : -decUnit;
    if (prop.ySpeed) this.velocity.y += prop.addYSpeed ? incUnit : -decUnit;
  }

  _handleSpecialObjects(type, subType, sideProp, objects) {
    if (objectExists(type, subType, objects) && sideProp?.active) {
      const relevantObjects = objects.filter(obj => obj.type === type && obj.subType === subType);
      relevantObjects.forEach((obj, index) => this._updateObjectSize(obj, index, sideProp));
    }
  }

  _updateObjectSize(obj, index, sideProp) {
    const ref = sideProp.reference;
    if (ref === "index" && index === sideProp.index) {
      obj.sides += obj.subType == "Star" ? sideProp.incrementValue : max(3, obj.sides + sizeProp.incrementValue);
    } else if (ref === "color" && obj.color === this._getColor(ref.color)) {
      obj.sides += obj.subType == "Star" ? sideProp.incrementValue : max(3, obj.sides + sizeProp.incrementValue);
    } else if (ref === "starSizes" && obj.sides === ref.starSizeNumber) {
      obj.sides += obj.subType == "Star" ? sideProp.incrementValue : max(3, obj.sides + sizeProp.incrementValue);
    } else if (ref === "name" && obj.name === ref.name) {
      obj.sides += obj.subType == "Star" ? sideProp.incrementValue : max(3, obj.sides + sizeProp.incrementValue);
    }
  }

  _getColor(color) {
    return color === "random" ? random(starBallColors) : color;
  }

  _changeBallType(prop) {
    if (prop.changeBallType?.active && totalBounces % prop.changeBallType.countParam === 0) {
      let newBall;
      if (prop.changeBallType.type === "star") {
        newBall = new StarBall(this);
      } else if (prop.changeBallType.type === "polygon") {
        newBall = new PolygonBall(this);
      }
      if (newBall) {
        const index = objects.indexOf(this);
        if (index !== -1) {
          objects[index] = newBall;
        }
      }
    }
  }
  _changeBorderType(prop) {
    if (prop.changeBorderType?.active && totalBounces % prop.changeBorderType.countParam === 0) {
      let newBorder;
      if (prop.changeBorderType.type === "") {
        newBorder = new StarBall(this);
      } else if (prop.changeBorderType.type === "polygon") {
        newBall = new PolygonalMaze(this);
      }
      if (newBorder) {
        const index = objects.indexOf(this);
        if (index !== -1) {
          objects[index] = newBorder;
        }
      }
    }
  }
  _addOrRemoveBalls(prop) {
    if (prop.addBall?.active && totalBounces % prop.addBall.countParam === 0) {
      this._addBalls(prop.addBall);
    }
    if (prop.removeBall?.active && totalBounces % prop.removeBall.countParam === 0) {
      this._removeBalls(prop.removeBall);
    }
  }
  _addOrRemoveBorders(prop) {
    if (prop.addBorder?.active && totalBounces % prop.addBorder.countParam === 0) {
      this._addBorders(prop.addBorder);
    }
    if (prop.removeBorder?.active && totalBounces % prop.removeBorder.countParam === 0) {
      this._removeBorders(prop.removeBorder);
    }
  }
  _addBalls(addBallProp) {
    for (let i = 0; i < addBallProp.ballCount; i++) {
      const ballType = addBallProp.type === "Random" ? random(ballTypes) : addBallProp.type;
      const newBall = this._createNewBall(ballType);
      newBall && objects.push(newBall);
    }
  }

  _createNewBall(ballType) {
    switch (ballType) {
      case "Star":
        return new StarBall(this);
      case "Polygon":
        return new PolygonBall(this);
      default:
        return new CircleBall(this)
    }
  }

  _removeBalls(removeBallProp) {
    objects = objects.filter(obj => 
      !(obj.type === "Ball" && this._shouldRemoveBall(obj, removeBallProp))
    );
  }


  _createNewBorder(borderType, borderSubType) {
    if (borderSubType === "Circle") {
        return new CircularBorder({
            ...this,
            startAngle: borderType === "Maze" ? this.startAngle : 0,
            endAngle: borderType === "Maze" ? this.endAngle : 360,
            spinAroundItself: borderType === "Maze"
        });
    } else if (borderSubType === "Polygon") {
        // Handle Polygon borders
        const gapRatio = borderType === "Maze" ? 2 : 0;  // Assign gapRatio based on type
        return new PolygonalBorder({
            ...this,
            gapRatio: gapRatio
        });
    }
}

_addBorders(addBorderProp) {
  for (let i = 0; i < addBorderProp.borderCount; i++) {
    const borderType = addBorderProp.type === "Random" ? random(borderTypes) : addBorderProp.type;
    const borderSubType = addBorderProp.subType === "Random" ? random(borderSubTypes) : addBorderProp.subType;
    const increment = addBorderProp.incValue
    const startRadius = addBorderProp.startRadius 
    if(startRadius + increment * addBorderProp.ballCount >= 0){
      const newBorder = this._createNewBorder(borderType,borderSubType);
      newBorder && objects.push(newBorder);
    }
    else{
      return
    }
  }
}

_removeBorders(removeBorderProp) {
  if (removeBorderProp.reference === "random") {
      const borderObjects = objects.filter(obj => obj.type === "Border");
      if (borderObjects.length >= removeBorderProp.borderCount) {
          // Randomly select borders to remove
          const bordersToRemove = Math.floor(Math.random() * removeBorderProp.borderCount) + 1;
          for (let i = 0; i < bordersToRemove; i++) {
              const randomIndex = Math.floor(Math.random() * borderObjects.length);
              const borderToRemove = borderObjects[randomIndex]
              // Remove the selected border from objects
              objects = objects.filter(obj => obj !== borderToRemove);
              // Remove the border from the filtered list
              borderObjects.splice(randomIndex, 1);
          }
      }
  } else {
      // Normal removal based on other criteria
      objects = objects.filter(obj => 
          !(obj.type === "Border" && this._shouldRemoveBorder(obj, removeBorderProp))
      );
  }
}



_shouldRemoveBorder(obj, removeBorderProp) {
  const criteria = removeBorderProp.reference;
  return criteria === "index" && obj.index === removeBorderProp.index ||
         criteria === "name" && obj.uName === removeBorderProp.name ||
         criteria === "subType" && obj.subType === removeBorderProp.subType && obj.type === "Border"     
}

  _shouldRemoveBall(obj, removeBallProp) {
    const criteria = removeBallProp.reference;
    return criteria === "index" && obj.index === removeBallProp.index ||
           criteria === "name" && obj.uName === removeBallProp.name ||
           criteria === "color" && obj.color === removeBallProp.color && obj.type === "Ball" ||
           criteria === "type" && obj.shapeType === removeBallProp.shapeType && obj.type === "Ball" ||
           criteria === "shapeSide" && obj.subType === "polygon" && obj.sides === removeBallProp.sides ||
           criteria === "starSide" && obj.subType === "star" && obj.sides === removeBallProp.sides;   
  }

  checkInsidePolygons(polygons) {
    polygons.forEach(polygon => {
      for (let i = 0; i < polygon.vertices.length; i++) {
        if (this.isInsideTriangle(this.position, polygon.vertices[i], polygon.vertices[(i + 1) % polygon.vertices.length], polygon.vertices[(i + 2) % polygon.vertices.length])) {
          createParticles(this.position.x, this.position.y);
          return;
        }
      }
    });
  }

  isInsideTriangle(p, v1, v2, v3) {
    const sign = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    const [d1, d2, d3] = [sign(p, v1, v2), sign(p, v2, v3), sign(p, v3, v1)];
    return !(d1 < 0 || d2 < 0 || d3 < 0) || (d1 > 0 && d2 > 0 && d3 > 0);
  }

  display() {
    this.strokeColor ? stroke(this.strokeColor) : noStroke();
    strokeWeight(this.strokeWeightValue);
    this.fillColor ? fill(this.fillColor) : noFill();
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}
