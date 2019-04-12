const slowmo = 10;
const gravity = 9.81;
const friction = 0.01;

const reduceVel = (vel, reductionX, reductionY) => {
  const newVel = {...vel};
  newVel.x -= vel.x * (reductionX / slowmo);
  newVel.y += vel.y * (reductionY / slowmo);

  return newVel
}

const checkBounds = (circles, dimensions) => {
    return circles.map((circle) => {
      const newCircle = {...circle};

      const next = {
        x: newCircle.x + (newCircle.vel.x / slowmo),
        y: newCircle.y - (newCircle.vel.y / slowmo),
      }

      if (next.x > dimensions.x) {
        newCircle.x = dimensions.x;
        newCircle.vel.x = -newCircle.vel.x;
      } else if (next.x < 0) {
        newCircle.x = 0;
        newCircle.vel.x = -newCircle.vel.x;
      }

      if (next.y > dimensions.y) {
        newCircle.y = dimensions.y;
        newCircle.vel.y = -newCircle.vel.y;
      } else if (next.y< 0) {
        newCircle.y = 0;
        newCircle.vel.y = -newCircle.vel.y;
      }

      return newCircle;
    });
  }

const applyFriction = (vel) => reduceVel(vel, friction, -friction );

const applyForces = (circle) => {

  const nextCircle = {...circle};
  nextCircle.vel = applyFriction(nextCircle.vel);
  nextCircle.vel.y -= gravity / slowmo;
  

  nextCircle.x += nextCircle.vel.x / slowmo;
  nextCircle.y -= nextCircle.vel.y / slowmo;
  return nextCircle
}

const doTick = (circles) => circles.map(circle => applyForces(circle));

export default {
  doTick,
  checkBounds,
}