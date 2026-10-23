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
  document.getElementById("coinsperclick").textContent = `coins per click: ${abbreviateNumber(stats.coinsPerClick)}`
  document.getElementById("autoclicker").textContent = `autoclicker: ${abbreviateNumber(stats.autoCoinsPerClick)}
  unlocked: ${stats.autoClicker}
  `
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
        stats.coinsPerClick = 1;
        stats.username = "";
        stats.autoClicker = false
        stats.autoCoinsPerClick = 500
        stats.upgrade4 = false

        // Update display
        reloadcoins()
        document.getElementById("name").textContent = `user: ${stats.username}`;
        location.reload()
    }
}

function upgrade1() {
    if (stats.coins >= 1000) {
        stats.coins -= 1000;
        stats.coinsPerClick *= 1.5;
        reloadcoins()
        saveGame();
    }
}

function upgrade2() {
    if (stats.coins >= 100) {
        stats.coins -= 100;
        stats.coinsPerClick += 1;
        reloadcoins()
        saveGame();
    }
}

function upgrade3() {
    if (stats.upgrade4 === true) return;
    if (stats.coins >= 500000) {
        stats.coins -= 500000;
        stats.upgrade4 = true;

        toggleAutoClicker();
        reloadcoins();
    }
}

if (stats.upgrade4) {
    document.getElementById("upgrade3").remove()
    document.getElementById("upgrade4p").innerHTML = "unavailable: item purchased already"
}


function upgrade4() {
    if (stats.coins >= 400000 && stats.autoClicker == true) {
        stats.coins -= 400000
        stats.autoCoinsPerClick += 10000
        reloadcoins()
        location.reload()
    }
}

function cheatButton() {
    let name = prompt("type in your user:");
    if (name == "tryme") {
        stats.coins = 1000000
        stats.coinsPerClick = 1000000
        reloadcoins()
        saveGame()
    }
    if (name == "devop") {
        stats.coins = 1000000000
        stats.coinsPerClick = 1000000000
        reloadcoins()
        saveGame()
    }
    if (name == "crispy saysopensesame") {
        document.getElementById("container").innerHTML += `
        <div class="tab" onclick="cheat()">! COINS !</div>
        `;
        saveGame()
    }
    if (name) {
        stats.username = name
        document.getElementById("name").textContent = `user: ${stats.username}`
        saveGame()
    }
}

function cheat() {
    let amount = prompt("type the amount of coins you want:")
    stats.coins = parseInt(amount)
    reloadcoins()
    saveGame()
}

function earn() {
    location.replace("/mainPage/index.html");
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
        stats.coins += parseInt(stats.autoCoinsPerClick);
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