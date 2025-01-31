// eslint-disable-next-line no-undef
vi.spyOn(console, "error").mockImplementation(() => {});
// eslint-disable-next-line no-undef
vi.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({}));
