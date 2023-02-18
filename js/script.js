'use strict';
// массив для объявления
const dataBase = JSON.parse(localStorage.getItem('awito')) || [];
let counter = dataBase.length;
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

const modalImageItem = document.querySelector('.modal__image-item');
const modalHeaderItem = document.querySelector('.modal__header-item');
const modalStatusItem = document.querySelector('.modal__status-item');
const modalDescriptionItem = document.querySelector('.modal__description-item');
const modalCostItem = document.querySelector('.modal__cost-item');

const searchInput = document.querySelector('.search__input');
const menuContainer = document.querySelector('.menu__container');

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

// вывод товара
const renderCard = (DB = dataBase) => {
	catalog.textContent = '';

	DB.forEach(item => {
		catalog.insertAdjacentHTML('beforeend',`
			<li class="card" data-id="${item.id}">
				<img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
				<div class="card__description">
					<h3 class="card__header">${item.nameItem}</h3>
					<div class="card__price">${item.costItem} &#8381;</div>
				</div>
			</li>
		`);
	});
};

searchInput.addEventListener('input', () => {
	const valueSearch = searchInput.value.trim().toLowerCase();

	if (valueSearch.length > 2) {
		// console.log(valueSearch);
		const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) || item.descriptionItem.toLowerCase().includes(valueSearch));
		renderCard(result);
	}
});

// photo
// обрабатываем событие смены фотографии при подаче объявления
modalFileInput.addEventListener('change', event => {
	const target = event.target;
	const reader = new FileReader();
	const file = target.files[0];  //получаем первый элемент - файл с фотографией

	infoPhoto.filename = file.name;  // имя файла
	infoPhoto.size = file.size;  // размер в байтах

	reader.readAsBinaryString(file);

	reader.addEventListener('load', event => {
		if (infoPhoto.size < 300000) {
			// меняем название у кнопки
			modalFileBtn.textContent = infoPhoto.filename;
			infoPhoto.base64 = btoa(event.target.result);
			// отображение картинки
			modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
		} else {
			modalFileBtn.textContent = 'Файл не должен привышать 300кб';
			modalFileInput.value = '';
			checkForm();
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
	}
		itemObj.id = counter++;
		itemObj.image = infoPhoto.base64;
		dataBase.push(itemObj);
		closeModal({target: modalAdd});
		saveDB();
		renderCard();
});

// Отлавливаем событие click и показывает модальное окно
addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	modalBtnSubmit.disabled = true;
	document.addEventListener('keydown', closeModal);
});


// получаем модальное окно карточки 
catalog.addEventListener('click', event => {
	const target = event.target;
	const card = target.closest('.card');
//функция подготовки модального окна с объявлением для конкретной карточки
	if (card) {  
		const item = dataBase.find(obj => obj.id === parseInt(card.dataset.id));
		// const item = dataBase.find(obj => obj.id === +card.dataset.id);

		modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
		modalHeaderItem.textContent = item.nameItem;
		modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
		modalDescriptionItem.textContent = item.descriptionItem;
		modalCostItem.textContent = item.costItem;

		modalItem.classList.remove('hide');  //раскрываем модальное окно покупки
		document.addEventListener('keydown', closeModal);   //при открытии добавляем обработчик события нажатия на Esc
	
	}
});

menuContainer.addEventListener('click', event => {
	const target = event.target;

	if (target.tagName === 'A') {
		const result = dataBase.filter(item => item.category === target.dataset.category);

		renderCard(result);
	}
});

// Закрытие модальных окон
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

renderCard();
// 01:03