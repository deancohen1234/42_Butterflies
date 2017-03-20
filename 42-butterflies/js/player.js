function initPlayer (startingX) {
	var newPlayer = {};

	newPlayer.reset = function () {
		newPlayer.x = startingX;
		newPlayer.y = canvas.height - newPlayer.height;
		newPlayer.maxSpeed = 10;
		newPlayer.xVelocity = 0;
		newPlayer.yVelocity = 0;
		newPlayer.jumping = false;
		newPlayer.walking = false;
		newPlayer.onWall = false; 
		newPlayer.direction = 'right';
	};

	newPlayer.reset();

	var playerImg = new Image();
	playerImg.onload = function () {
		newPlayer.y = height - playerImg.height;
		newPlayer.width = 220;
		newPlayer.height = playerImg.height;
		newPlayer.spriteSheet = playerImg;
		newPlayer.xyArray = [width][height];

		newPlayer.rightStandingSprite = sprite({
			width: newPlayer.width,
			height: newPlayer.height,
			image: newPlayer.spriteSheet,
			numberOfFrames: 1,
			startingFrameIndex: 0,
			loop: false
		});

		newPlayer.leftStandingSprite = sprite({
			width: newPlayer.width,
			height: newPlayer.height,
			image: newPlayer.spriteSheet,
			numberOfFrames: 1,
			startingFrameIndex: 0,
			loop: false
		});

		newPlayer.rightWalkingSprite = sprite({
			width: player.width,
			height: player.height,
			image: player.spriteSheet,
			numberOfFrames: 4,
			ticksPerFrame: 20,
			startingFrameIndex: 0,
			loop: true
		});

		newPlayer.leftWalkingSprite = sprite({
			width: player.width,
			height: player.height,
			image: player.spriteSheet,
			numberOfFrames: 4,
			ticksPerFrame: 20,
			startingFrameIndex: 0,
			loop: true
		});

		newPlayer.rightJumpingSprite = sprite({
			width: player.width,
			height: player.height,
			image: player.spriteSheet,
			numberOfFrames: 1,
			ticksPerFrame: 20,
			startingFrameIndex: 0,
			loop: false
		});

		newPlayer.leftJumpingSprite = sprite({
			width: player.width,
			height: player.height,
			image: player.spriteSheet,
			numberOfFrames: 1,
			ticksPerFrame: 20,
			startingFrameIndex: 0,
			loop: false
		});

		function setCurrentSprite () {
			if (newPlayer.direction === 'left') {
				newPlayer.currentSprite = newPlayer.jumping ?
					newPlayer.leftJumpingSprite :
					(newPlayer.walking ? newPlayer.leftWalkingSprite : newPlayer.leftStandingSprite);
			}
			else {
				newPlayer.currentSprite = newPlayer.jumping ?
					newPlayer.rightJumpingSprite :
					(newPlayer.walking ? newPlayer.rightWalkingSprite : newPlayer.rightStandingSprite);
			}
		}

		newPlayer.update = function () {
			// apply physics
			player.xVelocity *= friction;
			player.yVelocity += gravity;

			// change player position
			player.x += player.xVelocity;
			player.y += player.yVelocity;
			player.canvasX = player.x;

			// check for background boundaries to change the background position
			// 0 + width/2 -> let player move up to 0
			if (player.x <= (canvas.width / 2) - (player.width /2)) {
				if (player.x <= 0) {
					player.x = 0;
					player.onWall = true;
					if (player.jumping) {
						player.xVelocity += player.maxSpeed * 10;
						player.yVelocity -= player.maxSpeed * 2;
					}
				}
				player.canvasX = player.x;
			}
			// background.width - width/2 -> let player move up to background.width
			else if (player.x >= level.background.width - (canvas.width / 2) - (player.width /2)) {
				if (player.x >= level.background.width - player.width) {
					player.x = level.background.width - player.width;
					player.onWall = true;
				}
				player.canvasX = player.x - level.background.width + canvas.width;
			}
			// anything in between -> move both the background and the player
			else {
				player.canvasX = (canvas.width / 2) - (player.width /2);
				player.onWall = false;
			}

			// check for vertical boundaries
			if (player.y >= canvas.height - player.height) {
				player.y = canvas.height - player.height;
				player.jumping = false;
			}
			player.canvasY = player.y;

			setCurrentSprite();
			newPlayer.currentSprite.update();
		};

		newPlayer.render = function () {
			newPlayer.walking = newPlayer.xVelocity > 0.01 || newPlayer.xVelocity < -0.01;
			setCurrentSprite();
			newPlayer.currentSprite.render(newPlayer.canvasX, newPlayer.canvasY);
		};
	};

	newPlayer.collisionCheck = function (other) {
		var collisionObject = {
			// we don't want to check the entire sprite, just the reasonable part
			x: newPlayer.direction === 'left' ? newPlayer.x + 70 : newPlayer.x + 40,
			y: newPlayer.y + 25,
			width: newPlayer.width - 110,
			height: newPlayer.height - 25
		};

		return checkColl(collisionObject, other);
	};

	playerImg.src = "imgs/human-sprite.png";

	return newPlayer;
}