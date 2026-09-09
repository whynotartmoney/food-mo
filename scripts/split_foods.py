#!/usr/bin/env python3
"""Split food sprite sheets: remove white background and crop each item."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ASSETS = Path("/Users/mic/.cursor/projects/Users-mic-Desktop/assets")
OUT = Path("/Users/mic/Desktop/金字塔/public/foods")
UI = Path("/Users/mic/Desktop/金字塔/public/ui")


def to_rgba(img: Image.Image) -> np.ndarray:
    return np.array(img.convert("RGBA"))


def knock_white(arr: np.ndarray, thresh: int = 245) -> np.ndarray:
    out = arr.copy()
    r, g, b, a = out[:, :, 0], out[:, :, 1], out[:, :, 2], out[:, :, 3]
    white = (r >= thresh) & (g >= thresh) & (b >= thresh) & (a > 0)
    out[:, :, 3] = np.where(white, 0, a)
    return out


def dilate(mask: np.ndarray, radius: int = 3) -> np.ndarray:
    h, w = mask.shape
    out = mask.copy()
    ys, xs = np.where(mask)
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            if dx * dx + dy * dy > radius * radius:
                continue
            ny, nx = ys + dy, xs + dx
            ok = (ny >= 0) & (ny < h) & (nx >= 0) & (nx < w)
            out[ny[ok], nx[ok]] = True
    return out


def label_components(mask: np.ndarray):
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    boxes = []
    lid = 0
    for y in range(h):
        row = mask[y]
        for x in range(w):
            if row[x] and labels[y, x] == 0:
                lid += 1
                q = deque([(y, x)])
                labels[y, x] = lid
                minx = maxx = x
                miny = maxy = y
                count = 0
                while q:
                    cy, cx = q.popleft()
                    count += 1
                    if cx < minx:
                        minx = cx
                    if cx > maxx:
                        maxx = cx
                    if cy < miny:
                        miny = cy
                    if cy > maxy:
                        maxy = cy
                    for ny, nx in (
                        (cy - 1, cx),
                        (cy + 1, cx),
                        (cy, cx - 1),
                        (cy, cx + 1),
                    ):
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and labels[ny, nx] == 0:
                            labels[ny, nx] = lid
                            q.append((ny, nx))
                boxes.append((lid, minx, miny, maxx, maxy, count))
    return labels, boxes


def crop_item(arr: np.ndarray, labels: np.ndarray, lid: int, box, pad: int = 8):
    _, minx, miny, maxx, maxy, _ = box
    h, w = arr.shape[:2]
    minx = max(0, minx - pad)
    miny = max(0, miny - pad)
    maxx = min(w - 1, maxx + pad)
    maxy = min(h - 1, maxy + pad)
    piece = arr[miny : maxy + 1, minx : maxx + 1].copy()
    lab = labels[miny : maxy + 1, minx : maxx + 1]
    piece[:, :, 3] = np.where(lab == lid, piece[:, :, 3], 0)
    return piece


def save_rgba(arr: np.ndarray, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(arr, "RGBA").save(path)


def split_sheet(path: Path, names: list[str], min_area: int, dilate_r: int = 2):
    arr = knock_white(to_rgba(Image.open(path)))
    mask = arr[:, :, 3] > 20
    mask = dilate(mask, dilate_r)
    labels, boxes = label_components(mask)
    boxes = [b for b in boxes if b[5] >= min_area]
    boxes.sort(key=lambda b: (b[2] // 80, b[1]))
    print(f"\n{path.name}: {len(boxes)} items (want {len(names)})")
    for i, b in enumerate(boxes):
        print(f"  {i:02d} size={b[3]-b[1]+1}x{b[5] and b[4]-b[2]+1} area={b[5]} pos=({b[1]},{b[2]})")
    n = min(len(boxes), len(names))
    for i in range(n):
        piece = crop_item(arr, labels, boxes[i][0], boxes[i])
        save_rgba(piece, OUT / f"{names[i]}.png")
        print(f"  -> {names[i]}.png {piece.shape[1]}x{piece.shape[0]}")
    if len(boxes) != len(names):
        print(f"  WARNING count mismatch")
    return boxes


def knock_and_trim(src: Path, dest: Path, thresh: int = 248):
    arr = knock_white(to_rgba(Image.open(src)), thresh)
    a = arr[:, :, 3]
    ys, xs = np.where(a > 10)
    if len(xs) == 0:
        save_rgba(arr, dest)
        return
    pad = 12
    minx, maxx = max(0, xs.min() - pad), min(arr.shape[1] - 1, xs.max() + pad)
    miny, maxy = max(0, ys.min() - pad), min(arr.shape[0] - 1, ys.max() + pad)
    save_rgba(arr[miny : maxy + 1, minx : maxx + 1], dest)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    UI.mkdir(parents=True, exist_ok=True)

    split_sheet(
        ASSETS / "172224-96c08dc3-9cf5-4ce9-a085-ca202252f426.png",
        ["yogurt", "milk", "swiss-cheese", "cheese-wheel"],
        min_area=400,
        dilate_r=2,
    )
    split_sheet(
        ASSETS / "172221-07ac73cf-fb61-4cf0-8f2a-c9fa1a658354.jpg",
        ["white-rice", "bread-basket", "noodles", "brown-rice", "congee"],
        min_area=800,
        dilate_r=3,
    )
    split_sheet(
        ASSETS / "172223-08624e06-c83e-430a-bb43-61dbce4178ca.jpg",
        ["fish", "steak", "chicken-leg", "eggs", "roast-chicken", "salmon"],
        min_area=800,
        dilate_r=3,
    )
    split_sheet(
        ASSETS / "172225-71665e67-d811-4a35-9b7d-d27cb2e4db1e.jpg",
        [
            "pineapple",
            "carrot",
            "corn",
            "pumpkin",
            "watermelon",
            "broccoli",
            "peppers",
            "strawberry",
            "starfruit",
            "bok-choy",
            "pear",
            "orange",
            "tomato",
            "bananas",
        ],
        min_area=600,
        dilate_r=2,
    )
    split_sheet(
        ASSETS / "172222-db82b396-4294-413d-a1e3-72a63e835710.jpg",
        [
            "chips",
            "chocolate",
            "gummy",
            "candies",
            "cake",
            "cupcake",
            "fried-chicken",
            "fries",
            "sugar",
            "salt",
            "oil-butter",
            "cans",
            "soda",
        ],
        min_area=500,
        dilate_r=3,
    )

    knock_and_trim(ASSETS / "basket.png", UI / "basket.png")
    knock_and_trim(ASSETS / "stamp-blank.png", UI / "stamp.png")
    Image.open(ASSETS / "supermarket-bg.png").convert("RGB").save(UI / "supermarket-bg.jpg", quality=88)
    print("\nDone.")


if __name__ == "__main__":
    main()
