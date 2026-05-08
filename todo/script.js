function addTask() {
    const input = document.getElementById('taskInput');
    const taskValue = input.value;

    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }

    const list = document.getElementById('taskList');
    
    // Create the list item (li)
    const li = document.createElement('li');
    
    // Set the content inside the li
    li.innerHTML = `
        <span>${taskValue}</span>
        <button class="delete-btn" onclick="removeTask(this)">Delete</button>
    `;

    // Add li to the list
    list.appendChild(li);

    // Clear input field for next task
    input.value = "";
}

function removeTask(button) {
    // 'this' refers to the button clicked, parentElement is the 'li'
    const li = button.parentElement;
    li.remove();
}