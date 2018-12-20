const data = [
  [
    {value: 7, area: 'numbers'},
    {value: 8, area: 'numbers'},
    {value: 9, area: 'numbers'},
    {value: 4, area: 'numbers'},
    {value: 5, area: 'numbers'},
    {value: 6, area: 'numbers'},
    {value: 1, area: 'numbers'},
    {value: 2, area: 'numbers'},
    {value: 3, area: 'numbers'},
    {value: '.', area: 'numbers'},
    {value: 0, area: 'numbers'},
    {value: '⬅', area: 'numbers'}
  ],
  [
    {value: '÷', area: 'operators'},
    {value: '*', area: 'operators'},
    {value: '-', area: 'operators'},
    {value: '+', area: 'operators'},
    {value: '=', area: 'operators'}
  ],
  [
    {value: 'C', area: 'other'},
    {value: '%', area: 'other'},
    {value: 'x<sup>2</sup>', area: 'other'},
    {value: 'x<sup>3</sup>', area: 'other'},
    {value: 'x<sup>y</sup>', area: 'other'},
    {value: '+/-', area: 'other'},
    {value: 'Log', area: 'other'},
    {value: '√', area: 'other'}
  ]
];

function createCells(d, classes) {
  let fragment = document.createDocumentFragment();
  classes = classes.split(' ');
  d.forEach(cell => {
    let el = document.createElement('button');
    el.innerHTML = cell.value;
    el.classList.add(...classes);
    fragment.appendChild(el);
  });

  return fragment;
}

const numbers = document.querySelector('.numbers');
const operators = document.querySelector('.operators');
const other = document.querySelector('.other');
numbers.appendChild(createCells(data[0], 'cell'));
operators.appendChild(createCells(data[1], 'cell cell--operator'));
other.appendChild(createCells(data[2], 'cell cell--other'));
