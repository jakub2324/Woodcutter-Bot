var robot = require('robotjs');

function main() {
  console.log('Starting...');
  sleep(4000);

  while (true) {
    var tree = findTree();
    if (tree == false) {
      rotateCamera();
      continue;
    }

    robot.moveMouse(tree.x, tree.y);
    robot.mouseClick();
    sleep(3000);

    dropLogs();
  }
}

// empties inventory once logs fill up
function dropLogs() {
  var inventory_x = 1882;
  var inventory_y = 830;
  var inventory_log_color = '765b37';

  var pixel_color = robot.getPixelColor(inventory_x, inventory_y);

  var wait_cycles = 0;
  var max_wait_cycles = 9;
  while (pixel_color != inventory_log_color && wait_cycles < max_wait_cycles) {
    sleep(1000);
    pixel_color = robot.getPixelColor(inventory_x, inventory_y);
    wait_cycles++;
  }

  if (pixel_color == inventory_log_color) {
    robot.moveMouse(inventory_x, inventory_y);
    robot.mouseClick('right');
    sleep(300);
    robot.moveMouse(inventory_x, inventory_y + 70);
    robot.mouseClick();
    sleep(1000);
  }
}

function findTree() {
  var x = 300,
    y = 300,
    width = 1300,
    height = 400;
  var img = robot.screen.capture(x, y, width, height);

  var tree_colors = [
    '5b462a',
    '60492c',
    '6a5130',
    '705634',
    '6d5432',
    '574328',
    '654c2d',
    '5a4429',
    '795a34',
  ];

  for (var i = 0; i < 500; i++) {
    var random_x = getRandomInt(0, width - 1);
    var random_y = getRandomInt(0, height - 1);
    var sample_color = img.colorAt(random_x, random_y);

    if (tree_colors.includes(sample_color)) {
      var screen_x = random_x + x;
      var screen_y = random_y + y;
      return { x: screen_x, y: screen_y };
    }
  }

  return false;
}

//rotate camera if stuck in area with no trees
function rotateCamera() {
  console.log('Rotating camera');
  robot.keyToggle('right', 'down');
  sleep(1000);
  robot.keyToggle('right', 'up');
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

main();
