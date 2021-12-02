// Canvas init
const ctx = Canvas.getContext("2d"),
	toggleCanvasPart = (part, partDisp = 1) => {
		// Toggle part display on/off on the hangman canvas
		// If partDisp is empty the part will be displayed
		// Set draw color
		if (partDisp == 1) ctx.strokeStyle = "#000";
		else ctx.strokeStyle = "#f2ecd9";
		// Draw parts
		ctx.lineWidth = 4;
		ctx.beginPath();
		switch (part) {
			case 1:
			case "ground":
				// Ground
				ctx.moveTo(100, 350);
				ctx.lineTo(200, 350);
				break;
			case 2:
			case "vertical":
				// Vertical pillar
				ctx.moveTo(150, 100);
				ctx.lineTo(150, 350);
				break;
			case 3:
			case "horizontal":
				// Horizontal wood
				ctx.moveTo(148, 100);
				ctx.lineTo(284, 100);
				break;
			case 4:
			case "diagonal":
				// Diagonal wood
				ctx.moveTo(150, 152);
				ctx.lineTo(200, 100);
				break;
			case 5:
			case "rope":
				// Rope
				ctx.moveTo(282, 100);
				ctx.lineTo(282, 150);
				break;
			case 6:
			case "head":
				// Head
				ctx.arc(282, 170, 20, 0, 2 * Math.PI);
				break;
			case 7:
			case "body":
				// Body
				ctx.moveTo(282, 190);
				ctx.lineTo(282, 248);
				break;
			case 8:
			case "arm1":
				// Left arm
				ctx.moveTo(282, 196);
				ctx.lineTo(260, 220);
				break;
			case 9:
			case "arm2":
				// Right arm
				ctx.moveTo(282, 196);
				ctx.lineTo(304, 220);
				break;
			case 10:
			case "foot1":
				// Left foot
				ctx.moveTo(282, 246);
				ctx.lineTo(276, 280);
				break;
			case 11:
			case "foot2":
				// Right foot
				ctx.moveTo(282, 246);
				ctx.lineTo(290, 280);
				break
		}
		ctx.stroke();
		ctx.closePath()
	},
	clearCanvas = () => {
		// Clear all canvas parts
		toggleCanvasPart("ground", 0);
		toggleCanvasPart("vertical", 0);
		toggleCanvasPart("horizontal", 0);
		toggleCanvasPart("diagonal", 0);
		toggleCanvasPart("rope", 0);
		toggleCanvasPart("head", 0);
		toggleCanvasPart("body", 0);
		toggleCanvasPart("arm1", 0);
		toggleCanvasPart("arm2", 0);
		toggleCanvasPart("foot1", 0);
		toggleCanvasPart("foot2", 0)
	};
// Set canvas size
ctx.canvas.width = 400;
ctx.canvas.height = 400;
clearCanvas()