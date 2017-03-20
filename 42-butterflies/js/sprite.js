
function sprite (options) {
	var newSprite = {};

	newSprite.width = options.width;
	newSprite.height = options.height;
	newSprite.image = options.image;
	newSprite.loop = options.loop;

	var frameIndex = 0;
	var tickCount = 0;
	var ticksPerFrame = options.ticksPerFrame || 0;
	var numberOfFrames = options.numberOfFrames || 1;
	var startingFrame = options.startingFrameIndex || 0;

	newSprite.render = function (x, y) {
		context.drawImage(
			newSprite.image,  // image
			(startingFrame + frameIndex) * newSprite.width,  // source x
			0,  // source y
			newSprite.width,  // source width
			newSprite.height,  // source height
			x,  // destination x
			y,  // destination  y
			newSprite.width,  // destination width
			newSprite.height  // destination height
		);
	};

	newSprite.update = function () {
		tickCount += 1;
		if (tickCount > ticksPerFrame) {
			tickCount = 0;
			if (frameIndex < numberOfFrames - 1) {
				frameIndex += 1;
			}
			else if (newSprite.loop) {
				frameIndex = 0;
			}
		}
	}
	;

	return newSprite;
}
