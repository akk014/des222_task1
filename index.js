// Banner Animation
// The mouse is traced by red dots, simulating sensors in smart cities that track traffic.

// Circle tracing and animation inspired by https://www.youtube.com/watch?v=ZotButrBGVI 

var imgRed = document.getElementById('red-img');
let circles = [];


let isCursorMoving = false;
let cursorPosition = { x: 0, y: 0 };
let cursorMoveTimeout;
let circleRemovalInterval;

const cursor = document.getElementById('red-img');

// Get poition for circles + delete circles after inactivity
document.addEventListener('mousemove', (e) => {
  cursorPosition.x = e.clientX + window.scrollX;
  cursorPosition.y = e.clientY + window.scrollY;

  cursor.style.left = cursorPosition.x - cursor.offsetWidth / 2 + 'px';
  cursor.style.top = cursorPosition.y - cursor.offsetHeight / 2 + 'px';

  isCursorMoving = true;

  clearTimeout(cursorMoveTimeout);

  cursorMoveTimeout = setTimeout(() => {
    isCursorMoving = false;
    setTimeout(() => {
      // Delete "old" circles
      clearInterval(circleRemovalInterval);
      circleRemovalInterval = setInterval(() => {
        // Delete circles one at a time
        if (circles.length > 0) {
          // remove first circle
          circles.shift();
        } else {
          clearInterval(circleRemovalInterval);
        }
      }, 50);
    }, 1000);
  }, 50);
});

// Check if cursor is moving -> if so, add circles
setInterval(() => {
  if (isCursorMoving) {
    const x = cursorPosition.x;
    const y = cursorPosition.y;

    let circle = { x, y };
    circle.x = x;
    circle.y = y;
    circles.push(circle);

    // Combine all masks of circles
    let combinedMask = ``;
    for (const c of circles) {
      combinedMask += `radial-gradient(circle 1em at ${c.x}px ${c.y}px,rgba(255,255,255,0.4) 80%, rgba(255,255,255,0) 100%)`;

      if (circles.indexOf(c) < circles.length - 1) {
        combinedMask += `, `;
      }
    }

    imgRed.style.setProperty('mask-image', combinedMask);
  }
}, 50);


// Resize tiles in improvement section (so the tile height fits their content)
const contentImprovement = document.getElementById('content-improvement');

// Calculate height of tile based on content + set span accordingly
function resizeTile(tile) {
  const row = parseInt(getComputedStyle(contentImprovement)['gridAutoRows']);
  const span = Math.ceil((tile.getBoundingClientRect().height) / row);
  tile.style.gridRowEnd = `span ${span}`;
}

// Resize all tiles
function resizeImprovementTiles() {
  Array.from(contentImprovement.children).forEach(tile => {
    resizeTile(tile);

    // Assure images are loaded in tile for correct resizing
    tile.querySelectorAll('img').forEach(img => {
      if (img.complete) resizeTile(tile);
      else img.addEventListener('load', () => resizeTile(tile), { once: true });
    });
  });
}

window.addEventListener('load', resizeImprovementTiles);
window.addEventListener('resize', resizeImprovementTiles);
