import { Application, Graphics } from "pixi.js";
import { Vec2 } from "./vector/vec2";
import { Circle, Segment } from "./vector";

export class ball extends Graphics {
  v: Circle;
  size: number;
  color: number;
  isMob: boolean;
  speed: number = 2;
  speedVec: Vec2;
  hash: string = Math.random().toString(36).slice(-8);

  constructor(size: number, color?: number, isMob?: boolean) {
    super();
    this.size = size;
    this.color = color || 0xffffff * Math.random();
    if (isMob === undefined) this.isMob = true;
    else this.isMob = isMob;
    this.init();
  }

  init() {
    if (this.isMob) this.spawnMob(); // Circle Spawn Positioning
    else this.v = new Circle(new Vec2(0, 0), this.size); // Circle Spawn Positioning (plobably Player)

    // Rendering
    this.circle(0, 0, this.size);
    this.fill(this.color);

    const Random = Math.random() * Math.PI * 2;
    if (this.isMob)
      this.speedVec = new Vec2(Math.cos(Random), Math.sin(Random)).mul(0.5);
    else this.speedVec = new Vec2(0, 0);
  }

  spawnMob() {
    const spawnX =
      this.size + Math.random() * (window.innerWidth - this.size * 2);
    const spawnY =
      this.size + Math.random() * (window.innerHeight - this.size * 2);

    this.v = new Circle(new Vec2(spawnX, spawnY), this.size);
  }

  update(mouse?: Vec2) {
    if(!this.isMob) this.v.p = mouse ?? new Vec2(0, 0);
    else this.v.p = this.v.p.add(this.speedVec);
    this.x = this.v.p.x;
    this.y = this.v.p.y;
  }

  isHitBall(mobs: ball[]) {
    for (const _b of mobs) {
      if (this.hash === _b.hash) continue;
      if (this.v.p.dist(_b.v.p) < this.size + _b.size) {
        let n = this.v.p.sub(_b.v.p).norm();
        this.speedVec = this.speedVec.sub(n.mul(2 * this.speedVec.dot(n)));
        this.v.p = _b.v.p.add(n.mul(this.size + _b.size));
      }
    }
  }

  isHitSegment(segs: Segment[]) {
    for (const _seg of segs) {
      let v1 = this.v.p.sub(_seg._start); // Vector from the Segment's Start to the Circle's Position
      let n = _seg.normVec();
      // Is Hit the straight line that extends the segment
      if (Math.abs(v1.dot(n)) >= this.size) continue; // Not Hit
      let v2 = this.v.p.sub(_seg._end); // Vector from the Segment's End to the Circle's Position
      // Have Circle between the Segment's Start and Segment's End
      if (v1.cross(n) > 0 && v2.cross(n) < 0) {
        // calculate the cross product with Segment's Normal Vector and check they are over 0 or under 0

        this.speedVec = this.speedVec.add(n.mul(-this.speedVec.dot(n) * 2));

        if (v1.dot(n) > 0)
          this.v.p = this.v.p.add(n.mul(this.size - v1.dot(n)));
        else this.v.p = this.v.p.add(n.mul(-this.size - v1.dot(n)));
      } else if (v1.sqMag() < this.size ** 2) {
        // Hit the Segment's Start
        n = v1.norm();
        this.speedVec = this.speedVec.add(n.mul(-this.speedVec.dot(n) * 2));
        this.v.p = _seg._start.add(n.mul(this.size));
      } else if (v2.sqMag() < this.size ** 2) {
        // Hit the Segment's End
        n = v2.norm();
        this.speedVec = this.speedVec.add(n.mul(-this.speedVec.dot(n) * 2));
        this.v.p = _seg._end.add(n.mul(this.size));
      }
    }
  }
}
