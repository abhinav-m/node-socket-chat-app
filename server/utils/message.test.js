const expect = require("expect");

const { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage function ", () => {
  it("should generate correct message object", () => {
    const from = "abhinav",
      text = "test message";
    const res = generateMessage(from, text);
    expect(res.from).toBe(from);
    expect(res.text).toBe(text);
    expect(typeof res.createdAt).toBe("number");
  });
});

describe("generateLocationMessage ", () => {
  it("should generate correct location object", () => {
    const from = "abhinav",
      latitude = 30.2,
      longitude = 40.3;

    const res = generateLocationMessage(from, latitude, longitude);
    expect(res.from).toBe(from);
    expect(res.url).toBe(
      `https://www.google.co.in/maps?q=${latitude},${longitude}`
    );
    expect(typeof res.createdAt).toBe("number");
  });
});
