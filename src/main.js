import "./style.css";
import { pickRound, pickPyramidRound } from "./foods.js";

const LEVELS = {
  1: {
    title: "健康食物分類大挑戰",
    chip: "第 1 關",
    hint: "從大籃子揀食物，拖去「健康食物」或「不健康食物」格子。限時 1 分鐘，全部放對就勝利！",
    minutes: 1,
    ms: 60_000,
    startTitle: "準備好了嗎？",
    startDesc: "小朋友要把籃子裡的食物，分成健康和不健康兩類。",
    rules: [
      "限時 <b>1 分 00 秒</b>",
      "用手指或滑鼠把食物拖進格子",
      "全部正確會得到「叻叻」貼紙，再去第二關",
    ],
  },
  2: {
    title: "健康飲食金字塔",
    chip: "第 2 關",
    hint: "由下至上：底層吃最多、頂層少吃。把食物拖到金字塔正確一層。限時 2 分鐘。",
    minutes: 2,
    ms: 120_000,
    startTitle: "第二關：健康飲食金字塔",
    startDesc: "把食物放到金字塔每一層：五穀在最底、蔬菜左、水果右、奶類左上、魚肉蛋右上、油鹽糖在最頂。",
    rules: [
      "限時 <b>2 分 00 秒</b>",
      "底層吃最多，頂層少吃",
      "全部放對會再得到「叻叻」貼紙",
    ],
  },
};

const $ = (id) => document.getElementById(id);

const state = {
  level: 1,
  foods: [],
  placements: {},
  started: false,
  ended: false,
  remain: LEVELS[1].ms,
  timerId: null,
};

function basketId() {
  return state.level === 2 ? "basket-items-l2" : "basket-items";
}

function placeInBasket(el, index) {
  if (state.level === 2) return;
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
  placeInBasket(el, index);
  return el;
}

function render() {
  if (state.level === 1) {
    const basket = $("basket-items");
    const healthy = $("healthy-drop");
    const unhealthy = $("unhealthy-drop");
    basket.innerHTML = "";
    healthy.innerHTML = "";
    unhealthy.innerHTML = "";
    state.foods.forEach((food, i) => {
      const el = makeFoodEl(food, i);
      const where = state.placements[food.id] || "basket";
      if (where === "healthy" || where === "unhealthy") {
        el.style.left = "";
        el.style.top = "";
        (where === "healthy" ? healthy : unhealthy).appendChild(el);
      } else {
        basket.appendChild(el);
      }
    });
    return;
  }

  const basket = $("basket-items-l2");
  basket.innerHTML = "";
  document.querySelectorAll("#pyramid .zone").forEach((zone) => {
    [...zone.querySelectorAll(".food")].forEach((n) => n.remove());
  });
  state.foods.forEach((food, i) => {
    const el = makeFoodEl(food, i);
    const where = state.placements[food.id] || "basket";
    const zone = document.querySelector(`#pyramid .zone[data-zone="${where}"]`);
    if (zone) {
      el.style.left = "";
      el.style.top = "";
      zone.appendChild(el);
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

  const move = (ev) => {
    ghost.style.left = `${ev.clientX}px`;
    ghost.style.top = `${ev.clientY}px`;
    highlightTarget(ev.clientX, ev.clientY);
  };
  const up = (ev) => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", up);
    ghost.hidden = true;
    el.classList.remove("dragging");
    const target = hitTarget(ev.clientX, ev.clientY);
    clearHighlights();
    if (target) {
      state.placements[food.id] = target;
      render();
      if (Object.keys(state.placements).length === state.foods.length) {
        finish("submit");
      }
    }
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
}

function hitTarget(x, y) {
  const stack = document.elementsFromPoint(x, y);
  if (state.level === 1) {
    if (stack.some((n) => n.id === "bin-healthy" || n.closest?.("#bin-healthy"))) return "healthy";
    if (stack.some((n) => n.id === "bin-unhealthy" || n.closest?.("#bin-unhealthy"))) return "unhealthy";
    return null;
  }
  const zone = stack.find((n) => n.dataset?.zone || n.closest?.("[data-zone]"));
  if (!zone) return null;
  return zone.dataset?.zone || zone.closest("[data-zone]").dataset.zone;
}

function highlightTarget(x, y) {
  const target = hitTarget(x, y);
  if (state.level === 1) {
    $("bin-healthy").classList.toggle("over", target === "healthy");
    $("bin-unhealthy").classList.toggle("over", target === "unhealthy");
    return;
  }
  document.querySelectorAll("#pyramid .zone").forEach((z) => {
    z.classList.toggle("over", z.dataset.zone === target);
  });
}

function clearHighlights() {
  $("bin-healthy")?.classList.remove("over");
  $("bin-unhealthy")?.classList.remove("over");
  document.querySelectorAll("#pyramid .zone").forEach((z) => z.classList.remove("over"));
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

function markWrongFoods() {
  document.querySelectorAll(".food.wrong").forEach((el) => el.classList.remove("wrong"));
  $("pyramid")?.classList.add("review");
  if (state.level !== 2) return;
  state.foods.forEach((food) => {
    const placed = state.placements[food.id];
    if (placed && placed === food.pyramid) return;
    document.querySelectorAll(`.food[data-id="${food.id}"]`).forEach((el) => {
      el.classList.add("wrong");
    });
  });
}

function allCorrect() {
  if (state.foods.some((f) => !state.placements[f.id])) return false;
  if (state.level === 1) {
    return state.foods.every((f) => state.placements[f.id] === (f.healthy ? "healthy" : "unhealthy"));
  }
  return state.foods.every((f) => state.placements[f.id] === f.pyramid);
}

function finish(reason) {
  if (state.ended) return;
  state.ended = true;
  clearInterval(state.timerId);
  const win = allCorrect();
  const overlay = $("result-overlay");
  const stamp = $("win-stamp");
  const next = $("btn-next");
  overlay.classList.remove("hidden", "dock");
  next.classList.add("hidden");
  $("result-title").className = "";

  if (win) {
    stamp.classList.remove("hidden");
    $("result-title").textContent = "全部正確！";
    if (state.level === 1) {
      $("result-msg").textContent = "限時內分類成功，送你一枚叻叻貼紙！可以前往第二關。";
      next.classList.remove("hidden");
    } else {
      $("result-msg").textContent = "金字塔全部放對了，送你一枚叻叻貼紙！";
    }
  } else {
    stamp.classList.add("hidden");
    $("result-title").className = "lose-text";
    $("result-title").textContent = "加油！再來吧！";
    const left = state.foods.filter((f) => !state.placements[f.id]).length;
    $("result-msg").textContent =
      reason === "timeout"
        ? left
          ? "時間到了，還有食物未分類。再試一次吧！"
          : "時間到了，有些食物放錯位置了。"
        : state.level === 2
          ? "紅圈圈住放錯的位置，再練習一次就更棒！"
          : "有食物放錯了位置，再練習一次就更棒！";
    if (state.level === 2) {
      markWrongFoods();
      overlay.classList.add("dock");
    }
  }
}

function applyLevelChrome() {
  const cfg = LEVELS[state.level];
  $("game-title").textContent = cfg.title;
  $("level-chip").textContent = cfg.chip;
  $("game-hint").textContent = cfg.hint;
  $("start-title").textContent = cfg.startTitle;
  $("start-desc").textContent = cfg.startDesc;
  $("start-rules").innerHTML = cfg.rules.map((r) => `<li>${r}</li>`).join("");
  $("mins").textContent = String(cfg.minutes);
  $("secs").textContent = "00";
  document.body.classList.toggle("theme-l2", state.level === 2);
  document.querySelector(".app").classList.toggle("theme-l2", state.level === 2);
  $("level-1").classList.toggle("hidden", state.level !== 1);
  $("level-2").classList.toggle("hidden", state.level !== 2);
}

function newGame(level = 1) {
  clearInterval(state.timerId);
  state.level = level;
  state.foods = level === 1 ? pickRound(12) : pickPyramidRound(2);
  state.placements = {};
  state.started = false;
  state.ended = false;
  state.remain = LEVELS[level].ms;
  $("timer").classList.remove("urgent");
  $("result-overlay").classList.add("hidden");
  $("result-overlay").classList.remove("dock");
  $("result-title").className = "";
  $("btn-next").classList.add("hidden");
  applyLevelChrome();
  $("pyramid")?.classList.remove("review");
  $("start-overlay").classList.remove("hidden");
  render();
}

function startGame() {
  $("start-overlay").classList.add("hidden");
  state.started = true;
  state.ended = false;
  state.remain = LEVELS[state.level].ms;
  clearInterval(state.timerId);
  state.timerId = setInterval(tick, 250);
}

$("btn-start").addEventListener("click", startGame);
$("btn-again").addEventListener("click", () => newGame(state.level));
$("btn-next").addEventListener("click", () => newGame(2));
$("btn-reset").addEventListener("click", () => newGame(state.level));
$("btn-check").addEventListener("click", () => {
  if (!state.started || state.ended) return;
  finish("submit");
});

const bootLevel = new URLSearchParams(location.search).get("level") === "2" ? 2 : 1;
newGame(bootLevel);
