import localStorage from "./localStorage.js";

global.localStorage = localStorage;

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
