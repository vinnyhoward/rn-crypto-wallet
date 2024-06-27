import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a single word", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });

  it("should not change the case of other letters", () => {
    expect(capitalizeFirstLetter("hELLO")).toBe("HELLO");
  });

  it("should return an empty string if the input is empty", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });

  it("should capitalize the first letter correctly even if the string has leading spaces", () => {
    expect(capitalizeFirstLetter(" hello")).toBe(" hello");
  });

  it("should handle strings that start with non-alphabetic characters", () => {
    expect(capitalizeFirstLetter("123hello")).toBe("123hello");
    expect(capitalizeFirstLetter("!hello")).toBe("!hello");
  });

  it("should correctly capitalize the first letter of an all-uppercase word", () => {
    expect(capitalizeFirstLetter("WORLD")).toBe("WORLD");
  });

  it("should correctly capitalize the first lowercase letter", () => {
    expect(capitalizeFirstLetter("world")).toBe("World");
  });

  it("should only capitalize the first letter of the first word in a multi-word string", () => {
    expect(capitalizeFirstLetter("multi word string")).toBe(
      "Multi word string"
    );
  });

  it("should handle single character strings correctly", () => {
    expect(capitalizeFirstLetter("w")).toBe("W");
    expect(capitalizeFirstLetter("W")).toBe("W");
  });
});
