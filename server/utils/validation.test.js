const expect = require("expect");

const { isRealString } = require("./validation");

describe("isRealString function", () => {
  it("should reject non string values.", () => {
    const str = 242;
    const res = isRealString(str);
    expect(res).toBe(false);
  });
  it("should reject  string values with only spaces", () => {
    const str = "     ";
    const res = isRealString(str);
    expect(res).toBe(false);
  });

  it("should allow  string values with non  space characters", () => {
    const str = "   sfs  ";
    const res = isRealString(str);
    expect(res).toBe(true);
  });
});
