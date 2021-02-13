import importModule from "../src/index";

describe("importModule", () => {
  it("should import module.", async () => {
    const globalDirs = await importModule("global-dirs");
    expect(globalDirs.default).toHaveProperty("npm");
  });
  it("should throw if module can not be found.", async () => {
    await expect(() => importModule("yz", { force: true, prefix: "x" })).rejects.toThrow("Cannot find modules: 'yz', 'xyz'");
  });
});
