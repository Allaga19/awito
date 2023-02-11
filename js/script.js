// 'use strict';
const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');


// открытие и закрытие модального окна
const closeModal = function(event) {
	const target = event.target;
	if(target.closest('.modal__close') || target === this) {
		this.classList.add('hide');
		// зачистка формы
		if(this === modalAdd) {
			console.log(modalAdd);
			modalSubmit.reset();
		}
	}
};
// console.log(modalAdd);

// Закрытие модального окна по кнопке Esc
const closeModalEsc = event => {
	// console.log('close');

	if (event.code === 'Escape') {
		modalAdd.classList.add('hide');
		modalItem.classList.add('hide');
		document.removeEventListener('keydown', closeModalEsc);
	}
};

// Отлавливаем событие click, модальное окно
addAd.addEventListener('click', () => {
	// открытие модального окна формы
	modalAdd.classList.remove('hide');
	//блокировка кнопки "отправить" в модальном окне
	modalBtnSubmit.disabled = true;
	// Закрытие модального окна по кнопке Esc
	document.addEventListener('keydown', closeModalEsc);
});

// Закрытие модальных окон
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

// получаем модальное окно карточки 
catalog.addEventListener('click', (event) => {
	const target = event.target;
	if (target.closest('.card')) {
		// открытие модального окна карточки
		modalItem.classList.remove('hide');
	// Закрытие модального окна по кнопке Esc
	document.addEventListener('keydown', closeModalEsc);
	}
});

