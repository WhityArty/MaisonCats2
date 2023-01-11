import { setDataRefresh } from './utils.js';
import { api } from './api.js';
import { Card } from './card.js';
import { Popup } from './popup.js';
import {cats} from './cats.js';



const cardsContainer = document.querySelector('.cards');
const btnOpenPopupForm = document.querySelector('#add');
const btnOpenPopupLogin = document.querySelector('#login');

const formCatAdd = document.querySelector('#popup-form-cat');
const formLogin = document.querySelector('#popup-form-login');

const popupAddCat = new Popup('popup-add-cats');
popupAddCat.setEventListener();

const popupLogin = new Popup('popup-login');
popupLogin.setEventListener();

function serializeForm(elements) {
  const formData = {};

  elements.forEach((input) => {
    if (input.type === 'submit') return;

    if (input.type !== 'checkbox') {
      formData[input.name] = input.value;
    }
    if (input.type === 'checkbox') {
      formData[input.name] = input.checked;
    }
  });

  return formData;
}

function createCat(dataCat) {
  const cardInstance = new Card(dataCat, '#card-template');
  const newCardElement = cardInstance.getElement();
  cardsContainer.append(newCardElement);
}

function handleFormAddCat(e) {
  e.preventDefault();
  const elementsFormCat = [...formCatAdd.elements];

  const dataFromForm = serializeForm(elementsFormCat);

  api.addNewCat(dataFromForm).then(() => {
    console.log({ dataFromForm });
    // console.log(elementsFormCat);
    createCat(dataFromForm);
    updateLocalStorage(dataFromForm, { type: 'ADD_CAT' });
  });
  // const oldStorage = JSON.parse(localStorage.getItem('cats'));
  // oldStorage.push(dataFromForm);
  // localStorage.setItem('cats', JSON.stringify(oldStorage));
  popupAddCat.close();
}

function handleFormLogin(e) {
  e.preventDefault();
  const elementsFormCat = [...formLogin.elements];
  const dataFromForm = serializeForm(elementsFormCat);
  // console.log(dataFromForm);
  Cookies.set('email', `email=${dataFromForm.email}`);
  btnOpenPopupLogin.classList.add('visually-hidden');
  popupLogin.close();
}

// document.cookie = 'Luke=IamYourFather2;samesite=strict;expires=60';
// document.cookie = 'email=email@email.com';

// Cookies.set('vasya', 'good');

// Cookies.set('potato', 'interest', { expires: 7 });

// // console.log(document.cookie);
// console.log(Cookies.get('potato'));

const isAuth = Cookies.get('email');

if (!isAuth) {
  popupLogin.open();
  btnOpenPopupLogin.classList.remove('visually-hidden');
}

// localStorage.setItem('Boromur', JSON.stringify({ name: 'Artur', lang: 'ad' }));
// // localStorage.getItem('Boromur');
// console.log(JSON.parse(localStorage.getItem('Boromur')));

// sessionStorage.setItem('name', 'value');
// localStorage.setItem('cats', JSON.stringify(cats));

function checkLocalStorage() {
  console.log('checkLocalStorage');
  const localData = JSON.parse(localStorage.getItem('cats'));
  console.log(localData);
  const getTimeExpires = localStorage.getItem('catsRefresh');

  const isActual = new Date() < new Date(getTimeExpires);

  console.log(new Date(getTimeExpires));

  if (localData && localData.length && isActual) {
    console.log('isActual');
    localData.forEach(function (catData) {
      createCat(catData);
    });
  } else {
    console.log('else');
    api.getAllCats().then((data) => {
      data.forEach(function (catData) {
        createCat(catData);
      });
      updateLocalStorage(data, { type: 'ALL_CATS' });
    });
  }
}

checkLocalStorage();

function updateLocalStorage(data, action) {
  const oldStorage = JSON.parse(localStorage.getItem('cats'));
  // {type: "ADD_CAT"} {type: "ALL_CATS"}  {type: "DELETE_CAT"}
  switch (action.type) {
    case 'ADD_CAT':
      localStorage.setItem('cats', JSON.stringify([...oldStorage, data]));
      return;
    case 'ALL_CATS':
      localStorage.setItem('cats', JSON.stringify(data));
      setDataRefresh(600, 'catsRefresh');
      return;
    case 'DELETE_CAT':
      const newStorage = oldStorage.filter((cat) => cat.id !== data.id);
      localStorage.setItem('cats', JSON.stringify(newStorage));
      return;
    case 'EDIT_CAT':
      const updatedLocalStorage = oldStorage.map((cat) =>
        cat.id === data.id ? data : cat
      );
      localStorage.setItem('cats', JSON.stringify(updatedLocalStorage));
      return;
    default:
      break;
  }
}

btnOpenPopupForm.addEventListener('click', () => {
  popupAddCat.open();
});
btnOpenPopupLogin.addEventListener('click', () => popupLogin.open());

formCatAdd.addEventListener('submit', handleFormAddCat);
formLogin.addEventListener('submit', handleFormLogin);
