const priceFilter = document.querySelector('.price-filter__slider');

if (priceFilter) {
	noUiSlider.create(priceFilter, {
		start: [5000, 10000],
		connect: true,
		format: wNumb({
			decimals: 0,
			thousand: ' ',
			suffix: '₽'
		}),
		range: {
			'min': [0],
			'max': [16000]
		}
	});
	const priceStart = document.getElementById('price-start');
	const priceEnd = document.getElementById('price-end');
	priceFilter.noUiSlider.on('update', function (values) {
		priceStart.innerHTML = values[0];
		priceEnd.innerHTML = values[1];
	});
}

// Rating
const ratings = document.querySelectorAll('.grade');

if (ratings.length > 0) {
	initRatings();
}

function initRatings() {
	let ratingActive, ratingValue;
	// Перебор по всем рейтингам
	for (let index = 0; index < ratings.length; index++) {
		const rating = ratings[index];
		initRating(rating);
	}
	// Инициализация конкретного рейтинга
	function initRating(rating) {
		initRatingVars(rating);
		setRatingActiveWidth();

		// ЕСли есть модификатор grade_set то даёт возможность собирать рейтинг
		if (rating.classList.contains('grade_set')) {
			setRating(rating);
		}
	}
	// Инициализация переменных
	function initRatingVars(rating) {
		ratingActive = rating.querySelector('.grade__active');
		ratingValue = rating.querySelector('.grade__active').getAttribute('data-rate');
		//ratingValue = rating.querySelector('.grade__active').dataset.value;
	}
	// Изменяет ширину звёзд
	function setRatingActiveWidth(index = ratingValue) {
		const ratingActiveWidth = index / 0.05;
		ratingActive.style.width = `${ratingActiveWidth}%`;
	}
	// Даёт возможность устанавливать оценку
	function setRating(rating) {
		const ratingItems = rating.querySelectorAll('.grade__item');
		for (let index = 0; index < ratingItems.length; index++) {
			const ratingItem = ratingItems[index];
			ratingItem.addEventListener('mouseenter', function (e) {
				// Обновление переменных
				initRatingVars(rating);
				// Обновление активных звёзд
				setRatingActiveWidth(ratingItem.value);
			});
			ratingItem.addEventListener('mouseleave', function (e) {
				// Обновление активных звёзд
				setRatingActiveWidth();
			});
			ratingItem.addEventListener('click', function (e) {
				// Обновление переменных
				initRatingVars(rating);

				if (rating.dataset.ajax) {
					// "Отправить" на сервер
					setRatingVars(ratingItem.value, rating);
				} else {
					// Отобразить указанную оценку
					ratingValue = index + 1;
					setRatingActiveWidth();
				}
			});
		}
	}

	async function setRatingVars(values, rating) {
		if (!rating.classList.contains('rating_sending')) {
			rating.classList.add('rating_sending');

			// Отправка данных (value) на сервер
			let response = await fetch('rating.json', {
				method: 'GET',

				// Код для отправки на сервер
				// body: JSON.stringify({
				// 	userRating: value
				// }),
				// headers: {
				// 	'content-type': 'application/json'
				// }

			});
			if (response.ok) {
				const result = await response.json();

				// Получение нового рейтинга
				const newRating = result.newRating;

				// Вывод нового среднего рейтинга
				rating.querySelector('.grade__active').setAttribute('data-rate', newRating);

				// Обновление активных звёзд
				setRatingActiveWidth();

				rating.classList.remove('rating_sending');
			} else {
				// Ошибка O_o
				alert("Ошибка");

				rating.classList.remove('rating_sending');
			}
		}
	}
};

// Переключение между sign in и registration
let logTabs = document.querySelectorAll('.logandreg__tab');
let logBodyTabs = document.querySelectorAll('.logandreg__item')
if (logTabs.length > 0) {

	for (let index = 0; index < logTabs.length; index++) {
		let logTab = logTabs[index];
		let toggleButton = logTab.querySelector('.logandreg__btn');

		toggleButton.addEventListener('click', function (e) {
			for (let index = 0; index < logBodyTabs.length; index++) {
				const logBodyTab = logBodyTabs[index];
				logBodyTab.classList.toggle('_active');
			}
		});
	}
}
let strGET = window.location.search.replace('?', '');
if (strGET.includes('tab=reg')) {
	document.querySelectorAll('.logandreg__item').forEach((item) =>
		item.classList.toggle('_active')
	);
}

// по классу _toggle переключает класс _active для кнопки like
let toggleItems = document.querySelectorAll('._togglelike');
if (toggleItems.length > 0) {
	for (let index = 0; index < toggleItems.length; index++) {
		let toggleItem = toggleItems[index];
		toggleItem.addEventListener('click', function (e) {
			if (toggleItem.classList.contains('_active')) {
				toggleItem.textContent = parseInt(toggleItem.textContent) - 1;
			} else {
				toggleItem.textContent = parseInt(toggleItem.textContent) + 1;
			}
			toggleItem.classList.toggle('_active');
		});
	}
}
// Datepicker ==========================================================================================================================================================================================================================================
$('#itsdatepicker').datepicker({
	inline: true,
	toggleSelected: false,
	range: true,
	nextHtml: '<div class="_arrow_next"></div>',
	prevHtml: '<div class="_arrow_prev"></div>',
	multipleDatesSeparator: " - ",
	//todayButton: true,
	//dateFormat: "dd.mm.yyyy",
	onSelect: function (dateFormat, date, picker) {
		// Ничего не делаем если выделение было снято
		if (!date) return;

		let str = dateFormat.split(picker.opts.multipleDatesSeparator);
		const inputDate = picker.el.closest('.select').querySelectorAll('.select__select');

		if (inputDate.length > 1) {
			inputDate.forEach((el, index) => el.value = str[index] || el.getAttribute("placeholder"));
		} else {
			inputDate[0].value = dateFormat;
		}
	}
});

const datepicker = $('#itsdatepicker').datepicker().data('datepicker');
const clearDateButton = document.querySelector('.datepicker__button[type="reset"]');
const inputDate = datepicker.el.closest('.select').querySelectorAll('input');

if (clearDateButton) {
	clearDateButton.addEventListener('click', (e) => {
		e.preventDefault();

		inputDate.forEach((input) => input.value = '');
		datepicker.clear();
	});
}

if (inputDate.length > 0) {
	let dateMassive = [];
	inputDate.forEach((input, index) => {
		//let dateInInput = input.value;
		//console.log(dateInInput);

		input.addEventListener('change', () => {
			// console.log('dateMassiveInit:', dateMassive);
			// console.log('in ', index);



			// console.log("date", index, ":", input.value);
			let inputVal = forDateformat(input.value);
			// console.log(inputVal);

			if (isValidDate(inputVal)) {
				if (isValidDate(dateMassive[0])) {
					// console.log('start date valid');

					if (inputVal > dateMassive[0]) {
						// console.log('input > start date');
						dateMassive[1] = inputVal;
					} else {
						// console.log('input < start date');
						dateMassive[1] = dateMassive[0];
						dateMassive[0] = inputVal;
					}
				} else {
					// console.log('start date no valid');
					dateMassive[0] = inputVal;
				}

				// console.log("start: ", dateMassive[0]);
				// console.log("end: ", dateMassive[1]);
				inputVal[0] = dateMassive[0];
				inputVal[1] = dateMassive[1];
				// console.log("inputVal", inputVal[0], inputVal[1]);

				datepicker.selectDate(inputVal);

			}
		});
	});
}
function forDateformat(value) {
	let valueDateMas = value.split('.');

	return new Date(valueDateMas[2], valueDateMas[1] - 1, valueDateMas[0]);
}

function isValidDate(d) {
	return d instanceof Date && !isNaN(d);
}
// custom mask на inputs ==========================================================================================================================================================================================================================================
document.addEventListener('DOMContentLoaded', () => {
	const elements = document.querySelectorAll('[data-mask="date"]')
	const maskOptions = {
		mask: Date,
		lazy: false,
		overwrite: true,
		autofix: true,
		blocks: {
			d: { mask: IMask.MaskedRange, placeholderChar: 'Д', from: 1, to: 31, maxLength: 2 },
			m: { mask: IMask.MaskedRange, placeholderChar: 'М', from: 1, to: 12, maxLength: 2 },
			Y: { mask: IMask.MaskedRange, placeholderChar: 'Г', from: 1900, to: 2999, maxLength: 4 }
		}
	}
	if (!elements) return
	elements.forEach((element) => {
		let mask = new IMask(element, maskOptions);
	});
});