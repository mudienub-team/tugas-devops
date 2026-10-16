import { sayHi, sayHello } from "./greetings";

describe("sayHi", () => {
  it("should return a greeting with the provided name", () => {
    expect(sayHi("there")).toBe("hi there");
  });

  it("should return a greeting without a name when input is empty", () => {
    expect(sayHi("")).toBe("hi");
  });
});

describe("sayHello", () => {
  it("should return a greeting with the provided name", () => {
    expect(sayHello("there")).toBe("hello there");
  });

  it("should return a greeting without a name when input is empty", () => {
    expect(sayHello("")).toBe("hello");
  });
});
