import { describe, expect, test } from 'vitest';

import { contentBox, pointToUv, uvToPoint } from './geometry';

const el = { left: 0, top: 0, width: 1000, height: 1000 };

describe('contentBox (object-fit: contain)', () => {
  test('16:9 video in a square box is letterboxed top and bottom', () => {
    const box = contentBox(el, 1920, 1080);
    expect(box.left).toBeCloseTo(0);
    expect(box.top).toBeCloseTo(218.75);
    expect(box.width).toBeCloseTo(1000);
    expect(box.height).toBeCloseTo(562.5);
  });
  test('unknown video size uses the whole box', () => expect(contentBox(el, 0, 0)).toEqual(el));
  test('tall video is pillarboxed', () => {
    const box = contentBox({ left: 10, top: 20, width: 1600, height: 900 }, 1080, 1920);
    expect(box.top).toBe(20);
    expect(box.height).toBe(900);
    expect(box.left).toBeCloseTo(10 + (1600 - 506.25) / 2);
  });
});

describe('pointToUv', () => {
  test('centre of the picture is 0.5, 0.5', () => expect(pointToUv(500, 500, el, 1920, 1080)).toEqual({ u: 0.5, v: 0.5 }));
  test('a point in the letterbox is outside the picture', () => expect(pointToUv(500, 100, el, 1920, 1080)).toBeNull());
  test('top-left corner of the picture is 0, 0', () => {
    const uv = pointToUv(0, 218.75, el, 1920, 1080)!;
    expect(uv.u).toBeCloseTo(0);
    expect(uv.v).toBeCloseTo(0);
  });
});

describe('uvToPoint', () => {
  test('round-trips with pointToUv', () => {
    const p = uvToPoint(0.25, 0.75, el, 1920, 1080);
    const uv = pointToUv(p.x, p.y, el, 1920, 1080)!;
    expect(uv.u).toBeCloseTo(0.25);
    expect(uv.v).toBeCloseTo(0.75);
  });
});

describe('contentBox with a DOMRect-like box', () => {
  class RectLike {
    get left() {
      return 10;
    }
    get top() {
      return 20;
    }
    get width() {
      return 300;
    }
    get height() {
      return 200;
    }
  }
  test('copies getter-backed fields when the video size is unknown', () =>
    expect(contentBox(new RectLike(), 0, 0)).toEqual({ left: 10, top: 20, width: 300, height: 200 }));
});
