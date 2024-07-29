const calculator = {
  displayValue: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  history: [],
}

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit
    calculator.waitingForSecondOperand = false
  } else {
    calculator.displayValue =
      displayValue === "0" ? digit : displayValue + digit
  }
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) return

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator
  const inputValue = parseFloat(displayValue)

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator
    return
  }

  if (firstOperand == null) {
    calculator.firstOperand = inputValue
  } else if (operator) {
    const currentValue = firstOperand || 0
    const result = performCalculation[operator](currentValue, inputValue)

    calculator.displayValue = String(result)
    calculator.firstOperand = result

    // Save to history
    const historyEntry = `${currentValue} ${operator} ${inputValue} = ${result}`
    calculator.history.push(historyEntry)
    updateHistory()
  }

  calculator.waitingForSecondOperand = true
  calculator.operator = nextOperator
}

const performCalculation = {
  "/": (firstOperand, secondOperand) => firstOperand / secondOperand,
  "*": (firstOperand, secondOperand) => firstOperand * secondOperand,
  "+": (firstOperand, secondOperand) => firstOperand + secondOperand,
  "-": (firstOperand, secondOperand) => firstOperand - secondOperand,
  "=": (firstOperand, secondOperand) => secondOperand,
}

function resetCalculator() {
  calculator.displayValue = "0"
  calculator.firstOperand = null
  calculator.waitingForSecondOperand = false
  calculator.operator = null
}

function deleteLastDigit() {
  calculator.displayValue = calculator.displayValue.slice(0, -1) || "0"
}

function updateDisplay() {
  const display = document.querySelector("#calculator-screen")
  display.innerText = calculator.displayValue
}

function updateHistory() {
  const historyList = document.querySelector("#history-list")
  historyList.innerHTML = ""

  calculator.history
    .slice()
    .reverse()
    .forEach((entry) => {
      const li = document.createElement("li")
      li.textContent = entry
      historyList.appendChild(li)
    })
}

updateDisplay()

const keys = document.querySelector(".calculator-keys")
keys.addEventListener("click", (event) => {
  const { target } = event
  const { value } = target
  if (!target.matches("button")) {
    return
  }

  switch (value) {
    case "+":
    case "-":
    case "*":
    case "/":
    case "=":
      handleOperator(value)
      break
    case ".":
      inputDecimal(value)
      break
    case "all-clear":
      resetCalculator()
      break
    case "delete":
      deleteLastDigit()
      break
    default:
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value)
      }
  }

  updateDisplay()
})
