function initButterfly (startingX, startingY) {
	var newButterfly = {};
	newButterfly.x = startingX;
	newButterfly.y = startingY;
	newButterfly.captured = false;

	var butterflyImg = new Image();
	butterflyImg.onload = function () {
		newButterfly.width = 80;
		newButterfly.height = butterflyImg.height;

		newButterfly.spriteSheet = butterflyImg;

		newButterfly.flyingSprite = sprite({
			width: newButterfly.width,
			height: newButterfly.height,
			image: newButterfly.spriteSheet,
			numberOfFrames: 2,
			startingFrameIndex: 0,
			ticksPerFrame: (Math.random() * 10) + 8,  // random wing flap rate between 8 and 18
			loop: true
		});

		newButterfly.render = function () {
			newButterfly.flyingSprite.render(newButterfly.canvasX, newButterfly.canvasY);
		};

		newButterfly.update = function () {
			newButterfly.flyingSprite.update();
		};
	};

	newButterfly.capture = function() {
		newButterfly.captured = true;
	};

	butterflyImg.src = "imgs/butterfly-sprite.png";

	return newButterfly;
}