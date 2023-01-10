export class Card {
constructor(data, selectorTemplate) {
  this._data = data;
  this._selectorTemplate = selectorTemplate;
}

_getTemplate() {
  return document
    .querySelector(this._selectorTemplate)
    .content.querySelector('.card');
}
getElement() {
  this.element = this._getTemplate().cloneNode(true);
  // console.log(this.element);
  const cardTitle = this.element.querySelector('.card__name');
  const cardImage = this.element.querySelector('.card__image');
  //const cardIgnite = this.element.querySelector('.card__like');
  /*if ((this._data.favourite === false) || (this._data.favorite === false)) { //проверка отсутствия лайка у добавляемого объекта
	  cardIgnite.remove() // удаление огонька при отсутствии лайка (признания господства)
    };
  */
  
  cardTitle.textContent = this._data.name;
  cardImage.src = this._data.image;
  // console.log(cardTitle, cardImage);

  return this.element;
}
}
// const card = new Card(cats[0]);
// console.log(card);

// const template = document.querySelector('#card-template').content.querySelector('.card');
// console.log(template);

// console.log(card.getElement() === card.getElement());
