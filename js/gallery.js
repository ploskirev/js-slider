'use strict';

// Объект с пришедшими данными (адреса картинок, alt text)
let inputImages = {
  IMG_SRC: ['https://images.chesscomfiles.com/uploads/v1/user/15724568.d631aaf3.1200x1200o.24a044fff3a6.jpeg',
    'https://avatars.mds.yandex.net/get-pdb/2496928/f72c1974-6562-47c9-93f1-73b44d61e602/s1200?webp=false',
    'https://avatars.mds.yandex.net/get-pdb/2342895/6f71cd34-dfd4-4994-9536-b16f5941f536/s1200?webp=false',
    'https://avatars.mds.yandex.net/get-pdb/2391763/ead7b063-bb15-42cc-a17d-6da640e6e6fc/s1200?webp=false',
    'https://avatars.mds.yandex.net/get-pdb/2395147/c9ea3781-f3cb-45f6-bcf8-077f9ce9966d/s1200?webp=false'
  ],
  ALT_TEXT: ['Forest lake', 'Autumn mountains', 'Fores', 'Mountains lake', 'Violet tree']
};



// Объект с настройками слайдера. Подразумевается, что он должен лежать в отдельном файле
// И именно в нем пользователь указывает желаемые настройки
let config = {
  wrapper: '#galleryWrapper', //  Здесь необходимо указать селектор обертки для галереи из html страницы
  size: 'L', // Указать 'L', 'M' или 'S'. Устанавливает размер слайдера. 
  isSlideShow: false, // Указать true или false. Включает/Выключает слайдшоу
  slideShowInterval: 2000, //  Интервал смены слайдов, если включено слайдшоу
  isThumbnails: true, // Указать true или false. Включает/Выключает отображение миниатюр под слайдером
  keyControl: true //  Указать true или false. Включает/Выключает переключение слайдов с клавиатуры
};

// Объект, содержащий все свойства и методы галереи
let gallery = {
  images: [],
  imagesAltTexts: [],
  imagesQuantity: 0,
  currentImage: 0,
  mainImage: {
    width: '1200',
    height: '800',
    src: ''
  },
  thumbnails: {
    width: '120',
    height: '80',
  },
  config: {
    size: config.size,
    isSlideShow: config.isSlideShow,
    slideShowInterval: config.slideShowInterval,
    isThumbnails: config.isThumbnails,
    keyControl: config.keyControl
  },

  /**
   *@description метод добавляющий слайдер на страницу
   *
   * @param {object} obj - объект с настройками для галлереи (по-умолчанию config)
   */
  init(obj = config) {
    this.loadImages(inputImages);
    this.getSizes();
    document.querySelector(obj.wrapper).innerHTML = this.createGalleryTemplate();
    if (this.config.isSlideShow) {
      this.startSlideShow();
    }
    if (this.config.isThumbnails) {
      this.setActiveThumbnail(0);
      this.eventListeners.click();
    } else {
      console.log('Запуск слайдшоу принудительно');
      this.startSlideShow();
    }
    if (this.config.keyControl) {
      this.eventListeners.keydown();
    }
  },

  /**
   *@description метод, сохраняет информацию о src картинок в объект галереи (массив images), 
   * alt text (в массив imagesAltText), количество картинок (свойство imagesQuantity) и устанавливающий
   * начальное изображение для слайдера
   * @param {object} sourceObj - объект с исходной информацией (src и alt text картинок)
   */
  loadImages(sourceObj) {
    this.images = sourceObj.IMG_SRC;
    this.imagesAltTexts = sourceObj.ALT_TEXT;
    this.imagesQuantity = sourceObj.IMG_SRC.length;
    this.mainImage.src = this.images[0];
  },

  /**
   *@description метод устанавливает размер выбранной картинки и миниатюр, 
   * в зависимости от выбранных настроек в объекте config
   */
  getSizes() {
    switch (config.size) {
      case 'S':
        this.mainImage.width = 600;
        this.mainImage.height = 400;
        this.thumbnails.width = 60;
        this.thumbnails.height = 40;
        break;
      case 'M':
        this.mainImage.width = 900;
        this.mainImage.height = 600;
        this.thumbnails.width = 90;
        this.thumbnails.height = 60;
        break;
      case 'L':
        this.mainImage.width = 1200;
        this.mainImage.height = 800;
        this.thumbnails.width = 120;
        this.thumbnails.height = 80;
        break;
      default:
        this.mainImage.width = 900;
        this.mainImage.height = 600;
        this.thumbnails.width = 90;
        this.thumbnails.height = 60;
        break;
    }
  },

  /**
   *@description метод создает разметку для блока миниатюр и возвращает ее
   *
   * @returns {object} возвращает строку с разметкой блока миниатюр
   */
  createThumbnailsWrapperTemplate() {
    this.thumbnailsHTML = '';
    this.images.forEach((elem, index) => {
      this.thumbnailsHTML += `<img class="gl-thumbnailImg" src="${elem}" alt="${this.imagesAltTexts[index]}" width="${this.thumbnails.width}" height="${this.thumbnails.height}">`;
    });
    return this.thumbnailsHTML;
  },

  /**
   *@description метод создает и возвращает разметку для нижнего блока, включающего кнопки управления и миниатюры картинок
   * если выбран соответствующий параметр в объекте config
   * @returns {string} возвращает строку с разметкой нижнего блока миниатюр и клавиш управления, 
   * если в config свойство isThumbnails = true. Иначе вернет пустую строку
   */
  createBottomWrapperTemplate() {
    if (this.config.isThumbnails) {
      return `
    <div class="gl-bottomWrapper">
      <div class="gl-prevBtn"></div>
      <div class="gl-thumbnailsWrapper">
      ${this.createThumbnailsWrapperTemplate()}
      </div>
      <div class="gl-nextBtn"></div>
    </div>
    `;
    } else return '';
  },

  /**
   *@description метод создает и возвращает разметку для всей галереи
   * @returns {string} возвращает строку с разметкой для всей галереи
   */
  createGalleryTemplate() {
    return `
      <div class="gl-gallery">
        <div class="gl-mainImg">
          <img src="${this.mainImage.src}" alt="${this.imagesAltTexts[0]}" width="${this.mainImage.width}" height="${this.mainImage.height}">
        </div>
        ${this.createBottomWrapperTemplate()}
      </div>
    `;
  },

  /**
   *@description метод меняет главную картинку в зависимости от значения свойства currentImage
   * @param {number} index - число, которое устанавливается в свойство currentImage
   */
  changeImage(index) {
    this.currentImage = index;
    this.mainImage.src = this.images[this.currentImage].src;
    document.querySelector('.gl-mainImg > img').src = this.images[this.currentImage];
  },

  /**
   *@description метод проверяющий значение свойства currentImage. Оно должно быть не меньше 0 и не больше количества картинок.
   * Если оно выходит из допустимого диапазона, метод устанавливает currentImage в необходимое значение
   */
  checkCurrent() {
    if (this.currentImage < 0) {
      this.currentImage = this.images.length - 1;
    }
    if (this.currentImage >= this.images.length) {
      this.currentImage = 0;
    }
  },

  /**
   *@description метод присваивает класс gl-active выбранной миниатюре
   * @param {number} index - порядковый номер выбранной миниатюры
   */
  setActiveThumbnail(index) {
    let thumbnail = document.querySelectorAll('.gl-thumbnailImg');
    thumbnail.forEach((elem) => {
      elem.classList.remove('gl-active');
    });
    thumbnail[index].classList.add('gl-active');
  },

  /**
   *@description метод запускает слайдшоу
   */
  startSlideShow() {
    setInterval( () => {
      gallery.currentImage++;
      gallery.checkCurrent();
      gallery.changeImage(gallery.currentImage);
      gallery.setActiveThumbnail(gallery.currentImage);
    }, config.slideShowInterval);
  },

  controllers: {

    /**
     *@description - метод используется в обработчике событий для отработки клика по миниатюре или по стрелкам
     */
    clickThumbnail() {
      let thumbnail = document.querySelectorAll('.gl-thumbnailImg');
      let target = event.target;
      if (target.classList.contains('gl-thumbnailImg')) {
        thumbnail.forEach((elem, index) => {
          if (target == elem) {
            gallery.changeImage(index);
          }
        });
      } else if (target.classList.contains('gl-prevBtn')) {
        gallery.currentImage--;
        gallery.checkCurrent();
      } else if (target.classList.contains('gl-nextBtn')) {
        gallery.currentImage++;
        gallery.checkCurrent();
      }
      gallery.changeImage(gallery.currentImage);
      gallery.setActiveThumbnail(gallery.currentImage);
    },

    /**
     *@description метод используется в обработчике событий 
     * для обработки события нажатия стрелки влева или вправо на клавиатуре
     */
    keyDown() {
      if (event.code == "ArrowRight") {
        gallery.currentImage++;
        gallery.checkCurrent();
      } else if (event.code == "ArrowLeft") {
        gallery.currentImage--;
        gallery.checkCurrent();
      }
      gallery.changeImage(gallery.currentImage);
      gallery.setActiveThumbnail(gallery.currentImage);
    }
  },
  eventListeners: {

    /**
     *@description метод устанавливает обработчик события клика по миниатюрам
     */
    click() {
      let bottomWrapper = document.querySelector('.gl-bottomWrapper');
      bottomWrapper.addEventListener('click', gallery.controllers.clickThumbnail);
    },

    /**
     *@description метод устанавливает обработчик события нажатия стрелок на клавиатуре
     */
    keydown() {
      window.addEventListener('keydown', gallery.controllers.keyDown);
    }
  }
};


window.addEventListener('DOMContentLoaded', function() {
  gallery.init(config);
});