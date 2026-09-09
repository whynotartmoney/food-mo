import "./style.css";
import { pickRound } from "./foods.js";

const TOTAL_MS = 60_000;
const $ = (id) => document.getElementById(id);

const state = {
  foods: [],
  placements: {},
  started: false,
  ended: false,
  remain: TOTAL_MS,
  timerId: null,
  drag: null,
};

function placeInBasket(el, index, total) {
  const col = index % 4;
  const row = Math.floor(index / 4);
  const jitterX = ((index * 17) % 13) - 6;
  const jitterY = ((index * 11) % 11) - 5;
  el.style.left = `${8 + col * 24 + jitterX}%`;
  el.style.top = `${6 + row * 28 + jitterY}%`;
}

function makeFoodEl(food, index) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "food";
  el.dataset.id = food.id;
  el.innerHTML = `<img src="${food.src}" alt="${food.name}" /><span class="tag">${food.name}</span>`;
  el.addEventListener("pointerdown", (e) => startDrag(e, food, el));
  placeInBasket(el, index, state.foods.length);
  return el;
}

function render() {
  const basket = $("basket-items");
  const healthy = $("healthy-drop");
  const unhealthy = $("unhealthy-drop");
  basket.innerHTML = "";
  healthy.innerHTML = "";
  unhealthy.innerHTML = "";

  state.foods.forEach((food, i) => {
    const el = makeFoodEl(food, i);
    const where = state.placements[food.id] || "basket";
    if (where === "healthy") {
      el.style.left = "";
      el.style.top = "";
      healthy.appendChild(el);
    } else if (where === "unhealthy") {
      el.style.left = "";
      el.style.top = "";
      unhealthy.appendChild(el);
    } else {
      basket.appendChild(el);
    }
  });
}

function startDrag(e, food, el) {
  if (!state.started || state.ended) return;
  e.preventDefault();
  el.classList.add("dragging");
  const ghost = $("drag-ghost");
  ghost.hidden = false;
  ghost.innerHTML = `<img src="${food.src}" alt="" />`;
  ghost.style.left = `${e.clientX}px`;
  ghost.style.top = `${e.clientY}px`;
  state.drag = { food, el };

  const move = (ev) => {
    ghost.style.left = `${ev.clientX}px`;
    ghost.style.top = `${ev.clientY}px`;
    highlightBin(ev.clientX, ev.clientY);
  };
  const up = (ev) => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", up);
    ghost.hidden = true;
    el.classList.remove("dragging");
    const bin = hitBin(ev.clientX, ev.clientY);
    $("bin-healthy").classList.remove("over");
    $("bin-unhealthy").classList.remove("over");
    if (bin) {
      state.placements[food.id] = bin;
      render();
      if (Object.keys(state.placements).length === state.foods.length) {
        finish("submit");
      }
    }
    state.drag = null;
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
}

function hitBin(x, y) {
  const healthy = $("bin-healthy").getBoundingClientRect();
  const unhealthy = $("bin-unhealthy").getBoundingClientRect();
  if (x >= healthy.left && x <= healthy.right && y >= healthy.top && y <= healthy.bottom) {
    return "healthy";
  }
  if (x >= unhealthy.left && x <= unhealthy.right && y >= unhealthy.top && y <= unhealthy.bottom) {
    return "unhealthy";
  }
  return null;
}

function highlightBin(x, y) {
  const bin = hitBin(x, y);
  $("bin-healthy").classList.toggle("over", bin === "healthy");
  $("bin-unhealthy").classList.toggle("over", bin === "unhealthy");
}

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return { m, s: String(s).padStart(2, "0") };
}

function tick() {
  state.remain -= 250;
  const { m, s } = formatTime(state.remain);
  $("mins").textContent = String(m);
  $("secs").textContent = s;
  $("timer").classList.toggle("urgent", state.remain <= 10_000);
  if (state.remain <= 0) finish("timeout");
}

function allCorrect() {
  if (state.foods.some((f) => !state.placements[f.id])) return false;
  return state.foods.every((f) => {
    const want = f.healthy ? "healthy" : "unhealthy";
    return state.placements[f.id] === want;
  });
}

function finish(reason) {
  if (state.ended) return;
  state.ended = true;
  clearInterval(state.timerId);
  const win = allCorrect();
  const overlay = $("result-overlay");
  const stamp = $("win-stamp");
  overlay.classList.remove("hidden");
  if (win) {
    stamp.classList.remove("hidden");
    $("result-title").textContent = "全部正確！";
    $("result-msg").textContent = "限時內分類成功，送你一枚叻叻貼紙！";
  } else {
    stamp.classList.add("hidden");
    $("result-title").className = "lose-text";
    $("result-title").textContent = "加油！再來吧！";
    const left = state.foods.filter((f) => !state.placements[f.id]).length;
    $("result-msg").textContent =
      reason === "timeout"
        ? left
          ? "時間到了，還有食物未分類。再試一次吧！"
          : "時間到了，有些食物放錯格子了。"
        : "有食物放錯了格子，再練習一次就更棒！";
  }
}

function newGame() {
  clearInterval(state.timerId);
  state.foods = pickRound(12);
  state.placements = {};
  state.started = false;
  state.ended = false;
  state.remain = TOTAL_MS;
  $("mins").textContent = "1";
  $("secs").textContent = "00";
  $("timer").classList.remove("urgent");
  $("result-overlay").classList.add("hidden");
  $("result-title").className = "";
  $("start-overlay").classList.remove("hidden");
  render();
}

function startGame() {
  $("start-overlay").classList.add("hidden");
  state.started = true;
  state.ended = false;
  state.remain = TOTAL_MS;
  clearInterval(state.timerId);
  state.timerId = setInterval(tick, 250);
}

$("btn-start").addEventListener("click", startGame);
$("btn-again").addEventListener("click", () => {
  newGame();
});
$("btn-reset").addEventListener("click", () => newGame());
$("btn-check").addEventListener("click", () => {
  if (!state.started || state.ended) return;
  finish("submit");
});

newGame();
