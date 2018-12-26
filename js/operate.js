function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
 return a * b;
}

function divide(a, b) {
  return a / b;
}

function square(a) {
  return a * a;
}

function cube(a) {
  return a * a * a;
}

function squareRoot(a) {
  return Math.sqrt(a);
}

function reciprocal(a) {
  return 1 / a;
}

function power(a, b) {
  return Math.pow(a, b);
}

function sine(a) {
  return Math.sin(a);
}

function cosine(a) {
  return Math.cos(a);
}

function tangent(a) {
  return Math.tan(a);
}

function pow10(a) {
  return power(10, a);
}

function log10(a) {
  return Math.log10(a);
}

function exp(a, b) {
  return a * pow10(b);
}

function mod(a, b) {
  return a % b;
}

function factorial(a) {
  if(a < 0) { return 'Invalid Input'; }
  if(a === 0 || a === 1){ return 1; }
  return a * factorial(a - 1);
}

function negate(a) {
  return -a;
}

function cube(a) {
  return Math.pow(a, 3);
}

function yroot(a, b) {
  return Math.pow(b, 1/a);
}

function arcsine(a) {
  return Math.asin(a);
}

function arccosine(a) {
  return Math.acos(a);
}

function arctangent(a) {
  return Math.atan(a);
}

function epow(a) {
  return Math.exp(a);
}

function logn(a) {
  return Math.log(a);
}

const operate = function(fnName, args) {
  return +format(getFunction(fnName)(...args), {precision: 18});
}

function format(result, options) {
  return parseFloat(result).toFixed(options.precision);
}

function getFunction(fnName) {
  return window[fnName];
}
