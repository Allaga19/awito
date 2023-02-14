'use strict';
// массив для объявления
const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

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

	// база  в localStoreage
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));
console.log(dataBase);

const checkForm = () => {
	// прверка на заполнение всех input формы
	const validForm = elementsModalSubmit.every(elem => elem.value);
	// разблокировка кнопки "отправить" в модальном окне
	modalBtnSubmit.disabled = !validForm;
	modalBtnWarning.style.display = validForm ? 'none' : '';
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
};
// События для формы в модальном окне
modalSubmit.addEventListener('input', checkForm);
// избавляемся от перезагрузки страницы
modalSubmit.addEventListener('submit', event => {
	event.preventDefault();
	const itemObj = {};
	for (const elem of elementsModalSubmit) {
		itemObj[elem.name] = elem.value;
	}
	dataBase.push(itemObj);
	closeModal({ target: modalAdd });
	saveDB();
});

// Отлавливаем событие click и показывает модальное окно
addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	modalBtnSubmit.disabled = true;
	document.addEventListener('keydown', closeModal);
});

// получаем модальное окно карточки 
catalog.addEventListener('click', (event) => {
	const target = event.target;

	if (target.closest('.card')) {
		modalItem.classList.remove('hide');
		document.addEventListener('keydown', closeModal);
	}
});

// Закрытие модальных окон
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);