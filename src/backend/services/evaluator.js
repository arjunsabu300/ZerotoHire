import vm from "vm";

/**
 * Runs user code against a single test.
 * userCode: string
 * functionName: string (e.g. "solve")
 * test: { input: string(JSON), expectedOutput: string(JSON) }
 */
export function runSingleTest(userCode, functionName, test) {
  const sandbox = {
    console: {
      log: () => {} // swallow logs
    },
    module: {},
    exports: {}
  };

  const scriptSource =
    `${userCode}\n` +
    `if (typeof ${functionName} !== "function") { throw new Error("Function ${functionName} not defined"); }\n` +
    `module.exports = ${functionName};`;

  const script = new vm.Script(scriptSource);

  const context = vm.createContext(sandbox);

  let fn;
  try {
    fn = script.runInContext(context, { timeout: 1000 });
  } catch (err) {
    return { passed: false, error: `Runtime error: ${err.message}` };
  }

  let args;
  try {
    const parsed = JSON.parse(test.input);
    args = Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    return { passed: false, error: `Invalid test input JSON: ${err.message}` };
  }

  let expected;
  try {
    expected = JSON.parse(test.expectedOutput);
  } catch (err) {
    return { passed: false, error: `Invalid expectedOutput JSON: ${err.message}` };
  }

  let result;
  try {
    result = fn(...args);
  } catch (err) {
    return { passed: false, error: `Error executing function: ${err.message}` };
  }

  const same = JSON.stringify(result) === JSON.stringify(expected);

  return {
    passed: same,
    result,
    expected
  };
}

/**
 * Run all tests and return per-test and aggregate stats
 */
export function runAllTests(userCode, functionName, tests = []) {
  const results = tests.map(test => {
    const r = runSingleTest(userCode, functionName, test);
    return {
      name: test.name,
      visibility: test.visibility,
      passed: r.passed,
      error: r.error,
      result: r.result,
      expected: r.expected
    };
  });

  const total = results.length;
  const passed = results.filter(r => r.passed).length;

  return {
    total,
    passed,
    results
  };
}
