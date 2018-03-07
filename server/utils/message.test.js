const expect = require("expect");

const { generateMessage } = require("./message");

describe("generateMessage function should return correct values", () => {
  it("should generate correct message object", () => {
    const from = "abhinav",
      text = "test message";
    const res = generateMessage(from, text);
    expect(res.from).toBe(from);
    expect(res.text).toBe(text);
    expect(typeof res.createdAt).toBe("number");
  });
});
