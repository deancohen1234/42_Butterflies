var requestAnimationFrame, canvas, context, timeout, width, height, keys, player, friction, gravity;
var score, scoreCard;
var levelCleared = false;
var superLevelCleared = false;
var levelCount = 1;

(initialize());

function initialize () {
	document.getElementById('playButton').onclick = function () {
		document.getElementById('music').play();
		document.getElementById('playButton').style.display = 'none';
		document.getElementById('pauseButton').style.display = 'block';
	};
	document.getElementById('pauseButton').onclick = function () {
		document.getElementById('music').pause();
		document.getElementById('pauseButton').style.display = 'none';
		document.getElementById('playButton').style.display = 'block';
	};


	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimation || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	// these can be arbitrary, but should be less than the background image dimensions
	// height can be the same if there will be no vertical change in background
	width = 800;
	height = 600;
	canvas.width = width;
	canvas.height = height;

	level = initLevel(42);

	score = 0;
	scoreCard = document.getElementById('score');
	scoreCard.innerHTML = score;

	keys = [];
	friction = 0.8;
	gravity = 0.5;

	player = initPlayer(width / 4);

}

// on page load
window.addEventListener('load', function () {
	update();
});

// on keydown event
document.body.addEventListener('keydown', function (e) {
	keys[e.keyCode] = true;
});

// on keyup event
document.body.addEventListener('keyup', function (e) {
	keys[e.keyCode] = false;
});

// update the game canvas
function updateGame () {
	// check for keys pressed
	if (keys[38] || keys[32]) {
		// up arrow || space bar
		if (!player.jumping) {
			player.jumping = true;
			player.yVelocity = -player.maxSpeed * 2;
		}
		if (player.onWall) {
			player.jumping = true;
			player.yVelocity = -player.maxSpeed * 2;
		}
	}
	if (keys[39]) {
		// right arrow
		player.direction = 'right';
		if (player.xVelocity < player.maxSpeed) {
			player.xVelocity += 2;
		}
	}
	if (keys[37]) {
		// left arrow
		player.direction = 'left';
		if (player.xVelocity > -player.maxSpeed) {
			player.xVelocity-= 2;
		}
	}
	
	if (keys[32] && superLevelCleared) {
			context.fillStyle = '#000000'
		}

	// clear the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	if (superLevelCleared) {
		context.fillStyle = '#000000';
		context.font = '2.0em "Jim Nightshade"';
		//context.font.color = '#FFFFFF'
		var message = 'You have shown great promise my child. Few have the determination to push this far. It shows that even though your struggle is fierce and unending, there is always hope and joy somewhere, waiting to be found. It may be small, almost unnoticable but it is there. Your life begins when you want it to. Go. This game is over. Your live was, is, and will always be a miracle. Make it something that is also miraculous';
		//context.fillText(stringDivider(message, 10, "<br/>\n"), (canvas.width - context.measureText(message).width)/2, canvas.height/2);
		wrapText(context, message, 10 ,100, canvas.width, 50);
		// display the message for 2 seconds before clearing it and starting a new level
	}
	
	function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }

	if (!levelCleared) {
		// update player and level info
		player.update();
		level.update();

		// draw player and level
		// we want the level to be on the bottom, so we need to draw it first
		level.render();
		player.render();
	}
	else {
		if (!superLevelCleared) {
			// setup a message to display
		context.fillStyle = '#8060B6';
		context.font = '6em "Jim Nightshade"';
		var message = 'Level ' + levelCount + ' cleared!';
		context.fillText(message, (canvas.width - context.measureText(message).width)/2, canvas.height/2);
		// display the message for 2 seconds before clearing it and starting a new level
		if (timeout === undefined) {
			timeout = window.setTimeout(function () {
				levelCleared = false;
				levelCount++;
				level.reset(level.maxScore + Math.ceil(level.maxScore/2));
				player.reset();
				window.clearTimeout(timeout);
				timeout = undefined;
			}, 2000);
		}
		}
		
	}
}

// collision detection
function checkColl (obj1, obj2) {
	return (obj1.x + obj1.width >= obj2.x)
		&& (obj1.x <= obj2.x + obj2.width)
		&& (obj1.y <= obj2.y + obj2.height)
		&& (obj1.y + obj1.height >= obj2.y);
}

function incrementScore(butterfly) {
	if (!butterfly.captured) {
		butterfly.capture();
		level.currentScore++;
		scoreCard.innerHTML = score + level.currentScore;

		if (level.currentScore == level.maxScore) {
			levelCleared = true;
			superLevelCleared = true;
			score = score + level.currentScore;
			scoreCard.innerHTML = score;
		}
		else if (level.currentScore >= level.superMaxScore) {
			superLevelCleared = true;
			score = score + level.currentScore;
			scoreCard.innerHTML = score;
		}
	}

}

// on frame draw
function update () {
	updateGame();
	// update frame
	requestAnimationFrame(update);
}
