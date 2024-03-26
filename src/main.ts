import { Application } from "pixi.js";
import { ball } from "./components/ball";
import { Segment, Vec2 } from "./components/vector";

export const Main = async (canvas: HTMLCanvasElement) => {
  const Mouse = new Vec2(0, 0);
  document.addEventListener("mousemove", (e) => {
    Mouse.x = e.clientX;
    Mouse.y = e.clientY;
  });

  const app = new Application();
  await app.init({
    canvas: canvas,
    resizeTo: window,
    backgroundColor: 0x1099bb,
  });

  const appBorderSegs = [
    new Segment(new Vec2(0, 0), new Vec2(app.screen.width, 0)),
    new Segment(
      new Vec2(app.screen.width, 0),
      new Vec2(app.screen.width, app.screen.height)
    ),
    new Segment(
      new Vec2(app.screen.width, app.screen.height),
      new Vec2(0, app.screen.height)
    ),
    new Segment(new Vec2(0, app.screen.height), new Vec2(0, 0)),
  ];

  function updateAppBorderSegs() {
    appBorderSegs[0]._start = new Vec2(0, 0);
    appBorderSegs[0]._end = new Vec2(app.screen.width, 0);
    appBorderSegs[1]._start = new Vec2(app.screen.width, 0);
    appBorderSegs[1]._end = new Vec2(app.screen.width, app.screen.height);
    appBorderSegs[2]._start = new Vec2(app.screen.width, app.screen.height);
    appBorderSegs[2]._end = new Vec2(0, app.screen.height);
    appBorderSegs[3]._start = new Vec2(0, app.screen.height);
    appBorderSegs[3]._end = new Vec2(0, 0);
  }

  window.addEventListener("resize", updateAppBorderSegs);

  const b = new ball(50, 0xff0000, false);
  console.log(b.isMob)
  app.stage.addChild(b);

  const balls = [];
  for (let i = 0; i < 500; i++) {
    var _b = new ball(10, 0xffffff * Math.random());
    balls.push(_b);
    app.stage.addChild(_b);
  }

  app.ticker.add(() => {
    b.v.p.set(Mouse.x, Mouse.y);
    b.update(Mouse);

    for (const _b of balls) {
      _b.update();
      _b.isHitBall(new Array().concat(balls, [b]));
      _b.isHitSegment(appBorderSegs);
    }
  });
};
