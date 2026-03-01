/**
 * SafeLand Backend — Tests unitaires : Validators
 */
const {
  isValidAddress,
  isPositiveInteger,
  isPositiveNumber,
  isNonEmptyString,
  isValidHash,
  isValidActionType,
  isValidVoteType,
  isAddressArray,
  isPositiveIntegerArray,
  isBoolean,
  validateBody,
  validateParamId,
} = require("../src/utils/validators");

// ─── isValidAddress ───────────────────────────────────────
describe("isValidAddress", () => {
  test("accepts valid checksummed address", () => {
    expect(isValidAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toBe(true);
  });
  test("accepts valid lowercase address", () => {
    expect(isValidAddress("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")).toBe(true);
  });
  test("rejects short address", () => {
    expect(isValidAddress("0x123")).toBe(false);
  });
  test("rejects empty string", () => {
    expect(isValidAddress("")).toBe(false);
  });
  test("rejects non-string", () => {
    expect(isValidAddress(123)).toBe(false);
  });
  test("rejects null", () => {
    expect(isValidAddress(null)).toBe(false);
  });
  test("rejects undefined", () => {
    expect(isValidAddress(undefined)).toBe(false);
  });
});

// ─── isPositiveInteger ────────────────────────────────────
describe("isPositiveInteger", () => {
  test("accepts 0", () => {
    expect(isPositiveInteger(0)).toBe(true);
  });
  test("accepts 42", () => {
    expect(isPositiveInteger(42)).toBe(true);
  });
  test("accepts string '5'", () => {
    expect(isPositiveInteger("5")).toBe(true);
  });
  test("rejects negative", () => {
    expect(isPositiveInteger(-1)).toBe(false);
  });
  test("rejects float", () => {
    expect(isPositiveInteger(1.5)).toBe(false);
  });
  test("rejects null", () => {
    expect(isPositiveInteger(null)).toBe(false);
  });
  test("rejects undefined", () => {
    expect(isPositiveInteger(undefined)).toBe(false);
  });
});

// ─── isPositiveNumber ─────────────────────────────────────
describe("isPositiveNumber", () => {
  test("accepts 0.5", () => {
    expect(isPositiveNumber(0.5)).toBe(true);
  });
  test("accepts string '10.5'", () => {
    expect(isPositiveNumber("10.5")).toBe(true);
  });
  test("rejects 0", () => {
    expect(isPositiveNumber(0)).toBe(false);
  });
  test("rejects negative", () => {
    expect(isPositiveNumber(-5)).toBe(false);
  });
  test("rejects NaN", () => {
    expect(isPositiveNumber("abc")).toBe(false);
  });
  test("rejects Infinity", () => {
    expect(isPositiveNumber(Infinity)).toBe(false);
  });
});

// ─── isNonEmptyString ─────────────────────────────────────
describe("isNonEmptyString", () => {
  test("accepts 'hello'", () => {
    expect(isNonEmptyString("hello")).toBe(true);
  });
  test("rejects empty string", () => {
    expect(isNonEmptyString("")).toBe(false);
  });
  test("rejects whitespace only", () => {
    expect(isNonEmptyString("   ")).toBe(false);
  });
  test("rejects non-string", () => {
    expect(isNonEmptyString(123)).toBe(false);
  });
});

// ─── isValidHash ──────────────────────────────────────────
describe("isValidHash", () => {
  test("accepts bytes32 hex", () => {
    expect(isValidHash("0x" + "a".repeat(64))).toBe(true);
  });
  test("accepts IPFS CIDv0", () => {
    expect(isValidHash("QmYwAPJzv5CZsnA625s4Xf1kSU1n5YkL3a4pSBi2RU9"))
      .toBe(true); // simplified test
  });
  test("accepts generic document hash", () => {
    expect(isValidHash("abc123def456")).toBe(true);
  });
  test("rejects empty string", () => {
    expect(isValidHash("")).toBe(false);
  });
  test("rejects too short", () => {
    expect(isValidHash("ab")).toBe(false);
  });
  test("rejects non-string", () => {
    expect(isValidHash(12345)).toBe(false);
  });
});

// ─── isValidActionType ────────────────────────────────────
describe("isValidActionType", () => {
  test("accepts 0 (Freeze)", () => expect(isValidActionType(0)).toBe(true));
  test("accepts 1 (BurnRemint)", () => expect(isValidActionType(1)).toBe(true));
  test("accepts 2 (SocialRecovery)", () => expect(isValidActionType(2)).toBe(true));
  test("rejects 3", () => expect(isValidActionType(3)).toBe(false));
  test("rejects -1", () => expect(isValidActionType(-1)).toBe(false));
});

// ─── isValidVoteType ──────────────────────────────────────
describe("isValidVoteType", () => {
  test("accepts 0 (Sell)", () => expect(isValidVoteType(0)).toBe(true));
  test("accepts 1 (Rent)", () => expect(isValidVoteType(1)).toBe(true));
  test("accepts 2 (Renovate)", () => expect(isValidVoteType(2)).toBe(true));
  test("rejects 3", () => expect(isValidVoteType(3)).toBe(false));
});

// ─── isAddressArray ───────────────────────────────────────
describe("isAddressArray", () => {
  test("accepts valid array", () => {
    expect(
      isAddressArray([
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      ])
    ).toBe(true);
  });
  test("rejects empty array", () => {
    expect(isAddressArray([])).toBe(false);
  });
  test("rejects array with invalid address", () => {
    expect(isAddressArray(["0x123", "0x456"])).toBe(false);
  });
  test("rejects non-array", () => {
    expect(isAddressArray("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toBe(false);
  });
});

// ─── isPositiveIntegerArray ───────────────────────────────
describe("isPositiveIntegerArray", () => {
  test("accepts [12, 12]", () => {
    expect(isPositiveIntegerArray([12, 12])).toBe(true);
  });
  test("rejects empty", () => {
    expect(isPositiveIntegerArray([])).toBe(false);
  });
  test("rejects zeros", () => {
    expect(isPositiveIntegerArray([0, 12])).toBe(false);
  });
  test("rejects negatives", () => {
    expect(isPositiveIntegerArray([-1, 12])).toBe(false);
  });
});

// ─── isBoolean ────────────────────────────────────────────
describe("isBoolean", () => {
  test("accepts true", () => expect(isBoolean(true)).toBe(true));
  test("accepts false", () => expect(isBoolean(false)).toBe(true));
  test("rejects string 'true'", () => expect(isBoolean("true")).toBe(false));
  test("rejects 1", () => expect(isBoolean(1)).toBe(false));
});

// ─── validateBody middleware ──────────────────────────────
describe("validateBody", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("passes valid body", () => {
    const middleware = validateBody([
      { field: "name", validator: isNonEmptyString, message: "name required" },
    ]);
    const req = { body: { name: "test" } };
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("rejects missing required field", () => {
    const middleware = validateBody([
      { field: "name", validator: isNonEmptyString, message: "name required" },
    ]);
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("skips optional field when absent", () => {
    const middleware = validateBody([
      { field: "description", validator: isNonEmptyString, optional: true },
    ]);
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("validates optional field when present", () => {
    const middleware = validateBody([
      { field: "count", validator: isPositiveInteger, optional: true, message: "invalid count" },
    ]);
    const req = { body: { count: -5 } };
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("returns multiple errors", () => {
    const middleware = validateBody([
      { field: "a", validator: isNonEmptyString },
      { field: "b", validator: isPositiveInteger },
    ]);
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ details: expect.any(Array) })
    );
    const details = res.json.mock.calls[0][0].details;
    expect(details).toHaveLength(2);
  });
});

// ─── validateParamId middleware ───────────────────────────
describe("validateParamId", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("passes valid integer param", () => {
    const middleware = validateParamId("tokenId");
    const req = { params: { tokenId: "5" } };
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("rejects non-integer param", () => {
    const middleware = validateParamId("tokenId");
    const req = { params: { tokenId: "abc" } };
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
