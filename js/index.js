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

//кнопка
let randomise = () => {

  $("#hue1").val( Math.floor(Math.random() * 360) );
  $("#sat1").val( Math.floor(Math.random() * 360) );
  $("#hue2").val( Math.floor(Math.random() * 70) + 15 );
  $("#sat2").val( Math.floor(Math.random() * 70) + 15 );
  $("#grad").val( Math.floor(Math.random() * 10) + 20 );
  $("#gradoff").val( Math.floor(Math.random() * 20) + 40 );

  $(".custom").css({
    "--hue":  $("#hue1").val() + "deg",
    "--sat":  $("#sat1").val() + "%",
    "--hue2": $("#hue2").val() + "deg",
    "--sat2": $("#sat2").val() + "%",
    "--gradgap": $("#grad").val() + "%",
    "--gradoffset": $("#gradoff").val() + "%"
  });
}

setTimeout( () => {
  $("input[type=range]").on("change", (e) => {
    $(".custom").css({
      "--hue":  $("#hue1").val() + "deg",
      "--sat":  $("#sat1").val() + "%",
      "--hue2": $("#hue2").val() + "deg",
      "--sat2": $("#sat2").val() + "%",
      "--gradgap": $("#grad").val() + "%",
      "--gradoffset": $("#gradoff").val() + "%"
    });
    $("#app").css({
      "--blur": $("#blur").val() + "px"
    });
  });
}, 1000 );

$(".custom button").on("click", randomise);


function HexToHSL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    s = s*100;
    s = Math.round(s);
    l = l*100;
    l = Math.round(l);
    h = Math.round(360*h);

    return {h, s, l};
}
//modal window

const myModal = $.modal();
