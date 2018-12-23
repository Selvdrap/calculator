const expression = document.querySelector('.screen__expression');
const screenInput = document.querySelector('.screen__input');
const keypad = document.querySelector('.keypad');

const APPEND = true;
const STANDARD = 0;
const SCIENTIFIC = 1;

let deleteInput = true;
let waitingForInput = true;
let subexpression = '';
let calcType = SCIENTIFIC;

function start() {
  fillKeypad();
  addNumKeyListeners();
  addFnListeners();
  addConstListeners();
}

function addSwitchBtnListener() {
  const typeBtn = document.querySelector('#typeSwitch');
  typeBtn.checked = true;
  typeBtn.addEventListener('change', () => switchType(typeBtn));
}

function addNumKeyListeners() {
  const nums = keypad.querySelectorAll('.num');
  nums.forEach(num => num.addEventListener('click', () => {
    if(deleteInput) {
      input('');
      deleteInput = false;
    }

    input((num.value === '.' && screenInput.textContent.indexOf('.') != -1) ? '' : num.value, APPEND);
    waitingForInput = false;
  }));
}

function addFnListeners() {
  const keys = keypad.querySelectorAll('.fn, .calc-fn');
  keys.forEach(k => k.addEventListener('click', () => executeFn(k)));
}

function addConstListeners() {
  const keys = keypad.querySelectorAll('.const');
  keys.forEach(k => {
    k.addEventListener('click', () => {
      input(calculator[k.value]);
    });
  });
}

function createBtn(key) {
  const btn = document.createElement('button');
  btn.classList.add(...key.class);
  btn.textContent = key.text;
  btn.value = key.name;
  return btn;
}

function fillKeypad() {
  const filter = (calcType === STANDARD) ? k => k.order[STANDARD] : k => k.display !== false;

  const keys = data.filter(filter);
  keys.sort((a, b) => a.order[calcType] - b.order[calcType]);
  keys.forEach(key => {
    keypad.appendChild(createBtn(key));
  });
}

function switchType(btn) {
  calcType = btn.checked ? SCIENTIFIC : STANDARD;

  keypad.innerHTML = '';
  let rows, cols;
  [rows, cols] = (calcType === STANDARD) ? [6, 4] : [7, 5];
  document.documentElement.style.setProperty('--keypadRows', rows);
  document.documentElement.style.setProperty('--keypadCols', cols);
  start();
}

function inv() {
  const newKeys = data.filter(k => k.display == false);
  data.forEach(key => {
    if(key.display != null) {
      key.display = !key.display;
    }
  });
  newKeys.sort((a, b) => a.order[calcType] - b.order[calcType]);
  newKeys.forEach((key, i) => {
    const btn = createBtn(key);
    btn.addEventListener('click', () => executeFn(btn));
    keypad.replaceChild(btn, keypad.children[i]);
  });
}


function deleteOne() {
  const test = screenInput.textContent.slice(0, -1);
  if(test) {
    input(test);
  } else {
    clearInput();
  }
}

function clearInput() {
  input('0');
  subexpression = '';
  deleteInput = true;
}

// function clearAll() {
  //   addToExp('');
  //   calculator.reset();
  //   clearInput();
  // }
  
function executeFn(key, ...args) {
  const fnName = key.value;
  if(key.classList.contains('calc-fn')) {
    window[fnName](args);
  } else {
    const fnObj = data.find(f => f.name == fnName);
    if(fnObj.arity == 1) {
      outputUnaryFn(fnObj);
      waitingForInput = false;
    } else {
      // outputNaryFn(fnObj);
    }
  }
}

function outputUnaryFn(fn) {
  if (subexpression) {
    addToExpr('');
  }
  addToExpr(getNewSubexpression(fn.expr), APPEND);
  input(calculator.calcUnaryFn(fn.name, screenInput.textContent));
}

function input(txt, append = false) {
  if(append) {
    screenInput.textContent += txt;
  } else {
    screenInput.textContent = txt;
  }
}

function getNewSubexpression(fnExpr) {
  subexpression = (subexpression) ? `${fnExpr}(${subexpression})` 
    : `${fnExpr}(${+screenInput.textContent})`;
  return subexpression;
}

function addToExpr(txt, append = false) {
  if(append) {
    expression.textContent += txt;
  } else {
    expression.textContent = txt;
  }
}

function getExpr() {
  return expression.textContent;
}
  
const data = [
  {name: '0', text: '0', class: ['cell', 'num'], order: [22, 33]},
  {name: '1', text: '1', class: ['cell', 'num'], order: [17, 27]},
  {name: '2', text: '2', class: ['cell', 'num'], order: [18, 28]},
  {name: '3', text: '3', class: ['cell', 'num'], order: [19, 29]},
  {name: '4', text: '4', class: ['cell', 'num'], order: [13, 22]},
  {name: '5', text: '5', class: ['cell', 'num'], order: [14, 23]},
  {name: '6', text: '6', class: ['cell', 'num'], order: [15, 24]},
  {name: '7', text: '7', class: ['cell', 'num'], order: [9, 17]},
  {name: '8', text: '8', class: ['cell', 'num'], order: [10, 18]},
  {name: '9', text: '9', class: ['cell', 'num'], order: [11, 19]},
  {name: '.', text: '.', class: ['cell', 'num'], order: [23, 34]},
  {name: 'negate', text: '±', class: ['cell', 'fn'], order: [21, 26], arity: 1},
  {name: 'deleteOne', text: '⌫', class: ['cell', 'cell--sec', 'calc-fn'], order: [7, 14]},
  {name: 'clearAll', text: 'C', class: ['cell', 'cell--sec', 'calc-fn'], order: [6, 13]},
  {name: 'clearInput', text: 'CE', class: ['cell', 'cell--sec', 'calc-fn'], order: [5, 12]},
  {name: 'add', text: '+', class: ['cell', 'cell--prime', 'fn'], order: [20, 30], arity: 2},
  {name: 'subtract', text: '-', class: ['cell', 'cell--prime', 'fn'], order: [16, 25], arity: 2},
  {name: 'multiply', text: '*', class: ['cell', 'cell--prime', 'fn'], order: [12, 20], arity: 2},
  {name: 'divide', text: '÷', class: ['cell', 'cell--prime', 'fn'], order: [8, 15], arity: 2},
  {name: 'inv', text: 'INV', class: ['cell', 'cell--sec', 'calc-fn'], order: [, 11]},
  {name: 'PI', text: 'π', class: ['cell', 'cell-prime', 'const'], order: [, 16]},
  {name: 'openParenthesis', text: '(', class: ['cell', 'calc-fn'], order: [, 31]},
  {name: 'closeParenthesis', text: ')', class: ['cell', 'calc-fn'], order: [, 32]},
  {name: 'factorial', arity: 1, text: 'n!', expr: 'fact', class: ['cell', 'fn'], order: [, 21]},

  {name: 'equals', text: '=', class: ['cell', 'cell--prime', 'calc-fn'], order: [24, 35], arity: 1},
  {name: 'square', text: 'x²', expr: 'sqr', class: ['cell', 'cell--sec', 'fn'], display: true, order: [2, 1], arity: 1},
  {name: 'squareRoot', text: '√', expr: '√', class: ['cell', 'cell--sec', 'fn'], display: true, order: [1, 6], arity: 1},
  {name: 'mod', text: 'mod', class: ['cell', 'cell--sec', 'fn'], display: true, order: [, 10], arity: 2},
  {name: 'power', text: 'xʸ', expr: '^', class: ['cell', 'cell--sec', 'fn'], display: true, order: [, 2], arity: 2},
  {name: 'sine', text: 'sin', expr: 'sin', class: ['cell', 'cell--sec', 'fn'], display: true, order: [, 3], arity: 1},
  {name: 'cosine', text: 'cos', expr: 'cos', class: ['cell', 'cell--sec', 'fn'], display: true, order: [, 4], arity: 1},
  {name: 'tangent', text: 'tan', expr: 'tan', class: ['cell', 'cell--sec', 'fn'], display: true, order: [, 5], arity: 1},
  {name: 'pow10', text: '10ˣ', expr: '10^', class: ['cell', 'cell--sec', 'fn'], display: true, order: [, 7], arity: 1},
  {name: 'log10', text: 'log', expr: 'log', class: ['cell', 'cell--sec', 'fn'], display: true, order: [, 8], arity: 1},
  {name: 'exp', text: 'Exp', expr: 'exp', class: ['cell', 'cell--sec', 'fn'], display: true, order: [, 9], arity: 2},

  {name: 'cube', text: 'x³', expr: 'cube', class: ['cell', 'cell--sec', 'fn'], display: false, order: [, 1], arity: 1},
  {name: 'yroot', text: 'ʸ√x', expr: 'yroot', class: ['cell', 'cell--sec', 'fn'], display: false, order: [, 2], arity: 2},
  {name: 'arcsine', text: 'sin⁻¹', expr: 'sin⁻¹', class: ['cell', 'cell--sec', 'fn'], display: false, order: [, 3], arity: 1},
  {name: 'arccosine', text: 'cos⁻¹', expr: 'cos⁻¹', class: ['cell', 'cell--sec', 'fn'], display: false, order: [, 4], arity: 1},
  {name: 'arctangent', text: 'tan⁻¹', expr: 'tan⁻¹', class: ['cell', 'cell--sec', 'fn'], display: false, order: [, 5], arity: 1},
  {name: 'reciprocal', text: '1/x', expr: '1/', class: ['cell', 'cell--sec', 'fn'], display: false, order: [3, 6], arity: 1},
  {name: 'epow', text: 'eˣ', expr: 'e^', class: ['cell', 'cell--sec', 'fn'], display: false, order: [, 7], arity: 1},
  {name: 'logn', text: 'ln', expr: 'ln', class: ['cell', 'cell--sec', 'fn'], display: false, order: [, 8], arity: 1},
  {name: 'exp', text: 'Exp', expr: 'exp', class: ['cell', 'cell--sec', 'fn'], display: false, order: [, 9], arity: 2},
  {name: 'mod', text: 'mod', class: ['cell', 'cell--sec', 'fn'], display: false, order: [4, 10], arity: 2},
];

addSwitchBtnListener();
start();
