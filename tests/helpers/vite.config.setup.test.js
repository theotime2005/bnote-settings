import localStorage from "./localStorage.js";

Object.defineProperty(global, "localStorage", {
  value: localStorage,
  writable: true,
  configurable: true,
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
