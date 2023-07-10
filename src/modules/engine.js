
class Engine {
  constructor({ canvas: canvasEl, container, init, update, draw } = {}) {
    const canvas = canvasEl ?? this.createCanvas(container);
    this.init = init ?? this._init;
    this.update = update ?? this._update;
    this.draw = draw ?? this._draw;
    try {
      this.init(canvas).then(initialState => {
        this.tick({
          ...initialState,
          canvas,
          ctx: canvas.getContext('2d')
        });
      });
    } catch(error) {
      console.log(error);
    }
  }

  async _init(canvas) {
    return state;
  }

  async _update(state = {}) {
    return state;
  }

  _draw(state = {}) {}

  async tick(currentState) {
    try {
      const newState = await this.update(currentState);
      this.draw(newState);
      requestAnimationFrame(() => this.tick(newState));
    } catch (error) {
      console.log(error);
    }
  }

  createCanvas(container = document.body) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return canvas;
  }
}

export default Engine;
