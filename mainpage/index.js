function abbreviateNumber(num) {
  const units = ["", "K", "M", "B", "T"];
  let i = 0;
  while (Math.abs(num) >= 1000 && i < units.length - 1) {
    num /= 1000;
    i++;
  }
  return (num < 10 && i ? num.toFixed(1) : Math.round(num)) + units[i];
}


let stats = JSON.parse(localStorage.getItem("stats")) || {
  coins: 0,
  coinsPerClick: 1,
  username: "",
  autoClicker: false,
  autoCoinsPerClick: 50000,
  upgrade4: false
};

function reloadcoins() {
  document.getElementById("currentcoins").innerHTML = `<img src="dollar.png" style="height: 1.5vh; width: 1.5vh;"> ${abbreviateNumber(stats.coins)}`
  document.getElementById("coins").innerHTML = `<img src="dollar.png" style="height: 1.5vw; width: 1.5vw;"> ${abbreviateNumber(stats.coins)}`
  document.getElementById("coinsperclick").textContent = `coins per click: ${abbreviateNumber(stats.coinsPerClick)}`
  document.getElementById("autoclicker").textContent = `autoclicker: ${abbreviateNumber(stats.autoCoinsPerClick)}
  unlocked: ${stats.autoClicker}
  `
  document.getElementById("currentcoins1").innerHTML = `coins: $${abbreviateNumber(stats.coins)}`
}

// ---- LOAD SAVE IF IT EXISTS ----
function loadSave() {
  const saved = localStorage.getItem("stats");
  if (saved) {
    stats = JSON.parse(saved);

    // Update coins display
    reloadcoins()

    // Update username display if it exists
    if (stats.username) {
      document.getElementById("name").textContent = `user: ${stats.username}`;
    }
  }
}

// ---- SAVE GAME ----
function saveGame() {
  localStorage.setItem("stats", JSON.stringify(stats));
}

function resetGame() {
  if (confirm("Are you sure you want to reset your game?")) {
    // Clear saved data
    localStorage.removeItem("stats");

    // Reset stats object
    stats.coins = 0;
    stats.coinsPerClick = 0.5;
    stats.username = "";
    stats.autoClicker = false
    stats.autoCoinsPerClick = 500

    // Update display
    reloadcoins()
    document.getElementById("name").textContent = `user: ${stats.username}`;
    location.reload()
  }
}

function button() {
  stats.coins += stats.coinsPerClick;
  reloadcoins()
  saveGame();
}
let canClick = true; // flag for cooldown

document.addEventListener("keydown", function (event) {
  if (event.key === " " && canClick) {
    canClick = false; // block further clicks until timeout

    stats.coins += stats.coinsPerClick;

    reloadcoins()

    // cooldown: re-enable after 1 second (1000 ms)
    setTimeout(() => {
      canClick = true;
    }, 100);
  }
  saveGame()
});


function cheatButton() {
  let name = prompt("type in your user:");
  if (name == "tryme") {
    stats.coins = 1000000;
    stats.coinsPerClick = 1000000;
    reloadcoins()
    saveGame();
  }
  if (name == "devop") {
    stats.coins = 1000000000;
    stats.coinsPerClick = 1000000000;
    reloadcoins()
    saveGame();
  }
  if (name == "crispy saysopensesame") {
    document.getElementById("container").innerHTML += `
        <div class="tab" onclick="cheat()">! COINS !</div>
        `;
    saveGame();
  }
  if (name) {
    stats.username = name;
    document.getElementById("name").textContent = `user: ${stats.username}`;
    saveGame();
  }

  if (name == "Kaffekopp1!") {
    document.getElementById("button").innerHTML += `
    <div onclick="devconsole()" id="devconsole"></div>
    `
  }
}

function cheat() {
  let amount = prompt("type the amount of coins you want:");
  stats.coins = parseInt(amount);
  reloadcoins()
  saveGame();
}

function upgrade() {
  location.replace("/upgradesTab/index.html");
  saveGame();
}


function devconsole() {
  document.getElementById("devconsole").remove()
  document.getElementById("body").innerHTML += `
  <div id="opendev">
            <p>Debugging dev panel</p>
            <div id="subtabname">
                <p>main tab</p>
            </div>
            <div id="row1">
                <p>give coins</p>
                <input id="devinput1" type="number" placeholder="type a value..."> 
                <button onclick="confirminput1()">enter</button>
            </div>
            <div id="row1">
                <p>set coins per click</p>
                <input id="devinput2" type="number" placeholder="type a value...">
                <button onclick="confirminput2()">enter</button>
            </div>
            <div id="close" onclick="closeadmin()">X</div>
        </div>
  `
}

function confirminput1() {
  const text = parseInt(document.getElementById("devinput1").value);
  stats.coins += text
  reloadcoins()
  saveGame()
}

function confirminput2() {
  const text = parseInt(document.getElementById("devinput2").value);
  stats.coinsPerClick = text
  reloadcoins()
  saveGame()
}

function closeadmin() {
  document.getElementById("opendev").remove()
  document.getElementById("button").innerHTML += `<div onclick="devconsole()" id="devconsole"></div>`
}

function updateLogs() {
  location.reload()
  location.replace("/updateLogs/index.html")
}

let autoClickerInterval = null;

function startAutoClicker() {
  if (!autoClickerInterval) {
    autoClickerInterval = setInterval(() => {
      if (stats.autoClicker) {
        stats.coins += stats.autoCoinsPerClick;

        reloadcoins()

        saveGame();
      }
    }, 500); // 10 clicks per second
  }
}

function toggleAutoClicker() {
  stats.autoClicker = true;
  saveGame();
}

// Load saved data as soon as the page opens
loadSave();
startAutoClicker();
