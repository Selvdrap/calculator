const calculator = {
  PI: Math.PI,

  calcUnaryFn: function(fnName, operand) {
    return operate(fnName, [+operand]);
  }
};