function _createModal(options){
    const modal = document.createElement('div')
    modal.insertAdjacentHTML('afterbegin', 
    `<div class="popup popup-modal"> 
        <div class="popup__containers" >
            <button class="popup__close btn"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal__content">
              <div class="modal-header">
                <span class="modal-title">О котике</span>
              </div>
              <div class="modal-body">
              </div>
              <div class="modal-footer">
                <button>Изменить</button>
                <button>Удалить</button>
              </div>
            </div>
        </div>
    </div>
    `)
    document.body.appendChild(modal)
    return modal
};

$.modal = function(options){
    const $modal = _createModal(options)    
    return {
        open() {
            $modal.classList.add('open')
        },
        close() {
            $modal.classList.remove('close')
        },
        change() {},
        delete() {},
        destroy() {}
    }
};

const myModal = $.modal();
