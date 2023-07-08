
class Engine {
  constructor({ canvas: canvasEl, container, init, update, draw } = {}) {
    const canvas = canvasEl ?? this.createCanvas(container);
    this.init = init ?? this._init;
    this.update = update ?? this._update;
    this.draw = draw ?? this._draw;
    this.init(canvas).then(initialState => {
      console.log({initialState});
      this.tick({
        ...initialState,
        canvas,
        ctx: canvas.getContext('2d')
      });
    });
  }

  async _init(canvas) {
    return state;
  }

  async _update(state = {}) {
    return state;
  }

  _draw(state = {}) {}

  async tick(currentState) {
    const newState = await this.update(currentState);
    this.draw(newState);
    requestAnimationFrame(() => this.tick(newState));
  }

  createCanvas(container = document.body) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return canvas;
  }
}

export default Engine;
