// Import history functions
const { addToHistory, getHistory, clearHistory: clearStorageHistory } = (function() {
    const HISTORY_KEY = 'calculatorHistory';
    const MAX_HISTORY_ITEMS = 10;

    return {
        addToHistory: function(calculation) {
            let history = getHistory();
            history.unshift(calculation);
            if (history.length > MAX_HISTORY_ITEMS) {
                history = history.slice(0, MAX_HISTORY_ITEMS);
            }
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        },
        getHistory: function() {
            const history = localStorage.getItem(HISTORY_KEY);
            return history ? JSON.parse(history) : [];
        },
        clearHistory: function() {
            localStorage.removeItem(HISTORY_KEY);
        }
    };
})();

// Calculator state
let currentInput = '0';
let previousInput = '';
let operation = null;
let resetInput = false;

// DOM elements
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const historyItemsContainer = document.getElementById('historyItems');

// Initialize the calculator
function init() {
    updateDisplay();
    loadHistory();
    document.addEventListener('keydown', handleKeyboardInput);
}

// Update main display
function updateDisplay() {
    display.textContent = currentInput;
}

// Update history display
function updateHistoryDisplay() {
    historyDisplay.textContent = previousInput + (operation ? ` ${operation} ` : '');
}

// Append number to current input
function appendNumber(number) {
    if (currentInput === '0' || resetInput) {
        currentInput = number;
        resetInput = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

// Append decimal point
function appendDecimal() {
    if (resetInput) {
        currentInput = '0.';
        resetInput = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Handle operator buttons
function appendOperator(op) {
    if (operation && !resetInput) {
        calculate();
    }
    previousInput = currentInput;
    operation = op;
    resetInput = true;
    updateHistoryDisplay();
}

// Toggle positive/negative
function toggleSign() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

// Backspace function
function backspace() {
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Clear all (AC)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    resetInput = false;
    updateDisplay();
    updateHistoryDisplay();
}

// Perform calculation
function calculate() {
    if (operation === null || resetInput) return;

    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        default:
            return;
    }

    const calculation = {
        expression: `${previousInput} ${operation} ${currentInput}`,
        result: computation.toString()
    };

    addToHistory(calculation);
    loadHistory();

    currentInput = computation.toString();
    operation = null;
    previousInput = '';
    resetInput = true;
    updateDisplay();
    updateHistoryDisplay();
}

// Load history from storage
function loadHistory() {
    const history = getHistory();
    historyItemsContainer.innerHTML = '';

    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.onclick = () => useHistoryItem(item.result);
        
        const expression = document.createElement('div');
        expression.className = 'history-expression';
        expression.textContent = item.expression;
        
        const result = document.createElement('div');
        result.className = 'history-result';
        result.textContent = `= ${item.result}`;
        
        historyItem.appendChild(expression);
        historyItem.appendChild(result);
        historyItemsContainer.appendChild(historyItem);
    });
}

// Use history item
function useHistoryItem(value) {
    currentInput = value;
    resetInput = true;
    updateDisplay();
}

// Clear history
function clearHistory() {
    clearStorageHistory();
    loadHistory();
}

// Handle keyboard input
function handleKeyboardInput(e) {
    e.preventDefault();
    
    if (/[0-9]/.test(e.key)) {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendDecimal();
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearAll();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === '%') {
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
    }
}

// Initialize the calculator when the page loads
window.onload = init;

// Export functions for HTML onclick attributes
window.appendNumber = appendNumber;
window.appendDecimal = appendDecimal;
window.appendOperator = appendOperator;
window.toggleSign = toggleSign;
window.backspace = backspace;
window.clearAll = clearAll;
window.calculate = calculate;
window.clearHistory = clearHistory;
window.useHistoryItem = useHistoryItem;