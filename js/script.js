'use strict';
// массив для объявления
const dataBase = [];


const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const modalBtnWarning = document.querySelector('.modal__btn-warning');

// форма в модальном окне
// получаем все элементы из формы
const elementsModalSubmit = [...modalSubmit.elements]
	.filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');   // 58:40 // исключение кнопки
// console.log(elementsModalSubmit);

const checkForm = () => {
	// прверка на заполнение всех input формы
	const validForm = elementsModalSubmit.every(elem => elem.value);
	// console.log(validForm);
	// разблокировка кнопки "отправить" в модальном окне
	modalBtnSubmit.disabled = !validForm;
	modalBtnWarning.style.display = validForm ? 'none' : '';
	/*
// или подругому
if (validForm) {
	modalBtnWarning.style.display = 'none';
} else {
	modalBtnWarning.style.display = '';
}
*/
};

// закрытие модального окна
const closeModal = (event) => {
	const target = event.target;
	if (target.closest('.modal__close') ||
		target.classList.contains('modal') ||
		event.code === 'Escape') {
		// console.log(1);
		modalAdd.classList.add('hide');
		modalItem.classList.add('hide');
		document.removeEventListener('keydown', closeModal);
		modalSubmit.reset();
		checkForm();
	}
	// if(target.closest('.modal__close') || target === this) {
	// 	this.classList.add('hide');
	// 	// зачистка формы
	// 	if(this === modalAdd) {
	// 		console.log(modalAdd);
	// 		modalSubmit.reset();
	// 	}
	// }
};
// console.log(modalAdd);
/*
// Закрытие модального окна по кнопке Esc
const closeModalEsc = event => {
	// console.log('close');
	if (event.code === 'Escape') {
		modalAdd.classList.add('hide');
		modalItem.classList.add('hide');
		document.removeEventListener('keydown', closeModalEsc);
	}
};
*/
// События для формы в модальном окне
modalSubmit.addEventListener('input', checkForm);
// избавляемся от перезагрузки страницы
// блокируем стандартное поведение браузера
modalSubmit.addEventListener('submit', event => {
	event.preventDefault();
	const itemObj = {};
	for (const elem of elementsModalSubmit) {
		itemObj[elem.name] = elem.value;
	}
	dataBase.push(itemObj);
	closeModal({ target: modalAdd });
	// modalSubmit.reset();
});

// Отлавливаем событие click и показывает модальное окно
addAd.addEventListener('click', () => {
	// открытие модального окна формы
	modalAdd.classList.remove('hide');
	//блокировка кнопки "отправить" в модальном окне
	modalBtnSubmit.disabled = true;
	// Закрытие модального окна по кнопке Esc
	document.addEventListener('keydown', closeModal);
});

// получаем модальное окно карточки 
catalog.addEventListener('click', (event) => {
	const target = event.target;

	if (target.closest('.card')) {
		// открытие модального окна карточки
		modalItem.classList.remove('hide');
		// Закрытие модального окна по кнопке Esc
		document.addEventListener('keydown', closeModal);
	}
});

// Закрытие модальных окон
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);