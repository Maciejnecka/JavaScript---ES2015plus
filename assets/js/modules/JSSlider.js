export default class JSSlider {
  constructor(imagesSelector) {
    this.imagesSelector = imagesSelector;
    this.sliderRootSelector = '.js-slider';
    this.imagesList = document.querySelectorAll(imagesSelector);
    this.sliderRootElement = document.querySelector(this.sliderRootSelector);
    this.autoplayInterval = null;
  }

  startAutoplay = () => {
    if (!this.autoplayInterval) {
      this.autoplayInterval = setInterval(() => {
        this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-next');
      }, 3000);
    }
  };

  stopAutoplay = () => {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  };

  initEvents = () => {
    this.addClickEventToImages();

    const navNext = this.sliderRootElement.querySelector(
      '.js-slider__nav--next'
    );
    if (navNext) {
      navNext.addEventListener('click', (e) => {
        this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-next');
      });

      navNext.addEventListener('mouseenter', () => {
        this.fireCustomEvent(this.sliderRootElement, 'js-slider-stop');
      });
      navNext.addEventListener('mouseleave', () => {
        this.fireCustomEvent(this.sliderRootElement, 'js-slider-start');
      });
    }

    const navPrev = this.sliderRootElement.querySelector(
      '.js-slider__nav--prev'
    );
    if (navPrev) {
      navPrev.addEventListener('click', (e) => {
        this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-prev');
      });
      navPrev.addEventListener('mouseenter', () => {
        this.fireCustomEvent(this.sliderRootElement, 'js-slider-stop');
      });
      navPrev.addEventListener('mouseleave', () => {
        this.fireCustomEvent(this.sliderRootElement, 'js-slider-start');
      });
    }

    const zoom = this.sliderRootElement.querySelector('.js-slider__zoom');
    if (zoom) {
      zoom.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
          this.fireCustomEvent(this.sliderRootElement, 'js-slider-close');
        }
      });
    }
  };

  fireCustomEvent = (element, name) => {
    console.log(element.className, '=>', name);

    const event = new CustomEvent(name, {
      bubbles: true,
    });

    element.dispatchEvent(event);
  };

  initCustomEvents = () => {
    this.imagesList.forEach((img) => {
      img.addEventListener('js-slider-img-click', (event) => {
        this.onImageClick(event, this.sliderRootElement, this.imagesSelector);
      });
    });

    this.sliderRootElement.addEventListener(
      'js-slider-img-next',
      this.onImageNext
    );
    this.sliderRootElement.addEventListener(
      'js-slider-img-prev',
      this.onImagePrev
    );
    this.sliderRootElement.addEventListener('js-slider-close', this.onClose);

    this.sliderRootElement.addEventListener('js-slider-start', () => {
      this.startAutoplay();
    });
    this.sliderRootElement.addEventListener('js-slider-stop', () => {
      this.stopAutoplay();
    });
  };

  onImageClick = (event) => {
    this.sliderRootElement.classList.add('js-slider--active');

    const src = event.currentTarget.querySelector('img').src;
    this.sliderRootElement.querySelector('.js-slider__image').src = src;

    const groupName = event.currentTarget.dataset.sliderGroupName;
    const thumbsList = document.querySelectorAll(
      this.imagesSelector + '[data-slider-group-name=' + groupName + ']'
    );
    const prototype = document.querySelector(
      '.js-slider__thumbs-item--prototype'
    );
    thumbsList.forEach((item) => {
      const thumbElement = prototype.cloneNode(true);
      thumbElement.classList.remove('js-slider__thumbs-item--prototype');
      const thumbImg = thumbElement.querySelector('img');
      thumbImg.src = item.querySelector('img').src;
      if (thumbImg.src === src) {
        thumbImg.classList.add('js-slider__thumbs-image--current');
      }

      document.querySelector('.js-slider__thumbs').appendChild(thumbElement);
    });
    this.startAutoplay();
  };

  onImageNext = () => {
    console.log(this, 'onImageNext');

    const currentClassName = 'js-slider__thumbs-image--current';
    const current = document.querySelector('.' + currentClassName);

    const parentCurrent = current.parentElement;
    const nextElement = parentCurrent.nextElementSibling;
    if (
      nextElement &&
      !nextElement.className.includes('js-slider__thumbs-item--prototype')
    ) {
      const img = nextElement.querySelector('img');
      img.classList.add(currentClassName);

      this.sliderRootElement.querySelector('.js-slider__image').src = img.src;
      current.classList.remove(currentClassName);
    } else {
      const firstThumb = document.querySelector(
        '.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)'
      );
      if (firstThumb) {
        const img = firstThumb.querySelector('img');
        img.classList.add(currentClassName);
        this.sliderRootElement.querySelector('.js-slider__image').src = img.src;
        current.classList.remove(currentClassName);
      }
    }
  };

  onImagePrev = () => {
    console.log(this, 'onImagePrev');

    const currentClassName = 'js-slider__thumbs-image--current';
    const current = document.querySelector('.' + currentClassName);

    const parentCurrent = current.parentElement;
    const prevElement = parentCurrent.previousElementSibling;
    if (
      prevElement &&
      !prevElement.className.includes('js-slider__thumbs-item--prototype')
    ) {
      const img = prevElement.querySelector('img');
      img.classList.add(currentClassName);

      this.sliderRootElement.querySelector('.js-slider__image').src = img.src;
      current.classList.remove(currentClassName);
    } else {
      const thumbs = document.querySelectorAll(
        '.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)'
      );
      const lastThumb = thumbs[thumbs.length - 1];

      if (lastThumb) {
        const img = lastThumb.querySelector('img');
        img.classList.add(currentClassName);
        this.sliderRootElement.querySelector('.js-slider__image').src = img.src;
        current.classList.remove(currentClassName);
      }
    }
  };

  onClose = () => {
    this.sliderRootElement.classList.remove('js-slider--active');
    const thumbsList = document.querySelectorAll(
      '.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)'
    );
    thumbsList.forEach((item) => item.parentElement.removeChild(item));
    this.stopAutoplay();
  };

  run = () => {
    this.initEvents();
    this.initCustomEvents();
  };

  // Functions

  addClickEventToImages = () => {
    this.imagesList.forEach((item) => {
      item.addEventListener('click', (e) => {
        this.fireCustomEvent(e.currentTarget, 'js-slider-img-click');
      });
    });
  };
  // End of functions
}
