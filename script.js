let display = document.getElementById('display');
let currentValue = '0';
let previousValue = null;
let operator = null;
let waitingForNextValue = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function inputDigit(digit) {
  if (waitingForNextValue) {
    currentValue = digit;
    waitingForNextValue = false;
  } else {
    currentValue = currentValue === '0' ? digit : currentValue + digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (waitingForNextValue) {
    currentValue = '0.';
    waitingForNextValue = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(currentValue);

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator) {
    const result = calculate(previousValue, inputValue, operator);
    currentValue = String(result);
    previousValue = result;
  }

  waitingForNextValue = true;
  operator = nextOperator;
}

function calculate(first, second, op) {
  switch (op) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? 'Error' : first / second;
    default:
      return second;
  }
}

function clearCalculator() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  waitingForNextValue = false;
  updateDisplay();
}

function deleteLastCharacter() {
  if (waitingForNextValue) {
    return;
  }

  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
  updateDisplay();
}

function evaluate() {
  if (!operator || previousValue === null) {
    return;
  }

  const inputValue = Number(currentValue);
  currentValue = String(calculate(previousValue, inputValue, operator));
  previousValue = null;
  operator = null;
  waitingForNextValue = false;
  updateDisplay();
}

function handleButtonClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const { value, action } = button.dataset;

  if (value !== undefined) {
    if (['+', '-', '*', '/'].includes(value)) {
      handleOperator(value);
      return;
    }

    if (value === '.') {
      inputDecimal();
      return;
    }

    inputDigit(value);
    return;
  }

  if (action === 'clear') {
    clearCalculator();
  } else if (action === 'delete') {
    deleteLastCharacter();
  } else if (action === 'calculate') {
    evaluate();
  }
}

document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) {
    inputDigit(event.key);
    return;
  }

  if (event.key === '.') {
    inputDecimal();
    return;
  }

  if (['+', '-', '*', '/'].includes(event.key)) {
    handleOperator(event.key);
    return;
  }

  if (event.key === 'Enter' || event.key === '=') {
    evaluate();
    return;
  }

  if (event.key === 'Backspace') {
    deleteLastCharacter();
    return;
  }

  if (event.key.toLowerCase() === 'c') {
    clearCalculator();
  }
});

updateDisplay();
