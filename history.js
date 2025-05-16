const HISTORY_KEY = 'calculatorHistory';
const MAX_HISTORY_ITEMS = 10;

// Add calculation to history
export function addToHistory(calculation) {
    let history = getHistory();
    
    // Add new item to beginning of array
    history.unshift(calculation);
    
    // Limit history size
    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// Get calculation history
export function getHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

// Clear history
export function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
}