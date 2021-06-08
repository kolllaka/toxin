const options = JSON.parse(data)[0];
const myCanvas = document.getElementById("rateCanvas");
// options = {
// 	data: {
// 		"Великолепно": 130,
// 		"Хорошо": 80,
// 		"Удовлетворительно": 65,
// 		"Разочарован": 12
// 	},
// 	colors: {
// 		"Великолепно": ["#FFE39C", "#FFBA9C"],
// 		"Хорошо": ["#6FCF97", "#66D2EA"],
// 		"Удовлетворительно": ["#BC9CFF", "#8BA4F9"],
// 		"Разочарован": ["#909090", "#3D4975"]
// 	}
// }
const conva = options.conva;
if (myCanvas) {
	var ctx = myCanvas.getContext('2d');
	ctx.height = myCanvas.getAttribute('height') || 150;
	ctx.width = myCanvas.getAttribute('width') || 300;
	var canvas = { start: ctx.height / 2, end: ctx.height / 2, radiusIn: ctx.height / 2 - 4, radiusOut: ctx.height / 2 }

	draw();
}

function draw() {
	let totalValue = 0;
	for (var categ in options.data) {
		let val = options.data[categ];
		totalValue += val;
	}

	let endAngle = -Math.PI / 2;
	for (sector in options.data) {
		if (options.data[sector] > 0) {
			startAngle = endAngle;
			endAngle -= 2 * Math.PI / totalValue * options.data[sector];

			ctx.fillStyle = '#ffffff';
			ctx.beginPath();
			ctx.moveTo(canvas.start, canvas.end);
			ctx.arc(canvas.start, canvas.end, canvas.radiusOut, startAngle, startAngle - conva * Math.PI / 360, true);
			ctx.closePath();
			ctx.fill();

			let linerGradient = ctx.createLinearGradient(canvas.start, canvas.end - canvas.radiusOut, canvas.start, canvas.end + canvas.radiusOut);
			linerGradient.addColorStop(0, options.colors[sector][0]);
			linerGradient.addColorStop(1, options.colors[sector][1]);
			ctx.fillStyle = linerGradient;
			ctx.beginPath();
			ctx.moveTo(canvas.start, canvas.end);
			ctx.arc(canvas.start, canvas.end, canvas.radiusOut, startAngle - conva * Math.PI / 360, endAngle + conva * Math.PI / 360, true);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = '#ffffff';
			ctx.beginPath();
			ctx.moveTo(canvas.start, canvas.end);
			ctx.arc(canvas.start, canvas.end, canvas.radiusOut, endAngle + conva * Math.PI / 360, endAngle, true);
			ctx.closePath();
			ctx.fill();
		}
	}
	//ctx.fillRect(canvas.start, canvas.end, 30, -30);
	ctx.fillStyle = '#ffffff';
	ctx.beginPath();
	ctx.moveTo(canvas.start, canvas.end);
	ctx.arc(canvas.start, canvas.end, canvas.radiusIn, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();

	if (options.desc) {
		document.querySelector(`[for="${myCanvas.id}"]`).innerHTML = "<span>" + totalValue + "</span> голосов";
	}
}
// ==========================================================================================================================================================================================================================================




