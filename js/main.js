const screenInput = document.querySelector('.screen__input');
const expression = document.querySelector('.screen__expression');
const keypad = document.querySelector('.keypad');

const APPEND = true;
const SCIENTIFIC = 1;
const STANDARD = 0;

let calcType = SCIENTIFIC;
let subexpression = '';
let deleteInput = true;
let waitingForInput = true;
let calculated = true;

function main() {
  fillKeypad();
  addHandlers();
}

function fillKeypad() {
  const filter = (calcType === STANDARD) ? k => k.order[STANDARD] : k => k.display !== false;

  const keys = keyBtns.filter(filter);
  keys.sort((a, b) => a.order[calcType] - b.order[calcType]);
  keys.forEach(key => {
    keypad.appendChild(createButton(key));
  });
}

function createButton(key) {
  const {name, text, classes} = key;
  const btn = document.createElement('button');
  btn.classList.add(...classes);
  btn.textContent = text;
  btn.value = name;
  return btn;
}

function switchType(btn) {
  calcType = btn.checked ? SCIENTIFIC : STANDARD;

  keypad.innerHTML = '';
  let rows, cols;
  [rows, cols] = (calcType === STANDARD) ? [6, 4] : [7, 5];
  document.documentElement.style.setProperty('--keypadRows', rows);
  document.documentElement.style.setProperty('--keypadCols', cols);
  main();
}

function inv() {
  const newKeys = keyBtns.filter(k => k.display == false);
  keyBtns.forEach(key => {
    if(key.display != null) {
      key.display = !key.display;
    }
  });
  newKeys.sort((a, b) => a.order[calcType] - b.order[calcType]);
  newKeys.forEach((key, i) => {
    const btn = createButton(key);
    btn.addEventListener('click', fnClickHandler);
    keypad.replaceChild(btn, keypad.children[i]);
  });
}

function addToInput(txt, append = false) {
  if(append) {
    screenInput.textContent += txt;
  } else {
    screenInput.textContent = txt;
  }
}

function getNewSubexpression(expr) { 
  const input = screenInput.textContent < 0 ? `(${screenInput.textContent})` : screenInput.textContent;
  subexpression = `${subexpression} ${input} ${expr} `;
  return subexpression;
}

function addToExpression(txt, append = false) {
  if(append) {
    expression.textContent += txt;
  } else {
    expression.textContent = txt;
  }
}

function deleteOne() {
  if(screenInput.textContent.length === 1) {
    addToInput('0');
    deleteInput = true;
  } else {
    screenInput.textContent = screenInput.textContent.slice(0, -1);
  }
}

function clearInput() {
  addToInput('0');
  deleteInput = true;
}

function clearAll() {
  calculator.reset();
  addToInput('0');
  addToExpression('');
  subexpression = '';
  waitingForInput = true;
  calculated = true;
  deleteInput = true;
}

function executeUnaryFn(fnName, n) {
  return operate(fnName, [+n]);
}

function executeBinaryFn(fn) {
  calculator.pushNumToStack(screenInput.textContent);
  calculator.pushFnToStack(fn);
}

function executeFn(fnObj) {
  if(fnObj.arity === 2) {
    let expr = fnObj.expr ? fnObj.expr : fnObj.text;
    waitingForInput = true;
    executeBinaryFn(fnObj);
    addToExpression(getNewSubexpression(expr));
    deleteInput = true;
    addToInput('0');
  }
  if(fnObj.arity === 1) {
    const result = executeUnaryFn(fnObj.name, screenInput.textContent);
    addToInput(result);
  }
}

function numClickHandler() {
  if(this.value === '.' && screenInput.textContent.indexOf('.') !== -1) {
    return;
  }
  if(deleteInput || screenInput.textContent === 'ERROR' || 
    screenInput.textContent === '0') {
    addToInput(this.value);
    deleteInput = false;
  } else {
    addToInput(this.value, APPEND);
  }
  if(calculated) {
    subexpression = '';
    addToExpression(screenInput.textContent);
  }
  waitingForInput = false;
}

function constClickHandler() {
  if(calculated) {
    subexpression = '';
  }
  addToInput(calculator.PI);
  waitingForInput = false;
}

function fnClickHandler() {  
  const fnObj = keyBtns.find(fn => fn.name === this.value);
  if(calculated) {
    subexpression = '';
    calculated = false;
  }
  if(waitingForInput === false) {
    executeFn(fnObj);
  }
}

function inputFnHandler() {
  return window[this.value]();
}

function eqClickHandler() {
  if(waitingForInput || calculated) {
    return;
  } 

  calculator.pushNumToStack(screenInput.textContent);
  const result = calculator.evaluate();
  let lastInput = screenInput.textContent;
  if(!isNaN(+lastInput) && lastInput < 0) {
    lastInput = `(${lastInput})`;
  }
  
  addToExpression(`${lastInput} = ${result}`, APPEND);
  addToInput(result);
  calculated = true;
}

function addSwitchBtnHandler() {
  const typeBtn = document.querySelector('#typeSwitch');
  typeBtn.checked = true;
  typeBtn.addEventListener('change', () => switchType(typeBtn));
}


function addKeyHandlers() {
  document.addEventListener('keyup', (e) => {
    const obj = keyBtns.find(key => key.keyCode === e.key);
    if(!obj) return;
    const btn = [...keypad.children].find(key => key.value === obj.name);
    btn.click(); 
  });
}


function addHandlers() {
  const nums = keypad.querySelectorAll('.num');
  const fns = keypad.querySelectorAll('.fn');
  const inputFns = keypad.querySelectorAll('.input-fn');
  const constants = keypad.querySelectorAll('.const');
  const eq = keypad.querySelector('.eq');

  nums.forEach(num => num.addEventListener('click', numClickHandler));
  fns.forEach(fn => fn.addEventListener('click', fnClickHandler));
  inputFns.forEach(fn => fn.addEventListener('click', inputFnHandler));
  constants.forEach(num => num.addEventListener('click', constClickHandler));
  eq.addEventListener('click', eqClickHandler);
}

const keyBtns = [
  {name: '0', text: '0', classes: ['cell', 'num'], order: [22, 33], keyCode: '0'},
  {name: '1', text: '1', classes: ['cell', 'num'], order: [17, 27], keyCode: '1'},
  {name: '2', text: '2', classes: ['cell', 'num'], order: [18, 28], keyCode: '2'},
  {name: '3', text: '3', classes: ['cell', 'num'], order: [19, 29], keyCode: '3'},
  {name: '4', text: '4', classes: ['cell', 'num'], order: [13, 22], keyCode: '4'},
  {name: '5', text: '5', classes: ['cell', 'num'], order: [14, 23], keyCode: '5'},
  {name: '6', text: '6', classes: ['cell', 'num'], order: [15, 24], keyCode: '6'},
  {name: '7', text: '7', classes: ['cell', 'num'], order: [9, 17], keyCode: '7'},
  {name: '8', text: '8', classes: ['cell', 'num'], order: [10, 18], keyCode: '8'},
  {name: '9', text: '9', classes: ['cell', 'num'], order: [11, 19], keyCode: '9'},
  {name: '.', text: '.', classes: ['cell', 'num'], order: [23, 34], keyCode: '.'},
  {name: 'negate', text: '±', classes: ['cell', 'fn'], order: [21, 32], arity: 1},
  {name: 'deleteOne', text: '⌫', classes: ['cell', 'cell--sec', 'input-fn'], order: [7, 14], keyCode: 'Backspace'},
  {name: 'clearAll', text: 'C', classes: ['cell', 'cell--sec', 'input-fn'], order: [6, 13], keyCode: 'Delete'},
  {name: 'clearInput', text: 'CE', classes: ['cell', 'cell--sec', 'input-fn'], order: [5, 12], keyCode: '_'},
  {name: 'add', text: '+', classes: ['cell', 'cell--prime', 'fn'], order: [24, 35], arity: 2, keyCode: '+'},
  {name: 'subtract', text: '-', classes: ['cell', 'cell--prime', 'fn'], order: [20, 30], arity: 2, keyCode: '-'},
  {name: 'multiply', text: '*', classes: ['cell', 'cell--prime', 'fn'], order: [16, 25], arity: 2, keyCode: '*'},
  {name: 'divide', text: '÷', classes: ['cell', 'cell--prime', 'fn'], order: [12, 20], arity: 2, keyCode: '/'},
  {name: 'inv', text: 'INV', classes: ['cell', 'cell--sec', 'input-fn'], order: [, 11]},
  {name: 'PI', text: 'π', classes: ['cell', 'cell--prime', 'const'], order: [, 16]},
  {name: 'truncate', text: '[x]', classes: ['cell', 'cell--prime', 'fn'], order: [, 31], arity: 1},
  {name: 'round', text: '≈', classes: ['cell', 'cell--prime', 'fn'], order: [, 26], arity: 1},
  {name: 'factorial', arity: 1, text: 'n!', expr: 'fact', classes: ['cell', 'cell--prime', 'fn'], order: [, 21]},

  {name: 'equals', text: '=', classes: ['cell', 'cell--sec', 'eq'], order: [8, 15], arity: 1, keyCode: 'Enter'},
  {name: 'square', text: 'x²', expr: 'sqr', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [2, 1], arity: 1},
  {name: 'squareRoot', text: '√', expr: '√', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [1, 6], arity: 1},
  {name: 'mod', text: 'mod', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [, 10], arity: 2},
  {name: 'power', text: 'xʸ', expr: '^', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [, 2], arity: 2},
  {name: 'sine', text: 'sin', expr: 'sin', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [, 3], arity: 1},
  {name: 'cosine', text: 'cos', expr: 'cos', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [, 4], arity: 1},
  {name: 'tangent', text: 'tan', expr: 'tan', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [, 5], arity: 1},
  {name: 'pow10', text: '10ˣ', expr: '10^', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [, 7], arity: 1},
  {name: 'log10', text: 'log', expr: 'log', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [, 8], arity: 1},
  {name: 'exp', text: 'Exp', expr: 'exp', classes: ['cell', 'cell--sec', 'fn'], display: true, order: [, 9], arity: 2},

  {name: 'cube', text: 'x³', expr: 'cube', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [, 1], arity: 1},
  {name: 'yroot', text: 'ʸ√x', expr: 'yroot', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [, 2], arity: 2},
  {name: 'arcsine', text: 'sin⁻¹', expr: 'sin⁻¹', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [, 3], arity: 1},
  {name: 'arccosine', text: 'cos⁻¹', expr: 'cos⁻¹', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [, 4], arity: 1},
  {name: 'arctangent', text: 'tan⁻¹', expr: 'tan⁻¹', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [, 5], arity: 1},
  {name: 'reciprocal', text: '1/x', expr: '1/', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [3, 6], arity: 1},
  {name: 'epow', text: 'eˣ', expr: 'e^', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [, 7], arity: 1},
  {name: 'logn', text: 'ln', expr: 'ln', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [, 8], arity: 1},
  {name: 'exp', text: 'Exp', expr: 'exp', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [, 9], arity: 2},
  {name: 'mod', text: 'mod', classes: ['cell', 'cell--sec', 'fn'], display: false, order: [4, 10], arity: 2},
];

main();
addSwitchBtnHandler();
addKeyHandlers();