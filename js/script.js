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
const modalFileInput = document.querySelector('.modal__file-input');
const modalFileBtn = document.querySelector('.modal__file-btn');
const modalImageAdd = document.querySelector('.modal__image-add');

//временные константы для картинки и подписи
const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

// форма в модальном окне
// получаем все элементы из формы
const elementsModalSubmit = [...modalSubmit.elements]
	.filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');   // 58:40 // исключение кнопки

const infoPhoto = {};

// база  в localStoreage
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

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
		modalImageAdd.src = srcModalImage;
		modalFileBtn.textContent = textFileBtn;
		checkForm();
	}
};

// photo
modalFileInput.addEventListener('change', event => {
	const target = event.target;
	const reader = new FileReader();
	const file = target.files[0];

	infoPhoto.filename = file.name;
	infoPhoto.size = file.size;

	reader.readAsBinaryString(file);

	reader.addEventListener('load', event => {
		if (infoPhoto.size < 200000) {
			// меняем название у кнопки
			modalFileBtn.textContent = infoPhoto.filename;
			infoPhoto.base64 = btoa(event.target.result);
			// отображене картнки
			modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
		} else {
			modalFileBtn.textContent = 'Файл не должен привышать 200кб';
		}
	});
});

// События для формы в модальном окне
modalSubmit.addEventListener('input', checkForm);
// избавляемся от перезагрузки страницы
modalSubmit.addEventListener('submit', event => {
	event.preventDefault();
	const itemObj = {};
	for (const elem of elementsModalSubmit) {
		itemObj[elem.name] = elem.value;
		itemObj.image = infoPhoto.base64;
		dataBase.push(itemObj);
		closeModal({ target: modalAdd });
		saveDB();
	}
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
// 01:13