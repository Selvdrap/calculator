const calculator = {
  stack: [], 
  operators: [],
  PI: Math.PI,

  pushToStack: function(input) {
    this.stack.push(input);
  },

  pushNumToStack: function(input) {
    if(input < 0 && this.operators[this.operators.length - 1] === '-') {
      this.pushToStack(Math.abs(+input));
    } else {
      this.pushToStack(+input);
    }
  },

  pushFnToStack: function({name, text}) {
    this.pushToStack({name, text});
    this.operators.push(text);
  },

  reset: function() {
    this.stack = [];
    this.operators = [];
  },

  evaluate: function(_stack = this.stack) {
    let result = [];
    let unready = true;

    // sorts from lowest to heighest
    _operators = this.operators.sort((a, b) => this.checkPrecedence(a) - this.checkPrecedence(b));
    while(unready) {
      _stack.forEach((fn, i) => {
        if(typeof fn === 'object' && fn.text === _operators[_operators.length - 1]) {
          const temp = operate(fn.name, [_stack[i - 1], _stack[i + 1]]);
          _stack.splice(i - 1, 3, temp);
          _operators.pop();
        }
        if(_operators.length === 0) unready = false;
      });
    }

    result = isNaN(+_stack) ? 'ERROR' : +_stack;
    this.reset();
    return result;
  },

  checkPrecedence: function(fn) {
    switch (fn) {
      case '/':
        return 4;
      case '*':
        return 3;
      case '+':
        return 1;
      case '-':
        return 2;        
      default:
        return 10;
    }
  }
};
