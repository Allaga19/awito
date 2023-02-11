// 'use strict';
const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal-submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');

const closeModal = (event) => {
	const target = event.target;
	// открытие и закрытие модального окна
	if (target.classList.contains('modal__close') ||
	target === modalAdd || 
	target === modalItem) {
		modalAdd.classList.add('hide');
		modalItem.classList.add('hide');
		// зачистка формы
		modalSubmit.reset();
	}
};

// console.log(modalAdd);
// Отлавливаем событие click, модальное окно
addAd.addEventListener('click', () => {
	// открытие модального окна формы
	modalAdd.classList.remove('hide');
	//блокировка кнопки "отправить" в модальном окне
	modalBtnSubmit.disabled = true;
});

// Закрытие модальных окон
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

// получаем карточку 
catalog.addEventListener('click', (event) => {
	const target = event.target;
	if (target.closest('.card')) {
		// открытие модального окна карточки
		modalItem.classList.remove('hide');
	}

});
