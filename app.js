const passwordEl = document.getElementById("password");
const lengthEl = document.getElementById("length");
const lengthValue = document.getElementById("length-value");
const upperEl = document.getElementById("upper");
const lowerEl = document.getElementById("lower");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy-btn");
const strengthLabel = document.getElementById("strength-label");

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

lengthEl.addEventListener("input", () => {
  lengthValue.textContent = lengthEl.value;
});

function generatePassword() {
  let chars = "";
  if (upperEl.checked) chars += UPPER;
  if (lowerEl.checked) chars += LOWER;
  if (numbersEl.checked) chars += NUMBERS;
  if (symbolsEl.checked) chars += SYMBOLS;

  if (!chars) {
    passwordEl.value = "Select at least one option";
    strengthLabel.textContent = "Strength: —";
    strengthLabel.className = "strength";
    return;
  }

  const length = Number(lengthEl.value);
  let result = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }

  passwordEl.value = result;
  updateStrength(result);
}

function updateStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  strengthLabel.className = "strength";
  if (score <= 3) {
    strengthLabel.textContent = "Strength: Weak";
    strengthLabel.classList.add("weak");
  } else if (score <= 5) {
    strengthLabel.textContent = "Strength: Medium";
    strengthLabel.classList.add("medium");
  } else {
    strengthLabel.textContent = "Strength: Strong";
    strengthLabel.classList.add("strong");
  }
}

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", async () => {
  if (!passwordEl.value || passwordEl.value.startsWith("Select")) return;
  try {
    await navigator.clipboard.writeText(passwordEl.value);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  } catch {
    alert("Could not copy");
  }
});

// Generate one on load
generatePassword();