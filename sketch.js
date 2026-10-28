// 設定遊戲使用的全域狀態，讓畫面與互動共用同一份資料。
let page = "start"; // 記錄目前顯示的遊戲頁面。
let board = []; // 儲存棋盤上依序排列的城市與特殊格。
let hitAreas = []; // 儲存本幀繪製的按鈕範圍，供滑鼠點擊判斷。
let boardRect = {}; // 儲存棋盤的響應式位置與尺寸。
let currentTile = 0; // 記錄玩家目前所在的棋盤格。
let landedOnStart = false; // 記錄本回合是否剛好停在起點格。
let score = 15; // 設定遊戲開始時的分數。
let diceValue = 0; // 記錄最近一次擲出的骰子點數。
let lastMove = 0; // 記錄最近一次移動的步數。
let movementRemaining = 0; // 記錄本次骰子尚未走完的格數。
let movementStepAt = 0; // 記錄上次棋子前進的時間。
let footprints = []; // 儲存玩家走過的格子與腳印淡出時間。
let currentQuestion = null; // 儲存正在回答的單字題。
let answerFeedback = ""; // 儲存作答後顯示的提示文字。
let answerWasCorrect = false; // 記錄上一題是否答對。
let specialMessage = ""; // 儲存機會或命運事件的說明文字。
let specialScoreChange = 0; // 記錄機會或命運事件帶來的分數變化。
let specialNextPage = "play"; // 記錄事件卡關閉後要前往的畫面。
let usedQuestions = new Set(); // 記錄本局已使用過的題目，避免重複。
let questionDecks = {}; // 儲存各城市洗牌後的單字題目。
let gameRound = 0; // 記錄目前遊戲局數，第一次開始時會升到第一局。
let gameOverReason = ""; // 儲存遊戲結束時顯示的原因。
let confetti = []; // 儲存成功畫面中飄落的彩帶資料。
let palette = {}; // 集中管理遊戲使用的可愛配色。
let selectedCharacter = 0; // 記錄目前選取的旅行角色。
const characters = [ // 設定四種角色與各自的代表色。
  { name: "旅行者", color: "#68b9e8" }, // 使用天空藍代表旅行者。
  { name: "冒險家", color: "#f28a78" }, // 使用珊瑚紅代表冒險家。
  { name: "尋寶者", color: "#e5b94f" }, // 使用金黃色代表尋寶者。
  { name: "觀光客", color: "#70c69a" } // 使用薄荷綠代表觀光客。
]; // 結束角色資料設定。

// 建立各國專屬的英文單字題庫，每個城市的單字都不重複。
const questionBank = {
  London: [
    { word: "umbrella", answer: "雨傘", options: ["雨傘", "地圖", "行李箱", "車票"] },
    { word: "castle", answer: "城堡", options: ["城堡", "花園", "車站", "橋樑"] },
    { word: "biscuit", answer: "餅乾", options: ["餅乾", "湯匙", "茶壺", "麵包"] },
    { word: "bridge", answer: "橋", options: ["橋", "車站", "廣場", "鐘樓"] },
    { word: "raincoat", answer: "雨衣", options: ["雨衣", "雨傘", "手套", "帽子"] }
  ],
  Paris: [
    { word: "croissant", answer: "可頌", options: ["可頌", "起司", "葡萄", "蛋糕"] },
    { word: "museum", answer: "博物館", options: ["博物館", "圖書館", "市場", "劇院"] },
    { word: "perfume", answer: "香水", options: ["香水", "蠟燭", "肥皂", "花瓶"] },
    { word: "gallery", answer: "畫廊", options: ["畫廊", "教室", "劇院", "餐廳"] },
    { word: "bakery", answer: "麵包店", options: ["麵包店", "花店", "書店", "旅館"] }
  ],
  Rome: [
    { word: "fountain", answer: "噴泉", options: ["噴泉", "廣場", "噴火", "瀑布"] },
    { word: "helmet", answer: "頭盔", options: ["頭盔", "帽子", "盔甲", "盾牌"] },
    { word: "olive", answer: "橄欖", options: ["橄欖", "番茄", "檸檬", "洋蔥"] },
    { word: "column", answer: "柱子", options: ["柱子", "屋頂", "階梯", "窗戶"] },
    { word: "statue", answer: "雕像", options: ["雕像", "壁畫", "噴泉", "花園"] }
  ],
  Cairo: [
    { word: "pyramid", answer: "金字塔", options: ["金字塔", "燈塔", "寺廟", "宮殿"] },
    { word: "desert", answer: "沙漠", options: ["沙漠", "森林", "海洋", "草原"] },
    { word: "camel", answer: "駱駝", options: ["駱駝", "斑馬", "長頸鹿", "羚羊"] },
    { word: "oasis", answer: "綠洲", options: ["綠洲", "沙丘", "洞穴", "島嶼"] },
    { word: "scarf", answer: "圍巾", options: ["圍巾", "腰帶", "手帕", "披風"] }
  ],
  Nairobi: [
    { word: "giraffe", answer: "長頸鹿", options: ["長頸鹿", "大象", "河馬", "獅子"] },
    { word: "savanna", answer: "大草原", options: ["大草原", "雨林", "山谷", "冰原"] },
    { word: "rhino", answer: "犀牛", options: ["犀牛", "野牛", "犛牛", "水牛"] },
    { word: "safari", answer: "野生動物之旅", options: ["野生動物之旅", "野餐", "露營", "登山"] },
    { word: "waterhole", answer: "水坑", options: ["水坑", "瀑布", "水井", "池塘"] }
  ],
  "New York": [
    { word: "subway", answer: "地鐵", options: ["地鐵", "渡輪", "纜車", "公車"] },
    { word: "skyscraper", answer: "摩天大樓", options: ["摩天大樓", "摩天輪", "公寓", "倉庫"] },
    { word: "pretzel", answer: "蝴蝶餅", options: ["蝴蝶餅", "甜甜圈", "鬆餅", "爆米花"] },
    { word: "taxi", answer: "計程車", options: ["計程車", "地鐵", "渡輪", "腳踏車"] },
    { word: "avenue", answer: "大道", options: ["大道", "小巷", "橋梁", "隧道"] }
  ],
  Toronto: [
    { word: "maple", answer: "楓樹", options: ["楓樹", "松樹", "棕櫚樹", "橡樹"] },
    { word: "moose", answer: "麋鹿", options: ["麋鹿", "馴鹿", "狐狸", "海狸"] },
    { word: "igloo", answer: "冰屋", options: ["冰屋", "木屋", "帳篷", "船屋"] },
    { word: "beaver", answer: "海狸", options: ["海狸", "海豹", "水獺", "松鼠"] },
    { word: "canoe", answer: "獨木舟", options: ["獨木舟", "帆船", "渡輪", "潛水艇"] }
  ],
  "Rio de Janeiro": [
    { word: "carnival", answer: "嘉年華", options: ["嘉年華", "音樂會", "市集", "遊行"] },
    { word: "parrot", answer: "鸚鵡", options: ["鸚鵡", "孔雀", "天鵝", "老鷹"] },
    { word: "waterfall", answer: "瀑布", options: ["瀑布", "噴泉", "河流", "湖泊"] },
    { word: "drum", answer: "鼓", options: ["鼓", "吉他", "小提琴", "長笛"] },
    { word: "beach", answer: "海灘", options: ["海灘", "山頂", "森林", "沙漠"] }
  ],
  "Mexico City": [
    { word: "sombrero", answer: "寬邊帽", options: ["寬邊帽", "雨衣", "圍巾", "手套"] },
    { word: "taco", answer: "塔可餅", options: ["塔可餅", "玉米粥", "披薩", "飯糰"] },
    { word: "cactus", answer: "仙人掌", options: ["仙人掌", "蘆薈", "竹子", "蕨類"] },
    { word: "guitar", answer: "吉他", options: ["吉他", "鼓", "鋼琴", "小號"] },
    { word: "blanket", answer: "毯子", options: ["毯子", "枕頭", "窗簾", "地毯"] }
  ],
  Tokyo: [
    { word: "lantern", answer: "燈籠", options: ["燈籠", "風箏", "風鈴", "紙傘"] },
    { word: "origami", answer: "摺紙", options: ["摺紙", "書法", "陶藝", "刺繡"] },
    { word: "bento", answer: "便當", options: ["便當", "早餐", "點心", "湯品"] },
    { word: "chopsticks", answer: "筷子", options: ["筷子", "叉子", "湯匙", "盤子"] },
    { word: "shrine", answer: "神社", options: ["神社", "城堡", "車站", "市場"] }
  ],
  Taipei: [
    { word: "night market", answer: "夜市", options: ["夜市", "花市", "書店", "車站"] },
    { word: "bubble tea", answer: "珍珠奶茶", options: ["珍珠奶茶", "豆漿", "果汁", "熱可可"] },
    { word: "mountain", answer: "山", options: ["山", "海灣", "島嶼", "平原"] },
    { word: "lantern", answer: "燈籠", options: ["燈籠", "路燈", "蠟燭", "手電筒"] },
    { word: "waterfall", answer: "瀑布", options: ["瀑布", "海浪", "水井", "冰河"] }
  ],
  Seoul: [
    { word: "hanbok", answer: "韓服", options: ["韓服", "和服", "制服", "披風"] },
    { word: "kimchi", answer: "泡菜", options: ["泡菜", "豆腐", "海苔", "年糕"] },
    { word: "palace", answer: "宮殿", options: ["宮殿", "城堡", "教堂", "庭院"] },
    { word: "taekwondo", answer: "跆拳道", options: ["跆拳道", "柔道", "游泳", "滑雪"] },
    { word: "noodle", answer: "麵條", options: ["麵條", "米飯", "沙拉", "麵包"] }
  ],
  Bangkok: [
    { word: "tuk-tuk", answer: "嘟嘟車", options: ["嘟嘟車", "腳踏車", "火車", "帆船"] },
    { word: "temple", answer: "寺廟", options: ["寺廟", "學校", "醫院", "餐廳"] },
    { word: "orchid", answer: "蘭花", options: ["蘭花", "玫瑰", "菊花", "百合"] },
    { word: "market", answer: "市場", options: ["市場", "圖書館", "博物館", "機場"] },
    { word: "coconut", answer: "椰子", options: ["椰子", "芒果", "香蕉", "鳳梨"] }
  ],
  Singapore: [
    { word: "merlion", answer: "魚尾獅", options: ["魚尾獅", "海豚", "海馬", "鯨魚"] },
    { word: "orchard", answer: "果園", options: ["果園", "花圃", "農場", "森林"] },
    { word: "harbor", answer: "港口", options: ["港口", "機場", "碼頭", "車庫"] },
    { word: "garden", answer: "花園", options: ["花園", "果園", "農場", "森林"] },
    { word: "skytower", answer: "觀景塔", options: ["觀景塔", "燈塔", "鐘樓", "水塔"] }
  ],
  Sydney: [
    { word: "kangaroo", answer: "袋鼠", options: ["袋鼠", "無尾熊", "袋熊", "袋獾"] },
    { word: "sailboat", answer: "帆船", options: ["帆船", "潛水艇", "遊艇", "渡輪"] },
    { word: "boomerang", answer: "迴力鏢", options: ["迴力鏢", "飛盤", "球棒", "風箏"] },
    { word: "koala", answer: "無尾熊", options: ["無尾熊", "袋鼠", "袋熊", "狐狸"] },
    { word: "harbor", answer: "海港", options: ["海港", "沙漠", "森林", "山洞"] }
  ]
}; // 結束所有國家單字題庫的設定。

// 初始化畫布、配色與棋盤資料。
function setup() {
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的全螢幕畫布。
  pixelDensity(1); // 降低高解析度螢幕的繪圖負擔，保持遊戲流暢。
  textFont("sans-serif"); // 使用跨平台字型顯示中英文內容。
  palette = { sky: "#dff5ff", ink: "#284766", blue: "#75c9ed", coral: "#ff9f91", yellow: "#ffd66e", green: "#55c99a", red: "#f27878", cream: "#fffaf0", lilac: "#c5b7f2" }; // 設定淺藍底色與糖果系遊戲配色。
  board = createBoard(); // 建立包含各洲城市與特殊格的完整棋盤。
  textAlign(CENTER, CENTER); // 設定文字預設以中央對齊，方便配置畫面。
} // 結束遊戲初始化。

// 依照視窗尺寸重新安排畫布內容。
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 視窗改變時同步調整全螢幕畫布尺寸。
} // 結束響應式畫布調整。

// 建立環狀棋盤，安排各洲城市、起點、機會與命運格。
function createBoard() {
  return [
    { type: "start", city: "出發", country: "起點", flag: "🚩", color: "#ffe28a" },
    { type: "city", city: "倫敦", country: "英國", continent: "歐洲", flag: "🇬🇧", key: "London", feature: "clock", featureName: "大笨鐘", color: "#d9efff" },
    { type: "city", city: "巴黎", country: "法國", continent: "歐洲", flag: "🇫🇷", key: "Paris", feature: "eiffel", featureName: "艾菲爾鐵塔", color: "#ffe2e2" },
    { type: "chance", city: "機會", country: "幸運卡", flag: "✨", color: "#fff0a8" },
    { type: "city", city: "羅馬", country: "義大利", continent: "歐洲", flag: "🇮🇹", key: "Rome", feature: "colosseum", featureName: "羅馬競技場", color: "#d9f3dc" },
    { type: "city", city: "開羅", country: "埃及", continent: "非洲", flag: "🇪🇬", key: "Cairo", feature: "pyramid", featureName: "金字塔", color: "#ffe7c2" },
    { type: "city", city: "奈洛比", country: "肯亞", continent: "非洲", flag: "🇰🇪", key: "Nairobi", feature: "giraffe", featureName: "長頸鹿", color: "#e5f1cb" },
    { type: "city", city: "紐約", country: "美國", continent: "美洲", flag: "🇺🇸", key: "New York", feature: "liberty", featureName: "自由女神像", color: "#e4e3ff" },
    { type: "city", city: "多倫多", country: "加拿大", continent: "美洲", flag: "🇨🇦", key: "Toronto", feature: "maple", featureName: "楓葉", color: "#ffe1e8" },
    { type: "city", city: "里約熱內盧", country: "巴西", continent: "美洲", flag: "🇧🇷", key: "christ", feature: "christ", featureName: "基督像山", color: "#d9f3dc" },
    { type: "city", city: "墨西哥城", country: "墨西哥", continent: "美洲", flag: "🇲🇽", key: "Mexico City", feature: "cactus", featureName: "仙人掌", color: "#ffedc8" },
    { type: "fate", city: "命運", country: "命運卡", flag: "🔮", color: "#e8dfff" },
    { type: "city", city: "東京", country: "日本", continent: "亞洲", flag: "🇯🇵", key: "Tokyo", feature: "tokyoTower", featureName: "東京鐵塔", color: "#ffe1e8" },
    { type: "city", city: "臺北", country: "臺灣", continent: "亞洲", flag: "🇹🇼", key: "Taipei", feature: "taipei101", featureName: "台北 101", color: "#ffe1e1" },
    { type: "city", city: "首爾", country: "韓國", continent: "亞洲", flag: "🇰🇷", key: "Seoul", feature: "hanbok", featureName: "韓服", color: "#e4e3ff" },
    { type: "city", city: "曼谷", country: "泰國", continent: "亞洲", flag: "🇹🇭", key: "Bangkok", feature: "temple", featureName: "金色寺廟", color: "#fff0c9" },
    { type: "city", city: "新加坡", country: "新加坡", continent: "亞洲", flag: "🇸🇬", key: "Singapore", feature: "merlion", featureName: "魚尾獅", color: "#d9f3dc" },
    { type: "city", city: "雪梨", country: "澳洲", continent: "大洋洲", flag: "🇦🇺", key: "Sydney", feature: "opera", featureName: "歌劇院", color: "#d9efff" }
  ]; // 回傳由起點出發、沿棋盤一圈排列的遊戲格。
} // 結束棋盤資料建立。

// 每一幀重新繪製背景、頁面內容與目前可點擊的按鈕。
function draw() {
  background(palette.sky); // 使用淺藍色作為整個遊戲畫布底色。
  hitAreas = []; // 清除上一幀的按鈕範圍，避免點到已消失的按鈕。
  if (page === "start") drawStartPage(); // 顯示可愛的遊戲起始頁。
  if (page === "instructions") drawInstructionsPage(); // 顯示進入遊戲前的玩法說明。
  if (page === "character") drawCharacterPage(); // 顯示遊戲開始前的角色選擇畫面。
  if (page === "play" || page === "moving" || page === "quiz" || page === "feedback" || page === "card") drawGamePage(); // 顯示棋盤、城市與目前遊戲狀態。
  if (page === "gameover") drawGameOverPage(); // 分數歸零時顯示結束畫面。
  if (page === "success") drawSuccessPage(); // 分數達到五十分時顯示冒險成功獎狀。
} // 結束每幀繪圖流程。

// 繪製起始畫面與大型可愛地球插圖。
function drawStartPage() {
  drawCloud(width * 0.13, height * 0.18, 1); // 在左上角繪製裝飾雲朵。
  drawCloud(width * 0.85, height * 0.22, 0.8); // 在右上角繪製另一朵裝飾雲朵。
  drawGlobe(width / 2, height * 0.39, min(width * 0.32, height * 0.31)); // 繪製起始頁中央的大型可愛地球。
  fill(palette.ink); // 設定遊戲標題的深藍色。
  noStroke(); // 移除標題文字周圍的描邊。
  textStyle(BOLD); // 使用粗體強調遊戲標題。
  textSize(min(46, width * 0.095)); // 依畫布寬度調整標題大小。
  text("環遊世界大富翁", width / 2, height * 0.68); // 顯示遊戲名稱。
  textStyle(NORMAL); // 還原一般文字樣式。
  fill("#547895"); // 設定副標題的柔和藍色。
  textSize(min(18, width * 0.045)); // 依畫布寬度設定副標題大小。
  text("擲骰子、認識城市，來一場單字冒險！", width / 2, height * 0.735); // 顯示遊戲簡介。
  drawButton("開始冒險", width / 2 - 112, height * 0.80, 224, 56, palette.coral, "start"); // 繪製前往玩法說明的開始按鈕。
  textSize(12); // 設定底部提示文字大小。
  fill("#6d91a9"); // 設定底部提示文字顏色。
  text("準備好旅行了嗎？", width / 2, height * 0.92); // 顯示輕鬆可愛的提示。
} // 結束起始畫面繪製。

// 繪製開始遊戲前的玩法與計分說明。
function drawInstructionsPage() {
  drawCloud(width * 0.12, height * 0.13, 0.75); // 在說明頁左上角加入雲朵裝飾。
  drawCloud(width * 0.88, height * 0.14, 0.65); // 在說明頁右上角加入雲朵裝飾。
  const cardW = min(width - 36, 560); // 依畫布寬度計算說明卡片尺寸。
  const cardH = min(height - 48, 620); // 依畫布高度限制說明卡片高度。
  const cardX = (width - cardW) / 2; // 計算說明卡片的置中水平位置。
  const cardY = (height - cardH) / 2; // 計算說明卡片的置中垂直位置。
  drawCard(cardX, cardY, cardW, cardH, palette.cream, 28); // 繪製圓角說明卡片。
  fill(palette.ink); // 設定說明標題顏色。
  textStyle(BOLD); // 使用粗體顯示說明標題。
  textSize(min(30, width * 0.07)); // 依畫面寬度調整說明標題大小。
  text("出發前的小叮嚀", width / 2, cardY + 54); // 顯示說明頁標題。
  textStyle(NORMAL); // 還原一般字重以便閱讀條列內容。
  textAlign(LEFT, CENTER); // 將說明文字設定為靠左對齊。
  fill("#496984"); // 設定說明文字顏色。
  textSize(min(17, width * 0.042)); // 依畫布寬度調整說明文字大小。
  const lines = ["🎲  每回合擲骰子，照點數沿棋盤前進。", "🌍  造訪歐洲、亞洲、美洲、非洲與大洋洲城市。", "📚  抵達國家後，回答一題英文單字測驗。", "✨  機會與命運格會帶來驚喜事件。", "💚  答對加 5 分；❤️  答錯扣 3 分。", "🏁  分數降到 0 分時，冒險就會結束。", "🔁  每次重新開始會重新洗牌題目，每題不重複。"]; // 整理遊戲規則與計分方式。
  const lineGap = min(54, (cardH - 184) / lines.length); // 依卡片高度計算每條規則的間距。
  for (let i = 0; i < lines.length; i++) text(lines[i], cardX + 30, cardY + 124 + i * lineGap, cardW - 60, lineGap); // 逐條繪製遊戲規則。
  textAlign(CENTER, CENTER); // 還原畫面文字的中央對齊方式。
  drawButton("選擇你的角色", width / 2 - 126, cardY + cardH - 82, 252, 54, palette.green, "characters"); // 前往角色選擇頁，再開始冒險。
} // 結束玩法說明頁繪製。

// 繪製四種顏色角色卡，所有角色名稱都精確置中。
function drawCharacterPage() {
  const cardW = min(width - 32, 560); // 依畫面寬度計算角色選擇卡片寬度。
  const cardH = min(height - 36, 640); // 依畫面高度限制角色選擇卡片高度。
  const cardX = (width - cardW) / 2; // 計算角色選擇卡片的置中水平位置。
  const cardY = (height - cardH) / 2; // 計算角色選擇卡片的置中垂直位置。
  drawCard(cardX, cardY, cardW, cardH, palette.cream, 28); // 繪製角色選擇的圓角底板。
  fill(palette.ink); // 設定角色選擇標題顏色。
  textStyle(BOLD); // 使用粗體顯示角色選擇標題。
  drawFittedText("選擇你的旅行角色", cardX + 16, cardY + 18, cardW - 32, 48, min(30, cardW * 0.075), 17); // 將頁面標題置中顯示。
  textStyle(NORMAL); // 使用一般字重顯示選擇提示。
  fill("#6688a0"); // 設定選擇提示文字顏色。
  drawFittedText("點選喜歡的角色與代表色", cardX + 16, cardY + 68, cardW - 32, 34, min(17, cardW * 0.05), 12); // 將選擇提示置中顯示。
  const gap = 14; // 設定角色卡片彼此之間的間距。
  const gridW = cardW - 36; // 計算角色卡片網格可用寬度。
  const itemW = (gridW - gap) / 2; // 計算每張角色卡片的寬度。
  const gridTop = cardY + 116; // 計算角色網格的頂端位置。
  const gridBottom = cardY + cardH - 94; // 預留網格下方開始按鈕空間。
  const itemH = max(90, (gridBottom - gridTop - gap) / 2); // 依卡片高度計算每張角色卡片高度。
  for (let i = 0; i < characters.length; i++) { // 逐一繪製四種可選角色卡。
    const col = i % 2; // 計算角色卡所在欄位。
    const row = floor(i / 2); // 計算角色卡所在列位。
    const x = cardX + 18 + col * (itemW + gap); // 計算角色卡片左側位置。
    const y = gridTop + row * (itemH + gap); // 計算角色卡片上側位置。
    const character = characters[i]; // 讀取目前角色資料。
    drawCard(x, y, itemW, itemH, "#ffffff", 20); // 繪製白色圓角角色卡。
    if (i === selectedCharacter) drawOutline(x + 2, y + 2, itemW - 4, itemH - 4, character.color, 4); // 以角色代表色標示目前選擇。
    drawCharacterAvatar(x + itemW / 2, y + itemH * 0.36, min(54, itemH * 0.38), character.color, false, true, i); // 繪製角色專屬顏色與配件的小旅人插圖。
    fill(palette.ink); // 設定角色名稱文字顏色。
    textStyle(BOLD); // 使用粗體顯示角色名稱。
    drawFittedText(character.name, x + 8, y + itemH * 0.65, itemW - 16, itemH * 0.23, min(23, itemW * 0.15), 13); // 將角色名稱在卡片下半部水平與垂直置中。
    hitAreas.push({ x: x, y: y, w: itemW, h: itemH, action: "character:" + i }); // 註冊整張角色卡的點擊範圍。
  } // 結束角色卡片繪製。
  textStyle(NORMAL); // 還原一般文字樣式。
  drawButton("開始冒險", width / 2 - 116, cardY + cardH - 70, 232, 50, palette.green, "begin"); // 確認角色並開始遊戲。
} // 結束角色選擇頁繪製。

// 以可愛的圓形人物造型繪製角色代表圖。
function drawCharacterAvatar(x, y, size, color, walking = false, showBadge = true, roleIndex = 0) {
  const step = walking ? sin(frameCount * 0.45) : 0; // 角色移動時讓手腳跟著步伐擺動。
  if (walking) { // 移動時先畫出角色腳下的柔和影子。
    noStroke(); // 移除角色影子的外框。
    fill("#6b91a044"); // 設定半透明的淺藍色影子。
    ellipse(x, y + size * 0.76, size * 0.86, size * 0.19); // 繪製角色腳下的橢圓影子。
  } // 結束移動影子繪製。
  noStroke(); // 移除人物插圖的外框。
  if (showBadge) { // 角色選擇頁保留圓形插圖底牌。
    fill("#eaf5fb"); // 設定人物插圖的淡藍色底圈。
    circle(x, y, size * 1.65); // 繪製人物插圖的圓形底圈。
  } // 結束角色底牌繪製判斷。
  if (walking) { // 棋盤上繪製擺動的手臂與雙腿，呈現行走姿勢。
    stroke("#526b7d"); // 設定腿部線條的柔和深藍色。
    strokeWeight(max(2, size * 0.11)); // 依人物尺寸調整手腳線條粗細。
    strokeCap(ROUND); // 讓手腳線條端點保持圓潤可愛。
    line(x - size * 0.13, y + size * 0.49, x - size * (0.18 + step * 0.10), y + size * 0.82); // 繪製隨步伐擺動的左腿。
    line(x + size * 0.13, y + size * 0.49, x + size * (0.18 - step * 0.10), y + size * 0.82); // 繪製隨步伐擺動的右腿。
    stroke(color); // 將手臂線條改成角色專屬顏色。
    line(x - size * 0.30, y + size * 0.13, x - size * (0.43 - step * 0.08), y + size * 0.39); // 繪製擺動的左手臂。
    line(x + size * 0.30, y + size * 0.13, x + size * (0.43 + step * 0.08), y + size * 0.39); // 繪製擺動的右手臂。
    noStroke(); // 清除描邊狀態以繼續繪製衣服與臉部。
  } // 結束行走姿勢手腳繪製。
  fill(color); // 設定角色代表色。
  rect(x - size * 0.38, y - size * 0.08, size * 0.76, size * 0.72, size * 0.28); // 繪製角色的圓角旅行服裝。
  fill("#ffdbb0"); // 設定人物臉部的暖膚色。
  circle(x, y - size * 0.38, size * 0.62); // 繪製人物圓圓的臉。
  fill("#ffffff"); // 設定人物眼睛底色。
  circle(x - size * 0.12, y - size * 0.40, size * 0.12); // 繪製人物左眼白。
  circle(x + size * 0.12, y - size * 0.40, size * 0.12); // 繪製人物右眼白。
  fill(palette.ink); // 設定人物眼珠顏色。
  circle(x - size * 0.12, y - size * 0.40, size * 0.06); // 繪製人物左眼珠。
  circle(x + size * 0.12, y - size * 0.40, size * 0.06); // 繪製人物右眼珠。
  if (roleIndex === 0) { // 旅行者戴上輕便的圓頂旅行帽。
    fill("#e8bf72"); // 設定旅行帽的暖金色。
    arc(x, y - size * 0.55, size * 0.62, size * 0.42, PI, TWO_PI, CHORD); // 繪製旅行者圓圓的帽冠。
    rect(x - size * 0.38, y - size * 0.48, size * 0.76, size * 0.09, size * 0.05); // 繪製旅行帽帽沿。
  } else if (roleIndex === 1) { // 冒險家戴上寬帽沿探險帽。
    fill("#b98557"); // 設定冒險帽的皮革棕色。
    arc(x, y - size * 0.57, size * 0.58, size * 0.38, PI, TWO_PI, CHORD); // 繪製冒險家帽冠。
    ellipse(x, y - size * 0.46, size * 0.86, size * 0.14); // 繪製冒險家寬帽沿。
  } else if (roleIndex === 2) { // 尋寶者戴上帶有探照燈的帽子。
    fill("#b98557"); // 設定尋寶帽的皮革棕色。
    arc(x, y - size * 0.57, size * 0.58, size * 0.38, PI, TWO_PI, CHORD); // 繪製尋寶者帽冠。
    rect(x - size * 0.34, y - size * 0.48, size * 0.68, size * 0.09, size * 0.05); // 繪製尋寶者帽沿。
    fill("#f5d166"); // 設定探照燈的金黃色。
    circle(x, y - size * 0.57, size * 0.15); // 在帽子中央加上尋寶探照燈。
  } else if (roleIndex === 3) { // 觀光客掛上相機作為代表配件。
    stroke("#526b7d"); // 設定相機背帶的深藍色。
    strokeWeight(max(1, size * 0.035)); // 依人物尺寸調整背帶粗細。
    line(x - size * 0.28, y - size * 0.02, x + size * 0.26, y + size * 0.37); // 繪製斜跨胸前的相機背帶。
    noStroke(); // 清除相機背帶描邊狀態。
    fill("#f2c65d"); // 設定相機機身的亮黃色。
    rect(x + size * 0.12, y + size * 0.16, size * 0.30, size * 0.23, size * 0.05); // 繪製觀光客胸前的小相機。
    fill("#ffffff"); // 設定相機鏡頭外圈顏色。
    circle(x + size * 0.27, y + size * 0.275, size * 0.13); // 繪製相機圓形鏡頭。
    fill("#6688a0"); // 設定相機鏡頭中心顏色。
    circle(x + size * 0.27, y + size * 0.275, size * 0.06); // 繪製相機鏡頭中心。
  } // 結束依角色繪製專屬配件。
  noFill(); // 設定人物微笑為透明背景的弧線。
  stroke(palette.ink); // 設定人物微笑線條顏色。
  strokeWeight(max(1.5, size * 0.035)); // 依人物大小調整微笑線條粗細。
  arc(x, y - size * 0.30, size * 0.18, size * 0.12, 0, PI); // 繪製人物微笑表情。
  noStroke(); // 清除描邊狀態避免影響其他介面。
} // 結束角色人物插圖繪製。

// 繪製棋盤遊戲、中央操作面板與遊戲狀態。
function drawGamePage() {
  if (page === "moving") updateMovement(); // 移動動畫期間逐格更新棋子位置。
  drawHeader(); // 繪製頂端遊戲名稱、分數與局數。
  const maxBoardW = max(180, min(width - 16, 1400)); // 放寬棋盤最大寬度，讓每一格更大。
  const maxBoardH = max(180, height - 92); // 縮小上下留白並預留標題列與棋盤提示。
  const boardW = min(maxBoardW, maxBoardH * (width < height ? 0.64 : 1.92)); // 依螢幕方向使用更多可用空間放大棋盤。
  const boardAspect = width < height ? 1.55 : 0.52; // 直向畫面保留高棋盤，橫向畫面放大棋格寬度。
  const boardH = min(maxBoardH, max(420, boardW * boardAspect)); // 依螢幕方向調整棋盤比例並限制在可視範圍內。
  boardRect = { x: (width - boardW) / 2, y: max(58, (height - boardH + 34) / 2), w: boardW, h: boardH }; // 將棋盤置中並保留標題列與底部提示位置。
  drawCard(boardRect.x, boardRect.y, boardRect.w, boardRect.h, "#b7e7f6", 28); // 繪製棋盤外框底板。
  const cellW = boardW / 6; // 將棋盤切分為六欄城市格。
  const cellH = boardH / 5; // 將棋盤切分為五列城市格。
  const centerX = boardRect.x + cellW; // 計算中央操作區的左側位置。
  const centerY = boardRect.y + cellH; // 計算中央操作區的上側位置。
  const centerW = cellW * 4; // 計算中央操作區的寬度。
  const centerH = cellH * 3; // 計算中央操作區的高度。
  drawCard(centerX + 8, centerY + 8, centerW - 16, centerH - 16, "#effaff", 22); // 繪製棋盤中央的遊戲資訊區。
  drawCenterContent(centerX + 16, centerY + 16, centerW - 32, centerH - 32); // 根據目前狀態繪製問題、骰子或事件。
  for (let i = 0; i < board.length; i++) drawTile(i, getTileRect(i, cellW, cellH)); // 沿環狀路線逐格繪製城市與特殊格。
  drawFootprints(cellW, cellH); // 在角色後方顯示逐格移動留下的腳印。
  drawPlayer(boardRect.x, boardRect.y, cellW, cellH); // 將玩家棋子畫在目前所在的格子上。
  fill("#6589a0"); // 設定棋盤下方提示文字顏色。
  textSize(15); // 放大棋盤提示文字，讓提示更容易閱讀。
  text("小提醒：旗幟和城市名稱會帶你環遊世界！", width / 2, min(height - 14, boardRect.y + boardRect.h + 22)); // 顯示棋盤操作提示。
} // 結束遊戲主畫面繪製。

// 繪製頂端分數、遊戲局數與遊戲標題。
function drawHeader() {
  fill(palette.ink); // 設定標題顏色。
  noStroke(); // 移除標題文字描邊。
  textStyle(BOLD); // 使用粗體顯示標題列。
  if (width < 500) { // 窄螢幕將標題與分數分列，避免文字彼此重疊。
    textAlign(CENTER, CENTER); // 將窄螢幕標題與分數都置中對齊。
    textSize(min(23, width * 0.065)); // 依窄螢幕寬度調整更大的遊戲標題字體。
    text("🌏 環遊世界大富翁", width / 2, 20); // 在第一列顯示遊戲標題。
    textSize(min(18, width * 0.05)); // 依窄螢幕寬度調整更大的分數資訊字體。
    text("⭐ " + score + " 分　　第 " + gameRound + " 局", width / 2, 46); // 在第二列顯示分數與局數。
    textStyle(NORMAL); // 還原一般文字樣式。
    return; // 避免窄螢幕再繪製桌機版左右排列的標題。
  } // 結束窄螢幕標題排列。
  textAlign(LEFT, CENTER); // 將標題列文字靠左對齊。
  textSize(min(27, width * 0.065)); // 依畫布寬度調整更大的標題字體。
  text("🌏 環遊世界大富翁", 18, 34); // 顯示遊戲標題。
  textAlign(RIGHT, CENTER); // 將分數與局數資訊靠右對齊。
  textSize(min(20, width * 0.05)); // 依畫布寬度調整更大的狀態字體。
  text("⭐ " + score + " 分　　第 " + gameRound + " 局", width - 18, 34); // 顯示目前分數及遊戲局數。
  textStyle(NORMAL); // 還原一般文字樣式。
  textAlign(CENTER, CENTER); // 還原中央對齊方便後續繪圖。
} // 結束頂端狀態列繪製。

// 依照 6 欄、5 列的外圈路線回傳各格的畫面位置。
function getTileRect(index, cellW, cellH) {
  let col = 0; // 預設棋盤格所在欄位。
  let row = 0; // 預設棋盤格所在列位。
  if (index <= 5) { col = index; row = 0; } // 將前六格依序排列在棋盤上方。
  else if (index <= 8) { col = 5; row = index - 5; } // 將右側三格由上往下排列。
  else if (index <= 14) { col = 14 - index; row = 4; } // 將下方六格由右往左排列。
  else { col = 0; row = 18 - index; } // 將左側三格放在內側路線，由下往上排列且不與起點重疊。
  return { x: boardRect.x + col * cellW, y: boardRect.y + row * cellH, w: cellW, h: cellH }; // 回傳棋盤格的矩形座標。
} // 結束棋盤位置計算。

// 繪製單一城市格或特殊格。
function drawTile(index, rect) {
  const tile = board[index]; // 讀取目前棋盤格的城市資料。
  const pad = max(3, min(rect.w, rect.h) * 0.045); // 依格子大小計算卡片內距。
  const x = rect.x + pad; // 計算格子卡片左側位置。
  const y = rect.y + pad; // 計算格子卡片上側位置。
  const w = rect.w - pad * 2; // 計算格子卡片寬度。
  const h = rect.h - pad * 2; // 計算格子卡片高度。
  drawCard(x, y, w, h, tile.color, 14); // 繪製帶有國家代表色的圓角城市卡。
  if (index === currentTile) drawOutline(x + 2, y + 2, w - 4, h - 4, palette.coral, 4); // 以珊瑚色外框標出玩家所在格。
  if (tile.type === "start") { // 起點格使用淡色 GO 作為背景浮水印。
    fill(40, 70, 100, 38); // 設定 GO 浮水印的低透明度顏色。
    textStyle(BOLD); // 使用粗體讓淡色英文字仍清楚可辨。
    textSize(min(rect.w * 0.42, rect.h * 0.40, 50)); // 依起點格尺寸限制浮水印大小。
    text("GO", rect.x + rect.w / 2, rect.y + rect.h * 0.50); // 將 GO 放在格子中央作為底紋。
  } // 結束起點浮水印繪製。
  noStroke(); // 移除城市圖示的描邊。
  fill(palette.ink); // 設定城市圖示與文字顏色。
  textSize(min(rect.w * 0.40, rect.h * 0.32, 44)); // 依格子大小設定旗幟或特殊格圖示尺寸。
  const iconY = tile.type === "chance" || tile.type === "fate" ? rect.y + rect.h * 0.34 : rect.y + rect.h * 0.23; // 將機會與命運圖示稍微下移。
  text(tile.flag, rect.x + rect.w / 2, iconY); // 在棋格上方置中顯示國旗或特殊格圖示。
  if (tile.feature) { // 只在國家城市格顯示當地特色。
    drawCuteFeature(tile.feature, rect.x + rect.w / 2, rect.y + rect.h * 0.46, min(rect.w * 0.42, rect.h * 0.27, 38)); // 將可愛特色插圖置於棋格中央。
  } // 結束城市特色圖示判斷。
  textStyle(BOLD); // 使用粗體顯示城市名稱。
  textSize(min(21, rect.w * 0.19, rect.h * 0.19)); // 依放大後的棋格尺寸增加城市名稱字體。
  drawFittedText(tile.city, rect.x + 4, rect.y + rect.h * 0.70, rect.w - 8, rect.h * 0.24, min(21, rect.w * 0.19, rect.h * 0.19), 10); // 將放大的城市名稱置中顯示，起點的「出發」覆蓋在淡色 GO 上方。
  textStyle(NORMAL); // 還原一般字重供下一格使用。
} // 結束單一棋盤格繪製。

// 以 p5.js 圖形繪製可愛的國家與城市特色插圖，不使用表情符號。
function drawCuteFeature(feature, x, y, size) {
  push(); // 暫存畫布狀態以隔離插圖的座標與樣式。
  translate(x, y); // 將插圖原點移至棋格中央。
  scale(size / 100); // 將標準插圖縮放至棋格可用尺寸。
  noStroke(); // 移除插圖外框，使用柔和色塊呈現。
  fill("#ffffff"); // 設定插圖圓形底牌的白色。
  circle(0, 3, 92); // 繪製圓形白底，讓地標和棋格背景清楚分開。
  fill("#fff1d2"); // 設定柔和的底牌陰影色。
  circle(0, 5, 76); // 繪製底牌內側的淡色圓形。
  if (feature === "clock") { // 繪製倫敦大笨鐘。
    fill("#6e9a9a"); // 設定鐘樓的薄荷綠色。
    rect(-19, -31, 38, 63, 8); // 繪製圓角鐘樓主體。
    triangle(-23, -29, 0, -47, 23, -29); // 繪製鐘樓屋頂。
    fill("#fff7db"); // 設定鐘面為奶油白色。
    circle(0, -15, 23); // 繪製圓形鐘面。
    fill("#425d70"); // 設定鐘面指針顏色。
    rect(-1.5, -24, 3, 11, 2); // 繪製鐘面時針。
    rect(0, -15, 9, 3, 2); // 繪製鐘面分針。
    fill("#f49d8d"); // 設定鐘樓底部小窗的珊瑚色。
    rect(-7, 9, 14, 17, 7); // 繪製圓角鐘樓拱窗。
  } else if (feature === "eiffel" || feature === "tokyoTower") { // 繪製巴黎鐵塔或東京鐵塔。
    const towerColor = feature === "eiffel" ? "#83a9bf" : "#f28a78"; // 依城市選擇鐵塔主色。
    fill(towerColor); // 設定鐵塔主體顏色。
    triangle(-34, 34, 0, -42, 34, 34); // 繪製高聳的三角形塔身。
    fill("#fff1d2"); // 設定塔身內側鏤空顏色。
    triangle(-21, 28, 0, -18, 21, 28); // 繪製塔身中央的鏤空區域。
    fill(towerColor); // 還原鐵塔主體顏色。
    rect(-31, 1, 62, 7, 4); // 繪製第一層觀景平台。
    rect(-23, -17, 46, 6, 3); // 繪製第二層觀景平台。
    rect(-37, 31, 74, 7, 4); // 繪製鐵塔底部平台。
    rect(-2, -44, 4, 12, 2); // 繪製鐵塔頂端天線。
    fill("#ffffff"); // 設定鐵塔上的可愛眼睛顏色。
    circle(-7, 15, 5); // 繪製鐵塔左眼。
    circle(7, 15, 5); // 繪製鐵塔右眼。
    fill("#465f72"); // 設定鐵塔眼珠顏色。
    circle(-7, 15, 2.5); // 繪製鐵塔左眼珠。
    circle(7, 15, 2.5); // 繪製鐵塔右眼珠。
  } else if (feature === "colosseum") { // 繪製羅馬競技場。
    fill("#e8ad69"); // 設定競技場的暖沙色。
    rect(-38, -20, 76, 52, 13); // 繪製圓角競技場主體。
    fill("#fff1d2"); // 設定拱門內部顏色。
    for (let i = 0; i < 4; i++) rect(-29 + i * 19, -5, 11, 26, 6); // 繪製一排可愛的圓拱門。
    fill("#d78e54"); // 設定競技場上層窗戶顏色。
    for (let i = 0; i < 5; i++) circle(-29 + i * 14, -12, 5); // 繪製競技場上層小窗。
    fill("#f5c780"); // 設定競技場頂部裝飾色。
    rect(-35, -25, 70, 8, 4); // 繪製競技場頂端橫樑。
  } else if (feature === "pyramid") { // 繪製埃及金字塔。
    fill("#efbd68"); // 設定金字塔的明亮沙金色。
    triangle(-38, 31, 0, -34, 38, 31); // 繪製金字塔正面。
    fill("#f7d58d"); // 設定金字塔受光側顏色。
    triangle(-38, 31, 0, -34, 0, 31); // 繪製金字塔左側亮面。
    fill("#d99656"); // 設定金字塔陰影側顏色。
    triangle(0, -34, 38, 31, 0, 31); // 繪製金字塔右側陰影面。
    fill("#ffffff"); // 設定金字塔的可愛眼睛顏色。
    circle(-8, 12, 7); // 繪製金字塔左眼。
    circle(8, 12, 7); // 繪製金字塔右眼。
    fill("#594d47"); // 設定金字塔眼珠顏色。
    circle(-8, 12, 3); // 繪製金字塔左眼珠。
    circle(8, 12, 3); // 繪製金字塔右眼珠。
    fill("#ef9a8b"); // 設定金字塔害羞臉頰顏色。
    circle(-18, 20, 7); // 繪製金字塔左臉頰。
    circle(18, 20, 7); // 繪製金字塔右臉頰。
  } else if (feature === "giraffe") { // 繪製奈洛比代表性的長頸鹿。
    fill("#f2c65d"); // 設定長頸鹿的暖黃色。
    rect(-13, -26, 26, 53, 12); // 繪製長頸鹿長長的脖子。
    ellipse(0, -28, 37, 29); // 繪製長頸鹿頭部。
    ellipse(0, 20, 43, 26); // 繪製長頸鹿身體。
    rect(-18, 25, 8, 15, 4); // 繪製長頸鹿左前腿。
    rect(10, 25, 8, 15, 4); // 繪製長頸鹿右前腿。
    circle(-12, -45, 8); // 繪製長頸鹿左角。
    circle(12, -45, 8); // 繪製長頸鹿右角。
    fill("#bd8747"); // 設定長頸鹿身上的斑點顏色。
    circle(-8, -4, 7); // 繪製脖子上的斑點。
    circle(8, 8, 7); // 繪製身體上的斑點。
    circle(-12, 20, 7); // 繪製身體左側斑點。
    fill("#ffffff"); // 設定長頸鹿眼睛顏色。
    circle(-7, -30, 7); // 繪製長頸鹿左眼。
    circle(7, -30, 7); // 繪製長頸鹿右眼。
    fill("#465f72"); // 設定長頸鹿眼珠顏色。
    circle(-7, -30, 3); // 繪製長頸鹿左眼珠。
    circle(7, -30, 3); // 繪製長頸鹿右眼珠。
  } else if (feature === "liberty") { // 繪製紐約自由女神像。
    fill("#83b8a5"); // 設定自由女神像的薄荷綠色。
    triangle(-27, 35, 0, -13, 27, 35); // 繪製女神像的長袍。
    rect(-15, -20, 30, 38, 9); // 繪製女神像上半身。
    circle(0, -28, 23); // 繪製女神像頭部。
    triangle(-20, -34, -9, -53, -7, -31); // 繪製皇冠左側尖角。
    triangle(-9, -36, 0, -57, 8, -34); // 繪製皇冠中央尖角。
    triangle(7, -32, 18, -50, 20, -28); // 繪製皇冠右側尖角。
    fill("#ffffff"); // 設定女神像眼睛顏色。
    circle(-6, -29, 5); // 繪製女神像左眼。
    circle(6, -29, 5); // 繪製女神像右眼。
    fill("#465f72"); // 設定女神像眼珠顏色。
    circle(-6, -29, 2); // 繪製女神像左眼珠。
    circle(6, -29, 2); // 繪製女神像右眼珠。
    fill("#f2c65d"); // 設定火炬的金黃色。
    rect(20, -21, 5, 34, 3); // 繪製女神像舉起的火炬。
    circle(22, -24, 12); // 繪製火炬頂端。
  } else if (feature === "maple") { // 繪製加拿大代表性的楓葉。
    fill("#ed786e"); // 設定楓葉的珊瑚紅色。
    beginShape(); // 開始繪製楓葉的多角形輪廓。
    vertex(0, -42); vertex(9, -24); vertex(24, -34); vertex(22, -17); vertex(38, -18); vertex(27, -2); vertex(36, 8); vertex(17, 11); vertex(14, 30); vertex(4, 23); vertex(0, 42); vertex(-5, 23); vertex(-15, 30); vertex(-18, 11); vertex(-36, 8); vertex(-27, -2); vertex(-38, -18); vertex(-22, -17); vertex(-24, -34); vertex(-9, -24); // 依序設定楓葉的尖角與凹口。
    endShape(CLOSE); // 封閉楓葉的外型。
    fill("#ffffff"); // 設定楓葉的可愛眼睛顏色。
    circle(-8, 1, 7); // 繪製楓葉左眼。
    circle(8, 1, 7); // 繪製楓葉右眼。
    fill("#634f53"); // 設定楓葉眼珠顏色。
    circle(-8, 1, 3); // 繪製楓葉左眼珠。
    circle(8, 1, 3); // 繪製楓葉右眼珠。
  } else if (feature === "christ") { // 繪製里約熱內盧的基督像山。
    fill("#87bd87"); // 設定山丘的清新綠色。
    triangle(-43, 34, 0, -18, 43, 34); // 繪製山丘背景。
    fill("#93b9a7"); // 設定基督像的薄荷灰綠色。
    rect(-5, -27, 10, 48, 5); // 繪製基督像身體。
    rect(-31, -22, 62, 9, 5); // 繪製基督像張開的雙臂。
    circle(0, -33, 17); // 繪製基督像頭部。
    fill("#ffffff"); // 設定基督像眼睛顏色。
    circle(-4, -34, 4); // 繪製基督像左眼。
    circle(4, -34, 4); // 繪製基督像右眼。
    fill("#536c72"); // 設定基督像眼珠顏色。
    circle(-4, -34, 2); // 繪製基督像左眼珠。
    circle(4, -34, 2); // 繪製基督像右眼珠。
  } else if (feature === "cactus") { // 繪製墨西哥代表性的仙人掌。
    fill("#76b87d"); // 設定仙人掌的明亮綠色。
    rect(-12, -35, 24, 72, 12); // 繪製仙人掌中央主幹。
    rect(-34, -8, 23, 13, 7); // 繪製仙人掌左側手臂橫枝。
    rect(-34, -24, 13, 28, 7); // 繪製仙人掌左側手臂直枝。
    rect(11, 5, 23, 13, 7); // 繪製仙人掌右側手臂橫枝。
    rect(21, -11, 13, 28, 7); // 繪製仙人掌右側手臂直枝。
    fill("#ffffff"); // 設定仙人掌眼睛顏色。
    circle(-5, -15, 7); // 繪製仙人掌左眼。
    circle(5, -15, 7); // 繪製仙人掌右眼。
    fill("#465f72"); // 設定仙人掌眼珠顏色。
    circle(-5, -15, 3); // 繪製仙人掌左眼珠。
    circle(5, -15, 3); // 繪製仙人掌右眼珠。
    fill("#f4c46c"); // 設定仙人掌花朵顏色。
    circle(0, -39, 10); // 繪製仙人掌頂端的小花。
  } else if (feature === "taipei101") { // 繪製臺北 101 大樓。
    fill("#75a8bd"); // 設定臺北 101 的藍綠色。
    rect(-21, -32, 42, 67, 8); // 繪製大樓主體。
    for (let i = 0; i < 5; i++) { // 逐層繪製臺北 101 的竹節樓層。
      fill(i % 2 === 0 ? "#75a8bd" : "#8bc1cc"); // 交替設定樓層色彩。
      rect(-25 + i, -25 + i * 12, 50 - i * 2, 9, 4); // 繪製一層圓角樓身。
    } // 結束樓層繪製。
    fill("#e9c66c"); // 設定大樓塔尖的金黃色。
    triangle(-8, -32, 0, -48, 8, -32); // 繪製臺北 101 的尖塔。
    fill("#ffffff"); // 設定大樓可愛眼睛顏色。
    circle(-7, 12, 7); // 繪製大樓左眼。
    circle(7, 12, 7); // 繪製大樓右眼。
    fill("#465f72"); // 設定大樓眼珠顏色。
    circle(-7, 12, 3); // 繪製大樓左眼珠。
    circle(7, 12, 3); // 繪製大樓右眼珠。
  } else if (feature === "hanbok") { // 繪製韓國傳統韓服。
    fill("#f39b9b"); // 設定韓服上衣的粉紅色。
    ellipse(0, -15, 35, 30); // 繪製韓服上身。
    fill("#89b9d1"); // 設定韓服裙子的天藍色。
    triangle(-38, 34, -19, -7, 19, -7); // 繪製韓服蓬鬆的裙擺。
    triangle(38, 34, 19, -7, -19, -7); // 補上裙擺另一側的圓弧感。
    fill("#f6d278"); // 設定韓服腰帶的金黃色。
    rect(-19, -5, 38, 7, 4); // 繪製腰間裝飾帶。
    fill("#ffe0b0"); // 設定韓服人物的臉部顏色。
    circle(0, -33, 23); // 繪製韓服人物頭部。
    fill("#ffffff"); // 設定人物眼睛顏色。
    circle(-6, -34, 5); // 繪製人物左眼。
    circle(6, -34, 5); // 繪製人物右眼。
    fill("#465f72"); // 設定人物眼珠顏色。
    circle(-6, -34, 2); // 繪製人物左眼珠。
    circle(6, -34, 2); // 繪製人物右眼珠。
  } else if (feature === "temple") { // 繪製泰國金色寺廟。
    fill("#e6bc62"); // 設定寺廟的金黃色。
    triangle(-42, -15, 0, -40, 42, -15); // 繪製寺廟第一層屋頂。
    triangle(-34, -25, 0, -46, 34, -25); // 繪製寺廟屋頂尖頂。
    rect(-30, -15, 60, 9, 4); // 繪製寺廟屋簷。
    fill("#fff4d6"); // 設定寺廟牆面顏色。
    rect(-25, -6, 50, 39, 5); // 繪製寺廟主體。
    fill("#dfaa53"); // 設定寺廟柱子的金色。
    for (let i = 0; i < 3; i++) rect(-17 + i * 17, -2, 6, 31, 3); // 繪製寺廟的三根柱子。
    fill("#ed8d7f"); // 設定寺廟入口顏色。
    rect(-7, 12, 14, 21, 7); // 繪製圓角寺廟入口。
  } else if (feature === "merlion") { // 繪製新加坡魚尾獅。
    fill("#77b9ad"); // 設定魚尾的青綠色。
    triangle(-8, 5, -37, 25, -12, 31); // 繪製魚尾獅左側魚尾。
    triangle(8, 5, 37, 25, 12, 31); // 繪製魚尾獅右側魚尾。
    ellipse(0, 24, 38, 17); // 繪製魚尾獅的魚身。
    fill("#fff4d6"); // 設定獅子臉部的奶油白色。
    circle(0, -12, 54); // 繪製圓圓的獅子頭。
    fill("#dfaa53"); // 設定獅子鬃毛的金色。
    for (let i = 0; i < 8; i++) { // 繪製獅子頭周圍的可愛鬃毛。
      const angle = TWO_PI * i / 8; // 計算每撮鬃毛的環繞角度。
      circle(cos(angle) * 29, -12 + sin(angle) * 29, 15); // 在圓周上繪製一撮鬃毛。
    } // 結束獅子鬃毛繪製。
    fill("#fff4d6"); // 重新繪製奶油色獅子臉。
    circle(0, -12, 43); // 覆蓋鬃毛中央並保留臉部空間。
    fill("#ffffff"); // 設定獅子眼睛顏色。
    circle(-8, -17, 7); // 繪製獅子左眼。
    circle(8, -17, 7); // 繪製獅子右眼。
    fill("#465f72"); // 設定獅子眼珠顏色。
    circle(-8, -17, 3); // 繪製獅子左眼珠。
    circle(8, -17, 3); // 繪製獅子右眼珠。
    fill("#e8877c"); // 設定獅子鼻子顏色。
    circle(0, -7, 7); // 繪製獅子鼻子。
  } else if (feature === "opera") { // 繪製雪梨歌劇院。
    fill("#ffffff"); // 設定歌劇院帆形屋頂的白色。
    triangle(-39, 20, -25, -23, -2, 20); // 繪製左側第一片帆形屋頂。
    triangle(-19, 20, 1, -35, 19, 20); // 繪製中央帆形屋頂。
    triangle(2, 20, 26, -26, 39, 20); // 繪製右側帆形屋頂。
    fill("#7eabc0"); // 設定歌劇院底座的海藍色。
    rect(-39, 20, 78, 12, 5); // 繪製臨海歌劇院底座。
    fill("#fff0d0"); // 設定歌劇院門窗的奶油色。
    for (let i = 0; i < 4; i++) rect(-28 + i * 18, 22, 9, 7, 3); // 繪製底座上的小窗戶。
  } // 結束各國特色插圖造型選擇。
  pop(); // 還原畫布狀態，避免插圖影響棋盤其他元素。
} // 結束可愛向量插圖繪製。

// 繪製玩家棋子與目前位置標示。
function drawPlayer(x, y, cellW, cellH) {
  const rect = getTileRect(currentTile, cellW, cellH); // 取得玩家所在格子的座標。
  const walking = page === "moving"; // 只在逐格前進時播放角色的走路姿勢。
  const size = min(36, cellW * 0.32, cellH * 0.30); // 依棋格大小設定清楚且不遮住內容的角色尺寸。
  const bob = walking ? abs(sin(frameCount * 0.45)) * size * 0.08 : 0; // 移動時加入輕微上下步伐起伏。
  const tokenX = rect.x + rect.w * 0.80; // 將角色放在棋格右下側，避開中央地標圖案。
  const tokenY = rect.y + rect.h * 0.80 - bob; // 設定角色站立位置並套用走路起伏。
  drawCharacterAvatar(tokenX, tokenY, size, characters[selectedCharacter].color, walking, false, selectedCharacter); // 在棋格上顯示玩家選取的角色與行走動畫。
} // 結束玩家棋子繪製。

// 繪製仍在畫面上的腳印，並讓較早留下的腳印逐漸淡出。
function drawFootprints(cellW, cellH) {
  const now = millis(); // 讀取目前遊戲時間以計算腳印透明度。
  const lifetime = 5000; // 設定每組腳印保留五秒後消失。
  footprints = footprints.filter((mark) => now - mark.time < lifetime); // 移除已淡出的腳印，避免記錄無限累積。
  for (const mark of footprints) { // 逐一繪製角色走過的腳印。
    const rect = getTileRect(mark.tile, cellW, cellH); // 取得腳印所屬棋格的位置。
    const progress = (now - mark.time) / lifetime; // 計算腳印目前的淡出進度。
    const alpha = 175 * (1 - progress); // 隨時間降低腳印透明度。
    const size = min(15, cellW * 0.15, cellH * 0.12); // 放大腳印並依棋格尺寸限制，保持清楚可見。
    const footX = rect.x + rect.w * 0.50; // 將腳印置於格子中央偏下位置。
    const footY = rect.y + rect.h * 0.89; // 避開城市名稱並將腳印放在格子底部。
    drawFootprint(footX, footY, size, mark.angle, alpha); // 繪製第一隻腳印。
    drawFootprint(footX - cos(mark.angle) * size * 1.15, footY - sin(mark.angle) * size * 1.15, size, mark.angle + PI, alpha); // 繪製交錯的另一隻腳印。
  } // 結束所有腳印繪製。
} // 結束腳印淡出繪製。

// 繪製一個由腳掌與腳趾組成的可愛腳印。
function drawFootprint(x, y, size, angle, alpha) {
  push(); // 暫存畫布狀態以獨立旋轉腳印。
  translate(x, y); // 將繪圖原點移至腳印位置。
  rotate(angle); // 讓腳印朝向角色前進方向。
  noStroke(); // 移除腳印形狀描邊。
  fill(35, 44, 54, alpha); // 使用會隨時間淡出的深黑色腳印。
  ellipse(0, 0, size * 0.68, size); // 繪製橢圓形腳掌。
  circle(-size * 0.24, -size * 0.57, size * 0.31); // 繪製腳掌外側腳趾。
  circle(-size * 0.08, -size * 0.70, size * 0.34); // 繪製中間腳趾。
  circle(size * 0.12, -size * 0.66, size * 0.30); // 繪製內側腳趾。
  circle(size * 0.28, -size * 0.51, size * 0.24); // 繪製最外側小腳趾。
  pop(); // 還原畫布狀態供後續元素使用。
} // 結束單個腳印繪製。

// 依目前遊戲狀態繪製中央資訊、答題選項或操作按鈕。
function drawCenterContent(x, y, w, h) {
  if (page === "play") drawRollPanel(x, y, w, h); // 輪到玩家操作時顯示擲骰面板。
  if (page === "moving") drawMovementPanel(x, y, w, h); // 移動期間顯示剩餘步數。
  if (page === "quiz") drawQuizPanel(x, y, w, h); // 抵達國家時顯示單字題目。
  if (page === "feedback") drawFeedbackPanel(x, y, w, h); // 作答後顯示正確或錯誤結果。
  if (page === "card") drawCardPanel(x, y, w, h); // 抵達機會或命運格時顯示事件卡。
} // 結束中央資訊區繪製。

// 顯示骰子點數與目前尚未走完的格數。
function drawMovementPanel(x, y, w, h) {
  fill(palette.ink); // 設定移動提示標題顏色。
  textStyle(BOLD); // 使用粗體顯示移動提示。
  drawFittedText("棋子前進中", x + 8, y + h * 0.13, w - 16, h * 0.18, min(25, w * 0.12), 14); // 將移動提示置中顯示。
  fill("#6688a0"); // 設定步數提示顏色。
  textStyle(NORMAL); // 使用一般字重顯示步數。
  drawFittedText("骰出 " + diceValue + " 點，還剩 " + movementRemaining + " 格", x + 8, y + h * 0.34, w - 16, h * 0.18, min(20, w * 0.10), 12); // 清楚顯示骰子點數與剩餘步數。
  drawDice(x + w / 2, y + h * 0.63, diceValue); // 在中央顯示本回合擲出的骰子。
} // 結束移動提示面板繪製。

// 繪製輪流擲骰與起點出發控制面板。
function drawRollPanel(x, y, w, h) {
  const tile = board[currentTile]; // 取得玩家目前所在城市或起點。
  fill(palette.ink); // 設定中央面板標題顏色。
  textStyle(BOLD); // 使用粗體強調操作標題。
  textSize(min(25, w * 0.12)); // 依中央面板寬度調整更大的標題字體。
  text(landedOnStart ? "剛好停在起點！" : currentTile === 0 ? "準備出發！" : "下一站會是哪裡？", x + w / 2, y + h * 0.20); // 區分首次出發、剛好停在起點與一般回合。
  textStyle(NORMAL); // 還原一般字重。
  fill("#6688a0"); // 設定目前位置說明的文字顏色。
  const locationMessage = landedOnStart ? "冒險進度保留，繼續擲骰前進！" : currentTile === 0 ? "從起點擲出你的第一顆骰子" : "目前所在：" + tile.city + "・" + tile.country; // 剛好停在起點時保留進度並提示繼續遊戲。
  drawFittedText(locationMessage, x + 8, y + h * 0.30, w - 16, h * 0.18, min(20, w * 0.095), 12); // 將目前位置或起點提示放大並置中於資訊區。
  drawDice(x + w / 2, y + h * 0.61, diceValue); // 在操作面板中央畫出最近一次的骰子。
  const btnW = min(190, w * 0.76); // 依面板寬度計算擲骰按鈕寬度。
  drawButton("🎲 擲骰子", x + (w - btnW) / 2, y + h * 0.77, btnW, min(48, h * 0.16), palette.coral, "roll"); // 繪製擲骰按鈕。
} // 結束擲骰面板繪製。

// 繪製目前需要回答的國家英文單字題目。
function drawQuizPanel(x, y, w, h) {
  const tile = board[currentTile]; // 取得目前題目所在的城市資料。
  fill(palette.ink); // 設定題目標題顏色。
  textStyle(BOLD); // 使用粗體顯示城市與國家名稱。
  drawFittedText(tile.flag + " " + tile.city + "・" + tile.country, x + 6, y + h * 0.035, w - 12, h * 0.15, min(16, w * 0.075), 10); // 將城市與國家名稱完整置中，並縮放至標題框內。
  textStyle(NORMAL); // 還原一般字重顯示題目提示。
  fill("#6688a0"); // 設定題目提示文字顏色。
  textSize(min(17, w * 0.08)); // 依面板寬度調整更大的題目提示字體。
  text("這個英文單字是什麼意思？", x + w / 2, y + h * 0.29); // 顯示中文作答提示。
  fill("#ed8d65"); // 設定英文單字的醒目顏色。
  textStyle(BOLD); // 使用粗體顯示英文單字。
  drawFittedText(currentQuestion.word.trim(), x + 8, y + h * 0.37, w - 16, h * 0.20, min(36, w * 0.17), 14); // 將更大的英文題目單字水平與垂直置中，並限制在中央面板範圍內。
  textStyle(NORMAL); // 還原一般文字樣式。
  const gap = 8; // 設定選項按鈕之間的間距。
  const buttonW = (w - gap - 8) / 2; // 計算兩欄答案選項按鈕的寬度。
  const buttonH = min(42, h * 0.15); // 依面板高度設定答案選項按鈕高度。
  const startX = x + 4; // 計算答案選項左側起始位置。
  const startY = y + h * 0.63; // 計算答案選項上側起始位置。
  for (let i = 0; i < currentQuestion.options.length; i++) { // 逐一繪製四個中文答案選項。
    const col = i % 2; // 計算目前選項位於左欄或右欄。
    const row = floor(i / 2); // 計算目前選項位於上排或下排。
    drawButton(currentQuestion.options[i], startX + col * (buttonW + gap), startY + row * (buttonH + gap), buttonW, buttonH, "#ffffff", "answer:" + currentQuestion.options[i]); // 繪製並註冊答案選項按鈕。
  } // 結束四個答案選項繪製。
} // 結束單字測驗面板繪製。

// 繪製作答結果、得分變化與繼續按鈕。
function drawFeedbackPanel(x, y, w, h) {
  if (!currentQuestion.options.length) { // 題庫用完時顯示不計分的完成提示。
    fill("#5da985"); // 設定已完成提示的柔和綠色。
    textStyle(BOLD); // 使用粗體顯示城市完成訊息。
    drawFittedText("城市探索完成！", x + 8, y + h * 0.17, w - 16, h * 0.20, min(29, w * 0.14), 15); // 將題庫完成標題置於面板中央。
    fill("#6688a0"); // 設定完成說明文字顏色。
    textStyle(NORMAL); // 使用一般字重顯示提醒。
    drawFittedText(answerFeedback, x + 12, y + h * 0.40, w - 24, h * 0.24, min(19, w * 0.09), 11); // 將題庫完成說明水平與垂直置中。
    drawButton("繼續冒險", x + w * 0.18, y + h * 0.72, w * 0.64, min(46, h * 0.15), palette.green, "next"); // 繪製繼續下一回合的按鈕。
    return; // 避免題目完成狀態出現虛假的加分或扣分。
  } // 結束題庫完成提示繪製。
  const color = answerWasCorrect ? palette.green : palette.red; // 根據答案結果選擇綠色或紅色。
  fill(color); // 設定作答結果標題顏色。
  textStyle(BOLD); // 使用粗體強調作答結果。
  textSize(min(30, w * 0.14)); // 依面板寬度調整結果標題大小。
  text(answerWasCorrect ? "答對了！" : "再接再厲！", x + w / 2, y + h * 0.22); // 顯示答對或答錯的結果。
  fill(palette.ink); // 設定單字解答文字顏色。
  drawFittedText(currentQuestion.word.trim() + "＝" + currentQuestion.answer, x + 8, y + h * 0.33, w - 16, h * 0.19, min(21, w * 0.10), 11); // 將正確答案完整置中於結果面板並避免文字偏移。
  fill(color); // 以結果顏色顯示分數變化。
  textSize(min(23, w * 0.10)); // 依面板寬度調整得分提示大小。
  text(answerWasCorrect ? "+5 分　⭐" : "−3 分　💧", x + w / 2, y + h * 0.61); // 顯示加分或扣分。
  if (score <= 0) { // 檢查錯誤作答是否已使分數歸零。
    drawButton("查看遊戲結果", x + w * 0.14, y + h * 0.76, w * 0.72, min(46, h * 0.15), palette.coral, "finish"); // 分數歸零時顯示結束遊戲按鈕。
  } else { // 保留分數時允許繼續下一回合。
    drawButton("繼續冒險", x + w * 0.18, y + h * 0.76, w * 0.64, min(46, h * 0.15), palette.green, "next"); // 繪製下一回合按鈕。
  } // 結束依分數顯示後續按鈕的判斷。
  textStyle(NORMAL); // 還原一般文字樣式。
} // 結束作答結果面板繪製。

// 繪製機會與命運事件卡。
function drawCardPanel(x, y, w, h) {
  const isChance = board[currentTile].type === "chance"; // 判斷目前停在機會格或命運格。
  fill(isChance ? "#d69930" : "#8770c5"); // 依事件類型設定卡片標題顏色。
  textStyle(BOLD); // 使用粗體顯示事件名稱。
  drawFittedText(isChance ? "✨ 機會來了！" : "🔮 命運轉動中", x + 8, y + h * 0.14, w - 16, h * 0.22, min(30, w * 0.14), 14); // 將機會或命運標題放在面板中央並限制於文字框內。
  fill("#526f87"); // 設定事件內容文字顏色。
  textStyle(NORMAL); // 使用一般字重顯示事件說明。
  drawFittedText(specialMessage, x + 12, y + h * 0.33, w - 24, h * 0.32, min(20, w * 0.10), 12); // 將事件小故事水平與垂直置中。
  fill(specialScoreChange > 0 ? palette.green : palette.red); // 依事件加分或扣分設定結果顏色。
  textStyle(BOLD); // 使用粗體突顯事件造成的分數變化。
  drawFittedText((specialScoreChange > 0 ? "+" : "") + specialScoreChange + " 分", x + 12, y + h * 0.64, w - 24, h * 0.12, min(23, w * 0.11), 12); // 顯示事件實際加分或扣分。
  const nextLabel = specialNextPage === "success" ? "領取成功獎狀" : specialNextPage === "gameover" ? "查看遊戲結果" : "繼續冒險"; // 依事件後的遊戲狀態設定按鈕文字。
  const nextColor = specialNextPage === "success" ? palette.green : specialNextPage === "gameover" ? palette.coral : isChance ? palette.yellow : palette.lilac; // 依事件後續狀態設定按鈕顏色。
  drawButton(nextLabel, x + w * 0.14, y + h * 0.78, w * 0.72, min(46, h * 0.15), nextColor, "next"); // 繪製關閉故事卡並繼續或結束遊戲的按鈕。
} // 結束特殊事件面板繪製。

// 繪製分數歸零後的遊戲結束畫面。
function drawGameOverPage() {
  drawCloud(width * 0.17, height * 0.20, 0.8); // 在結束畫面左上方加入雲朵。
  drawCloud(width * 0.83, height * 0.22, 0.8); // 在結束畫面右上方加入雲朵。
  drawCard(width / 2 - min(width * 0.43, 290), height * 0.26, min(width * 0.86, 580), height * 0.48, palette.cream, 30); // 繪製遊戲結果卡片。
  fill(palette.ink); // 設定結束標題顏色。
  textStyle(BOLD); // 使用粗體顯示結束標題。
  textSize(min(38, width * 0.095)); // 依畫布寬度調整結束標題大小。
  text("冒險暫時告一段落", width / 2, height * 0.37); // 顯示遊戲結束標題。
  fill("#6688a0"); // 設定結束說明文字顏色。
  textStyle(NORMAL); // 還原一般文字樣式。
  textSize(min(19, width * 0.05)); // 依畫布寬度調整結束說明大小。
  text(gameOverReason || "分數歸零，休息一下再出發吧！", width / 2, height * 0.47, width * 0.78, height * 0.1); // 顯示分數歸零的結束原因。
  fill("#e8a93f"); // 設定最終分數的金色。
  textStyle(BOLD); // 使用粗體顯示最終分數。
  textSize(min(28, width * 0.07)); // 依畫布寬度調整最終分數大小。
  text("本局得分：" + score + " 分", width / 2, height * 0.57); // 顯示最終遊戲分數。
  drawButton("重新開始", width / 2 - 112, height * 0.64, 224, 54, palette.green, "restart"); // 繪製重新開始並重新洗牌的按鈕。
  textStyle(NORMAL); // 還原一般文字樣式。
} // 結束遊戲結束畫面繪製。

// 繪製冒險成功獎狀並播放彩帶飄落動畫。
function drawSuccessPage() {
  drawConfetti(); // 更新並繪製持續飄落的彩帶。
  const cardW = min(width - 36, 620); // 依畫布寬度計算獎狀卡片寬度。
  const cardH = min(height - 48, 540); // 依畫布高度計算獎狀卡片高度。
  const cardX = (width - cardW) / 2; // 計算獎狀卡片的置中水平位置。
  const cardY = (height - cardH) / 2; // 計算獎狀卡片的置中垂直位置。
  drawCard(cardX, cardY, cardW, cardH, "#fffdf2", 30); // 繪製獎狀的奶油色底板。
  drawOutline(cardX + 10, cardY + 10, cardW - 20, cardH - 20, "#f2c65d", 4); // 繪製獎狀的金色圓角外框。
  fill("#e8a93f"); // 設定獎狀裝飾星星的金黃色。
  textSize(min(54, cardW * 0.13)); // 依獎狀寬度設定裝飾星星大小。
  text("★", width / 2, cardY + cardH * 0.19); // 在獎狀上方繪製金色星星。
  fill(palette.ink); // 設定獎狀標題文字顏色。
  textStyle(BOLD); // 使用粗體顯示成功標題。
  drawFittedText("冒險成功！", cardX + 20, cardY + cardH * 0.29, cardW - 40, cardH * 0.16, min(38, cardW * 0.10), 20); // 將成功標題置中繪製於獎狀。
  fill("#547895"); // 設定獎狀頒發文字顏色。
  textStyle(NORMAL); // 使用一般字重顯示獎狀說明。
  drawFittedText("恭喜你環遊世界，累積達到 50 分！", cardX + 24, cardY + cardH * 0.49, cardW - 48, cardH * 0.14, min(22, cardW * 0.065), 13); // 將成功條件說明置中顯示。
  fill("#e8a93f"); // 設定成就內容的金色。
  textStyle(BOLD); // 使用粗體強調成功成就。
  drawFittedText("世界小小探險家", cardX + 24, cardY + cardH * 0.65, cardW - 48, cardH * 0.12, min(25, cardW * 0.07), 15); // 在獎狀中間顯示探險家稱號。
  drawButton("再玩一次", width / 2 - 112, cardY + cardH - 78, 224, 52, palette.green, "restart"); // 繪製重新開始並重新洗牌的按鈕。
  textStyle(NORMAL); // 還原一般文字樣式。
} // 結束冒險成功獎狀繪製。

// 更新並繪製持續循環飄落的彩帶。
function drawConfetti() {
  for (const piece of confetti) { // 逐一更新並繪製每片彩帶。
    piece.y += piece.speed; // 依彩帶速度向下移動。
    piece.x += sin(frameCount * 0.035 + piece.phase) * piece.drift; // 讓彩帶左右輕輕飄動。
    piece.rotation += piece.spin; // 更新彩帶的旋轉角度。
    if (piece.y > height + 12) { // 彩帶飄出畫面底部時讓它從上方重新出現。
      piece.y = random(-height * 0.35, -12); // 將彩帶放回畫面上緣之外。
      piece.x = random(width); // 重新隨機設定彩帶的水平位置。
    } // 結束彩帶循環位置判斷。
    push(); // 暫存畫布狀態，避免彩帶旋轉影響其他內容。
    translate(piece.x, piece.y); // 將繪圖原點移至彩帶位置。
    rotate(piece.rotation); // 旋轉彩帶以增加飄落效果。
    noStroke(); // 移除彩帶外框。
    fill(piece.color); // 設定目前彩帶的糖果色。
    rectMode(CENTER); // 讓彩帶以中心點定位。
    rect(0, 0, piece.size, piece.size * 0.55, 2); // 繪製小型長方形彩帶。
    pop(); // 還原畫布狀態與矩形對齊模式。
  } // 結束所有彩帶繪製。
} // 結束彩帶動畫更新。

// 繪製骰子圖案與最近一次的點數。
function drawDice(x, y, value) {
  const size = min(66, width * 0.16); // 依畫布寬度計算骰子正方形大小。
  drawCard(x - size / 2, y - size / 2, size, size, "#ffffff", 15); // 繪製白色圓角骰子底板。
  if (value === 0) { // 尚未擲骰時顯示提示符號。
    fill(palette.coral); // 設定骰子提示文字顏色。
    textSize(size * 0.55); // 依骰子大小設定提示符號尺寸。
    text("?", x, y); // 顯示等待擲骰的問號。
    return; // 完成尚未擲骰狀態的繪製。
  } // 結束尚未擲骰的判斷。
  const patterns = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }; // 設定骰子一到六點的圓點排列。
  fill(palette.coral); // 設定骰子圓點的珊瑚色。
  noStroke(); // 移除骰子圓點的描邊。
  for (const dot of patterns[value]) circle(x + dot[0] * size * 0.25, y + dot[1] * size * 0.25, size * 0.12); // 依照擲出點數繪製骰子圓點。
} // 結束骰子圖案繪製。

// 繪製可重用的圓角卡片底板。
function drawCard(x, y, w, h, color, radius) {
  noStroke(); // 移除卡片外框描邊。
  fill(color); // 設定卡片底色。
  rect(x, y, w, h, radius); // 繪製指定位置與圓角的卡片。
} // 結束圓角卡片繪製。

// 繪製代表目前位置的彩色圓角外框。
function drawOutline(x, y, w, h, color, thickness) {
  noFill(); // 設定外框內部為透明。
  stroke(color); // 設定位置提示外框顏色。
  strokeWeight(thickness); // 設定位置提示外框粗細。
  rect(x, y, w, h, 13); // 繪製標示目前位置的圓角外框。
  noStroke(); // 清除外框狀態避免影響接下來的繪圖。
} // 結束位置提示外框繪製。

// 繪製按鈕並記錄其點擊範圍。
function drawButton(label, x, y, w, h, color, action) {
  noStroke(); // 移除按鈕描邊。
  fill("#aecbd9"); // 設定按鈕底部的柔和陰影色。
  rect(x, y + 4, w, h, 16); // 繪製按鈕的立體陰影。
  fill(color); // 設定按鈕的主要底色。
  rect(x, y, w, h, 16); // 繪製圓角按鈕主體。
  fill(palette.ink); // 設定按鈕文字顏色。
  textStyle(BOLD); // 使用粗體顯示按鈕名稱。
  textSize(min(19, h * 0.43, w * 0.11)); // 依按鈕大小自動調整較大的文字尺寸。
  drawFittedText(label, x + 6, y + 4, w - 12, h - 8, min(19, h * 0.43, w * 0.11), 9); // 將較大的按鈕文字縮放至框內並精確置中。
  textStyle(NORMAL); // 還原一般文字樣式供後續使用。
  hitAreas.push({ x: x, y: y, w: w, h: h, action: action }); // 記錄按鈕矩形與點擊後動作。
} // 結束按鈕繪製與註冊。

// 將短文字維持水平並自動縮小至指定框線內。
function drawFittedText(label, x, y, w, h, maxSize, minSize) {
  textAlign(CENTER, CENTER); // 將文字水平與垂直對齊於指定框線中央。
  let fittedSize = maxSize; // 從設計的最大字體開始嘗試。
  textSize(fittedSize); // 套用目前測量使用的字體大小。
  while (fittedSize > minSize && textWidth(label) > w) { // 文字超出框線時逐步縮小。
    fittedSize -= 1; // 每次縮小一級，避免文字被截斷或偏出框線。
    textSize(fittedSize); // 更新字體大小以重新測量文字寬度。
  } // 結束文字寬度檢查。
  text(label, x + w / 2, y + h / 2); // 將完整文字繪製在框線正中央。
} // 結束框內文字排版。

// 在背景繪製輕柔的卡通雲朵。
function drawCloud(x, y, scale) {
  noStroke(); // 移除雲朵的描邊。
  fill("#ffffff"); // 設定雲朵為白色。
  ellipse(x, y, 70 * scale, 34 * scale); // 繪製雲朵的橢圓形底部。
  circle(x - 18 * scale, y - 7 * scale, 30 * scale); // 繪製雲朵左側隆起。
  circle(x + 1 * scale, y - 14 * scale, 40 * scale); // 繪製雲朵中央隆起。
  circle(x + 22 * scale, y - 5 * scale, 28 * scale); // 繪製雲朵右側隆起。
} // 結束雲朵裝飾繪製。

// 繪製起始頁的可愛大地球插圖。
function drawGlobe(x, y, size) {
  noStroke(); // 移除地球插圖的圖形描邊。
  fill("#ffffff"); // 設定地球插圖的白色外圈。
  circle(x, y + 6, size * 1.08); // 繪製地球外層白色圓圈。
  fill("#77cbed"); // 設定地球的淺藍色海洋。
  circle(x, y, size); // 繪製地球圓形主體。
  fill("#9bdc9a"); // 設定地球上的綠色陸地。
  ellipse(x - size * 0.15, y - size * 0.15, size * 0.30, size * 0.38); // 繪製地球左上方的陸地。
  ellipse(x + size * 0.16, y + size * 0.11, size * 0.28, size * 0.40); // 繪製地球右下方的陸地。
  ellipse(x - size * 0.08, y + size * 0.33, size * 0.22, size * 0.17); // 繪製地球底部的小島。
  fill("#ffffff"); // 設定可愛地球的眼睛顏色。
  circle(x - size * 0.12, y + size * 0.02, size * 0.08); // 繪製左眼的白色底圈。
  circle(x + size * 0.13, y + size * 0.02, size * 0.08); // 繪製右眼的白色底圈。
  fill(palette.ink); // 設定可愛地球的瞳孔顏色。
  circle(x - size * 0.12, y + size * 0.02, size * 0.035); // 繪製左眼瞳孔。
  circle(x + size * 0.13, y + size * 0.02, size * 0.035); // 繪製右眼瞳孔。
  noFill(); // 設定微笑表情為透明底的曲線。
  stroke(palette.ink); // 設定微笑表情的線條顏色。
  strokeWeight(max(2, size * 0.025)); // 依插圖大小調整微笑線條粗細。
  arc(x, y + size * 0.12, size * 0.20, size * 0.14, 0, PI); // 繪製地球的微笑表情。
  noStroke(); // 清除表情描邊設定。
  fill("#ff9c99"); // 設定地球臉頰的淡紅色。
  ellipse(x - size * 0.25, y + size * 0.11, size * 0.12, size * 0.07); // 繪製左臉頰。
  ellipse(x + size * 0.25, y + size * 0.11, size * 0.12, size * 0.07); // 繪製右臉頰。
  fill("#ffcf61"); // 設定地球旁星星的亮黃色。
  textSize(size * 0.22); // 依地球大小設定裝飾星星尺寸。
  text("✦", x - size * 0.62, y - size * 0.30); // 繪製地球左側的小星星。
  text("✦", x + size * 0.61, y + size * 0.34); // 繪製地球右側的小星星。
} // 結束可愛地球插圖繪製。

// 設定遊戲資料，讓每次重新開始都使用全新題目順序。
function startNewGame() {
  currentTile = 0; // 將玩家棋子放回起點。
  landedOnStart = false; // 清除上局剛好停在起點的狀態。
  score = 15; // 重設遊戲起始分數。
  diceValue = 0; // 清除上一局的骰子點數。
  lastMove = 0; // 清除上一局的移動步數。
  movementRemaining = 0; // 清除上一局未走完的步數。
  movementStepAt = 0; // 重設棋子逐格移動計時。
  footprints = []; // 清除上一局留下的腳印。
  currentQuestion = null; // 清除上一局正在回答的題目。
  answerFeedback = ""; // 清除上一局作答提示。
  answerWasCorrect = false; // 重設上一題答題狀態。
  specialMessage = ""; // 清除上一局的特殊事件文字。
  specialScoreChange = 0; // 清除上一局事件帶來的分數變化。
  specialNextPage = "play"; // 重設事件卡關閉後的預設頁面。
  usedQuestions = new Set(); // 清空本局題目使用紀錄。
  questionDecks = {}; // 建立新局專用題目牌堆。
  gameOverReason = ""; // 清除上一局的結束原因。
  confetti = []; // 清除上一局成功畫面的彩帶。
  gameRound += 1; // 將局數加一。
  for (const country in questionBank) questionDecks[country] = shuffle(questionBank[country].map((question, index) => ({ ...question, id: country + "-" + index }))); // 為每個國家的單字題獨立洗牌。
  page = "play"; // 進入新一局的起點擲骰畫面。
} // 結束新局初始化。

// 擲骰、依點數移動並處理玩家抵達的棋盤格。
function rollAndMove() {
  landedOnStart = false; // 開始移動時清除上回合的起點提示。
  diceValue = floor(random(1, 7)); // 隨機擲出一到六點的骰子。
  lastMove = diceValue; // 記錄本回合的移動步數。
  movementRemaining = diceValue; // 將骰子點數設定為必須逐格走完的步數。
  movementStepAt = millis(); // 記錄開始移動的時間。
  page = "moving"; // 先播放逐格移動，避免棋子瞬間跳到目的地。
} // 結束擲骰與移動啟動。

// 讓棋子逐格前進，並在走完骰子點數後處理抵達格子。
function updateMovement() {
  if (movementRemaining <= 0 || millis() - movementStepAt < 300) return; // 每三百毫秒前進一格，且不超走骰子點數。
  const previousTile = currentTile; // 記錄角色離開前所在的棋格。
  const nextTile = (currentTile + 1) % board.length; // 計算角色下一步要前往的棋格。
  leaveFootprints(previousTile, nextTile); // 在離開的棋格留下朝向下一格的腳印。
  currentTile = nextTile; // 每次只沿棋盤前進一格。
  movementRemaining -= 1; // 將已走的一格從剩餘步數扣除。
  movementStepAt = millis(); // 更新下一格的移動時間。
  if (movementRemaining > 0) return; // 尚有步數時繼續逐格移動。
  arriveAtTile(); // 步數走完後才處理抵達的城市或特殊格。
} // 結束逐格移動更新。

// 依相鄰棋格的位置計算腳印朝向並記錄在剛離開的格子。
function leaveFootprints(previousTile, nextTile) {
  const cellW = boardRect.w / 6; // 依目前棋盤寬度計算單格寬度。
  const cellH = boardRect.h / 5; // 依目前棋盤高度計算單格高度。
  const previousRect = getTileRect(previousTile, cellW, cellH); // 取得角色原本所在格的位置。
  const nextRect = getTileRect(nextTile, cellW, cellH); // 取得角色前進目標格的位置。
  const dx = nextRect.x - previousRect.x; // 計算沿水平方向移動的距離。
  const dy = nextRect.y - previousRect.y; // 計算沿垂直方向移動的距離。
  let angle = atan2(dy, dx); // 根據移動方向計算腳印旋轉角度。
  if (previousTile === board.length - 1 && nextTile === 0) angle = 0; // 跨過起點回到第一格時，腳印朝棋盤右側。
  footprints.push({ tile: previousTile, angle: angle, time: millis() }); // 記錄腳印位置、方向與淡出起始時間。
} // 結束腳印路徑記錄。

// 處理棋子依骰子點數走完後抵達的棋盤格。
function arriveAtTile() {
  const tile = board[currentTile]; // 取得玩家停留的城市或特殊格。
  if (tile.type === "city") openQuestion(tile); // 抵達國家城市時開啟該國單字題。
  else if (tile.type === "chance" || tile.type === "fate") openSpecialCard(tile); // 抵達機會或命運格時抽取事件卡。
  else { // 骰子步數剛好抵達起點時只顯示提示，不重設遊戲。
    landedOnStart = true; // 標記本回合剛好停在起點。
    page = "play"; // 保留目前分數、題目與冒險進度，繼續遊戲。
  } // 結束起點抵達處理。
} // 結束抵達格子處理。

// 從該國尚未使用的題目中隨機抽出一題。
function openQuestion(tile) {
  const deck = questionDecks[tile.key] || []; // 取得該國本局已洗牌的題目牌堆。
  const nextQuestion = deck.find((question) => !usedQuestions.has(question.id)); // 找出本局尚未使用的第一題。
  if (!nextQuestion) { // 檢查該國題庫是否已全部用完。
    answerFeedback = tile.city + "的單字題已完成，繼續探索吧！"; // 提示該城市的題目已完成且不重複出題。
    answerWasCorrect = true; // 使用中性正向色彩呈現已完成提示。
    currentQuestion = { word: "探索完成", answer: "本局題目不重複", options: [] }; // 設定已完成狀態所需的安全顯示內容。
    page = "feedback"; // 顯示城市題庫已完成提示。
    return; // 結束題目開啟流程，避免重複出題。
  } // 結束該國題庫耗盡判斷。
  usedQuestions.add(nextQuestion.id); // 標記本局已抽出的題目，避免再次使用。
  currentQuestion = nextQuestion; // 設定目前要回答的英文單字題。
  page = "quiz"; // 切換到單字測驗畫面。
} // 結束國家題目抽選。

// 隨機抽取機會或命運事件並立即套用其分數效果。
function openSpecialCard(tile) {
  const chanceCards = [ // 故事化機會卡，包含可能的加分與扣分事件。
    { story: "好心旅人送你一張車票，旅程更順利了！", change: 3 }, // 獲得旅人贈送車票的獎勵。
    { story: "你幫迷路的小朋友找到家人，大家送上感謝！", change: 2 }, // 獲得熱心助人的加分。
    { story: "你發現一間藏在巷子裡的特色小店，店主招待你！", change: 2 }, // 獲得探索小店的加分。
    { story: "你不小心買錯車票，只好補買一張新的。", change: -2 }, // 因買錯車票扣分。
    { story: "突然下起大雨，你的行李淋濕，需要整理一下。", change: -3 } // 因大雨造成旅途花費而扣分。
  ]; // 結束機會故事卡設定。
  const fateCards = [ // 故事化命運卡，包含可能的加分與扣分事件。
    { story: "幸運地遇見當地導遊，帶你走了捷徑！", change: 3 }, // 因遇到導遊而獲得加分。
    { story: "街頭藝人的表演讓你認識新朋友，大家一起分享點心！", change: 2 }, // 因結交朋友而獲得加分。
    { story: "你抽中旅館的小禮物，省下一筆旅費！", change: 2 }, // 因抽中旅館禮物而獲得加分。
    { story: "你搭錯方向的公車，多花了時間和車資。", change: -2 }, // 因搭錯公車而扣分。
    { story: "紀念品袋子破了，珍藏的小物滾得到處都是！", change: -3 } // 因整理遺失紀念品而扣分。
  ]; // 結束命運故事卡設定。
  const cards = tile.type === "chance" ? chanceCards : fateCards; // 依格子種類挑選故事牌組。
  const card = random(cards); // 隨機抽出一則完整故事事件。
  specialMessage = card.story; // 顯示抽中的事件故事。
  specialScoreChange = card.change; // 記錄故事造成的實際分數變化。
  score = max(0, score + specialScoreChange); // 套用加扣分並確保分數不低於零。
  if (score >= 50) specialNextPage = "success"; // 達到五十分時顯示故事後領取成功獎狀。
  else if (score === 0) { // 扣分使分數歸零時準備結束遊戲。
    specialNextPage = "gameover"; // 將故事卡按鈕設定為前往遊戲結果。
    gameOverReason = "命運事件讓分數扣到 0 分，這趟冒險結束了。"; // 記錄因命運事件扣到零分的原因。
  } else specialNextPage = "play"; // 尚未達成結束條件時繼續冒險。
  page = "card"; // 先顯示故事與分數變化，再由玩家選擇繼續。
} // 結束事件卡抽選與效果處理。

// 判斷所選答案並依照遊戲規則更新分數。
function chooseAnswer(answer) {
  if (!currentQuestion || !currentQuestion.options.length) { // 確認目前確實有可回答的題目。
    page = "play"; // 沒有待答題目時安全返回擲骰畫面。
    return; // 結束無效的答案處理。
  } // 結束待答題目檢查。
  answerWasCorrect = answer === currentQuestion.answer; // 比對所選中文答案與正確答案。
  if (answerWasCorrect) { // 答案正確時進入加分流程。
    score += 5; // 答對一題增加五分。
  } else { // 答案錯誤時進入扣分流程。
    score = max(0, score - 3); // 答錯扣三分並確保分數不低於零。
  } // 結束答題計分判斷。
  if (score >= 50) { // 檢查答題後是否達到冒險成功門檻。
    enterSuccess(); // 達到五十分時立即切換至成功獎狀畫面。
    return; // 避免繼續執行一般答題結果畫面流程。
  } // 結束冒險成功門檻檢查。
  if (score === 0) gameOverReason = "答錯單字，分數扣到 0 分，這趟冒險結束了。"; // 分數歸零時記錄正確的遊戲結束原因。
  page = "feedback"; // 顯示綠色或紅色的作答結果。
} // 結束答案判斷與計分。

// 建立冒險成功畫面並準備彩帶動畫。
function enterSuccess() {
  page = "success"; // 切換到冒險成功獎狀畫面。
  const colors = [palette.coral, palette.yellow, palette.green, palette.blue, palette.lilac]; // 設定彩帶使用的糖果色清單。
  confetti = []; // 清除舊彩帶，避免重複建立。
  for (let i = 0; i < 100; i++) { // 建立足夠數量的彩帶填滿整個畫面。
    confetti.push({ x: random(width), y: random(-height, height), speed: random(1.5, 4.5), drift: random(0.5, 2), phase: random(TWO_PI), rotation: random(TWO_PI), spin: random(-0.08, 0.08), size: random(6, 13), color: random(colors) }); // 隨機設定每片彩帶的位置、速度、角度與顏色。
  } // 結束彩帶資料建立。
} // 結束成功畫面初始化。

// 處理所有滑鼠點擊，將畫布座標轉換成遊戲操作。
function mousePressed() {
  for (let i = hitAreas.length - 1; i >= 0; i--) { // 從最上層按鈕往下檢查點擊範圍。
    const area = hitAreas[i]; // 讀取目前檢查的按鈕位置與動作。
    if (mouseX < area.x || mouseX > area.x + area.w || mouseY < area.y || mouseY > area.y + area.h) continue; // 點擊位置不在按鈕內時跳過。
    handleAction(area.action); // 執行所點擊按鈕對應的遊戲操作。
    return false; // 取消瀏覽器的預設滑鼠行為。
  } // 結束所有按鈕範圍檢查。
  return false; // 即使未點中按鈕也避免畫布預設拖曳行為。
} // 結束滑鼠點擊處理。

// 根據按鈕動作切換頁面、擲骰或回答題目。
function handleAction(action) {
  if (action === "start") page = "instructions"; // 從起始頁前往遊戲說明。
  else if (action === "characters") page = "character"; // 說明結束後前往角色選擇頁。
  else if (action.startsWith("character:")) selectedCharacter = Number(action.slice(10)); // 記錄玩家點選的角色。
  else if (action === "begin") startNewGame(); // 開始遊戲並初始化新局題庫。
  else if (action === "roll") rollAndMove(); // 擲骰並移動玩家棋子。
  else if (action.startsWith("answer:")) chooseAnswer(action.slice(7)); // 將答案選項交給答題計分流程。
  else if (action === "next") { // 關閉事件卡或作答結果並依遊戲狀態前往下一頁。
    if (page === "card" && specialNextPage === "success") enterSuccess(); // 機會或命運事件使分數達標時顯示成功獎狀。
    else if (page === "card" && specialNextPage === "gameover") page = "gameover"; // 事件扣到零分時顯示遊戲結果。
    else page = "play"; // 其他情況繼續下一回合。
  } // 結束繼續冒險動作。
  else if (action === "finish") page = "gameover"; // 分數歸零後進入遊戲結果頁。
  else if (action === "restart") startNewGame(); // 重玩時重設分數並重新洗牌所有題目。
} // 結束按鈕動作處理。
