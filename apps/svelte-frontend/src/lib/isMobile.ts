import debouncer from '$lib/debouncer';

function isMobile() {
  class Viewport {
    #width = $state(0);
    #height = $state(0);

    get width() {
      return this.#width;
    }
    set width(val: number) {
      this.#width = val;
    }

    get height() {
      return this.#height;
    }
    set height(val: number) {
      this.#height = val;
    }

    constructor(width, height) {
      this.#width = width;
      this.#height = height;
    }
  }

}

export default isMobile;