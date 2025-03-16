const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const dateInput = document.getElementById("date"); // Get date input
const printBtn = document.getElementById("print-pdf"); // Get print button

const currencySymbol = "UGX "; // Set currency to UGX

const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add Transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "" || dateInput.value.trim() === "") {
    alert("Please add text, amount, and date");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: dateInput.value, // Use user-selected date
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = "";
    amount.value = "";
    dateInput.value = ""; // Clear input field
  }
}

// Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add Transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <small>(${transaction.date})</small>
    <span>${sign}${currencySymbol}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Update balance, income, and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense =
    (amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerHTML = `${currencySymbol}${total}`;
  money_plus.innerHTML = `+${currencySymbol}${income}`;
  money_minus.innerHTML = `-${currencySymbol}${expense}`;
}

// Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  Init();
}

// Update Local Storage Transaction
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

Init();

form.addEventListener("submit", addTransaction);

// Print Transactions as PDF
function printPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Expense Transactions", 10, 10);

  let y = 20;
  transactions.forEach((transaction, index) => {
    const sign = transaction.amount < 0 ? "-" : "+";
    doc.text(
      `${index + 1}. ${transaction.text} (${transaction.date}) - ${sign}${currencySymbol}${Math.abs(transaction.amount)}`,
      10,
      y
    );
    y += 10;
  });

  doc.save("transactions.pdf");
}

printBtn.addEventListener("click", printPDF);
