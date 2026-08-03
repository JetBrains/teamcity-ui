// ponytail: jsdom has no ResizeObserver; Ring UI's CollapseContent needs one to exist.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
