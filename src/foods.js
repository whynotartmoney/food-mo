export const FOODS = [
  { id: "white-rice", name: "白飯", src: "/foods/white-rice.png", group: "五穀類", healthy: true, pyramid: "grains" },
  { id: "brown-rice", name: "糙米", src: "/foods/brown-rice.png", group: "五穀類", healthy: true, pyramid: "grains" },
  { id: "noodles", name: "麵", src: "/foods/noodles.png", group: "五穀類", healthy: true, pyramid: "grains" },
  { id: "congee", name: "粥", src: "/foods/congee.png", group: "五穀類", healthy: true, pyramid: "grains" },
  { id: "bread-basket", name: "麵包", src: "/foods/bread-basket.png", group: "五穀類", healthy: true, pyramid: "grains" },
  { id: "corn", name: "粟米", src: "/foods/corn.png", group: "蔬菜類", healthy: true, pyramid: "grains" },
  { id: "pineapple", name: "菠蘿", src: "/foods/pineapple.png", group: "水果類", healthy: true, pyramid: "fruit" },
  { id: "strawberry", name: "士多啤梨", src: "/foods/strawberry.png", group: "水果類", healthy: true, pyramid: "fruit" },
  { id: "bananas", name: "香蕉", src: "/foods/bananas.png", group: "水果類", healthy: true, pyramid: "fruit" },
  { id: "pear", name: "梨", src: "/foods/pear.png", group: "水果類", healthy: true, pyramid: "fruit" },
  { id: "orange", name: "橙", src: "/foods/orange.png", group: "水果類", healthy: true, pyramid: "fruit" },
  { id: "starfruit", name: "楊桃", src: "/foods/starfruit.png", group: "水果類", healthy: true, pyramid: "fruit" },
  { id: "carrot", name: "紅蘿蔔", src: "/foods/carrot.png", group: "蔬菜類", healthy: true, pyramid: "veg" },
  { id: "broccoli", name: "西蘭花", src: "/foods/broccoli.png", group: "蔬菜類", healthy: true, pyramid: "veg" },
  { id: "tomato", name: "番茄", src: "/foods/tomato.png", group: "蔬菜類", healthy: true, pyramid: "veg" },
  { id: "pumpkin-peppers", name: "南瓜", src: "/foods/pumpkin-peppers.png", group: "蔬菜類", healthy: true, pyramid: "veg" },
  { id: "fish", name: "魚", src: "/foods/fish.png", group: "蛋魚肉類", healthy: true, pyramid: "protein" },
  { id: "steak", name: "牛肉", src: "/foods/steak.png", group: "蛋魚肉類", healthy: true, pyramid: "protein" },
  { id: "eggs", name: "蛋", src: "/foods/eggs.png", group: "蛋魚肉類", healthy: true, pyramid: "protein" },
  { id: "salmon", name: "三文魚", src: "/foods/salmon.png", group: "蛋魚肉類", healthy: true, pyramid: "protein" },
  { id: "chicken-leg", name: "雞腿", src: "/foods/chicken-leg.png", group: "蛋魚肉類", healthy: true, pyramid: "protein" },
  { id: "roast-chicken", name: "烤雞", src: "/foods/roast-chicken.png", group: "蛋魚肉類", healthy: true, pyramid: "protein" },
  { id: "yogurt", name: "乳酪", src: "/foods/yogurt.png", group: "奶類", healthy: true, pyramid: "dairy" },
  { id: "milk", name: "牛奶", src: "/foods/milk.png", group: "奶類", healthy: true, pyramid: "dairy" },
  { id: "swiss-cheese", name: "芝士", src: "/foods/swiss-cheese.png", group: "奶類", healthy: true, pyramid: "dairy" },
  { id: "cheese-wheel", name: "芝士輪", src: "/foods/cheese-wheel.png", group: "奶類", healthy: true, pyramid: "dairy" },
  { id: "tofu", name: "豆腐", src: "/foods/tofu.png", group: "奶類", healthy: true },
  { id: "nuts", name: "堅果", src: "/foods/nuts.png", group: "奶類", healthy: true },
  { id: "chips", name: "薯片", src: "/foods/chips.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "soda", name: "汽水", src: "/foods/soda.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "fries", name: "薯條", src: "/foods/fries.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "fried-chicken", name: "炸雞", src: "/foods/fried-chicken.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "chocolate", name: "朱古力", src: "/foods/chocolate.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "cake", name: "蛋糕", src: "/foods/cake.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "cupcake", name: "杯子蛋糕", src: "/foods/cupcake.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "gummy", name: "軟糖", src: "/foods/gummy.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "candies", name: "糖果", src: "/foods/candies.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "sugar", name: "糖", src: "/foods/sugar.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "salt", name: "鹽", src: "/foods/salt.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "oil", name: "油", src: "/foods/oil.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
  { id: "butter", name: "牛油", src: "/foods/butter.png", group: "油鹽糖類", healthy: false, pyramid: "oil" },
];

export const PYRAMID_ZONES = [
  { id: "grains", label: "五穀主食", hint: "吃最多" },
  { id: "veg", label: "蔬菜類", hint: "第2層左" },
  { id: "fruit", label: "水果類", hint: "第2層右" },
  { id: "dairy", label: "奶類", hint: "第3層左" },
  { id: "protein", label: "魚禽肉蛋", hint: "第3層右" },
  { id: "oil", label: "油鹽糖", hint: "少吃" },
];

const GROUPS = ["五穀類", "水果類", "蔬菜類", "蛋魚肉類", "奶類", "油鹽糖類"];

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRound(count = 12) {
  const byGroup = Object.fromEntries(GROUPS.map((g) => [g, FOODS.filter((f) => f.group === g)]));
  const chosen = [];
  for (const g of GROUPS) {
    chosen.push(...shuffle(byGroup[g]).slice(0, 2));
  }
  return shuffle(chosen).slice(0, count);
}

export function pickPyramidRound(perZone = 2) {
  const chosen = [];
  for (const zone of PYRAMID_ZONES) {
    chosen.push(...shuffle(FOODS.filter((f) => f.pyramid === zone.id)).slice(0, perZone));
  }
  return shuffle(chosen);
}
