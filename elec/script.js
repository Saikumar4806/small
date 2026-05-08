function calculate() {
    const units = document.getElementById('units').value;
    const ratePerUnit = 0.15; // Set your price here
    const resultDiv = document.getElementById('result');

    if (units > 0) {
        const total = units * ratePerUnit;
        resultDiv.innerText = `Total: $${total.toFixed(2)}`;
        resultDiv.style.color = "black";
    } else {
        resultDiv.innerText = "Please enter valid units";
        resultDiv.style.color = "red";
    }
}