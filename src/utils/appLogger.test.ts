import { appLogger } from "./appLogger";

describe("appLogger", () => {
  it("ログがconsoleに出力される", () => {
    const logSpy = vi.spyOn(console, "log");

    appLogger("Test Message", "with", "args");

    expect(logSpy).toHaveBeenCalledWith("Test Message", "with", "args");

    logSpy.mockRestore();
  });
});
