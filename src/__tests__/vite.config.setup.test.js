beforeEach(function() {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(function() {
  vi.restoreAllMocks();
});
