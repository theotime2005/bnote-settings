import localStorage from "@/tests/helpers/localStorage.js";

global.localStorage = localStorage;

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
