const container = document.getElementById("puzzle-container");
const size = 3;
let tiles = [];

function createTiles() {
  const positions = [];

  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement("div");
    tile.classList.add("puzzle-tile");

    if (i === size * size - 1) {
      tile.classList.add("empty");
    } else {
      const row = Math.floor(i / size);
      const col = i % size;
      tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
    }

    tiles.push(tile);
    positions.push(i);
  }

  // Acak posisi awal, pastikan solvable
  do {
    positions.sort(() => Math.random() - 0.5);
  } while (!isSolvable(positions));

  drawTiles(positions);
}

function drawTiles(positions) {
  container.innerHTML = "";

  positions.forEach(pos => {
    const tile = tiles[pos];
    container.appendChild(tile);
  });

  // Tambah event listener ulang
  container.querySelectorAll('.puzzle-tile').forEach((tile, i) => {
    tile.onclick = () => tryMove(i);
  });
}

function tryMove(index) {
  const emptyIndex = [...container.children].findIndex(el => el.classList.contains('empty'));
  const validMoves = getValidMoves(emptyIndex);

  if (validMoves.includes(index)) {
    const newOrder = [...container.children];
    [newOrder[emptyIndex], newOrder[index]] = [newOrder[index], newOrder[emptyIndex]];
    drawTiles(newOrder.map(el => tiles.indexOf(el)));

    if (checkWin()) {
      showWinMessage();
    }
  }
}


function getValidMoves(emptyIndex) {
  const moves = [];
  const row = Math.floor(emptyIndex / size);
  const col = emptyIndex % size;

  if (row > 0) moves.push(emptyIndex - size);
  if (row < size - 1) moves.push(emptyIndex + size);
  if (col > 0) moves.push(emptyIndex - 1);
  if (col < size - 1) moves.push(emptyIndex + 1);

  return moves;
}
function checkWin() {
  const currentOrder = [...container.children].map(el => tiles.indexOf(el));
  for (let i = 0; i < currentOrder.length; i++) {
    if (currentOrder[i] !== i) return false;
  }
  return true;
}

// Cek apakah puzzle bisa dipecahkan
function isSolvable(array) {
  let invCount = 0;
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] !== array.length - 1 && array[j] !== array.length - 1 && array[i] > array[j]) {
        invCount++;
      }
    }
  }
  return invCount % 2 === 0;
}
function showWinMessage() {
  const message = document.createElement('div');
  message.textContent = "Selamat! Puzzle selesai!";
  message.style.position = 'fixed';
  message.style.top = '40%';
  message.style.left = '50%';
  message.style.transform = 'translate(-50%, -50%)';
  message.style.fontSize = '2em';
  message.style.background = '#00cc88';
  message.style.padding = '20px 30px';
  message.style.color = 'white';
  message.style.borderRadius = '15px';
  message.style.zIndex = '1000';
  message.style.boxShadow = '0 0 10px white';
  document.body.appendChild(message);

  // Tambah confetti efek (opsional)
  setTimeout(() => message.remove(), 4000);
}


createTiles();
