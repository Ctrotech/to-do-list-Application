document.addEventListener('DOMContentLoaded', function () {
  const userInput = document.querySelector("#inputField");
  const dateInputDisplay = document.querySelector(".dateinput");
  const addTodo = document.querySelector(".entericon-div");
  const allCount = document.querySelector(".allcount .num1");
  const pendingCount = document.querySelector(".pendingcount .num2");
  const completedCount = document.querySelector(".completedcount .num3");
  const clearButton = document.querySelector(".clear");
  const todoListContainer = document.querySelector(".todo-list");
  const filters = document.querySelectorAll(".filters span");
  const taskIndicatorText = document.querySelector("#taskIndicatorText");

  let currentFilter = 'all';
  let todos = [];

    let today = new Date();
    
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let date = String(today.getDate()).padStart(2, '0');
    
    let currentDate = `${year}-${month}-${date}`;
    
        const headingText = document.querySelector("#heading_text");
  const textToType = "To-Do List Application";
  let i = 0;
  const speed = 50;

  function type() {
    if (i < textToType.length) {
      headingText.innerHTML += textToType.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
        
    
    
     
    
    dateInputDisplay.onclick = function (){
        userInput.focus();
    }
    
  addTodo.addEventListener('click', function () {
    if (userInput.value.trim() === '') {
      userInput.placeholder = 'please note sth';
    } else if (dateInputDisplay.value.trim() === '') {
      dateInputDisplay.value = currentDate;
    } else {
      const newTodo = {
        text: userInput.value,
        date: dateInputDisplay.value,
        completed: false,
        bgColor: '#ffffff'
      };
      todos.push(newTodo);
      renderTodos();
      userInput.value = '';
      dateInputDisplay.value = '';
      saveTodos();
    }
  });

  clearButton.onclick = function () {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.classList.remove('hidden');
     const action_message = document.getElementById('action_message');
     action_message.innerHTML = `Clearing...`;
      
    setTimeout(function () {
        todos = [];
        renderTodos();
        saveTodos();
        loadingSpinner.classList.add('hidden');
        action_message.innerHTML = '';
    }, 3000);
}
    
  window.deleteTodoItem = function (index) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.classList.remove('hidden');
    const action_message = document.getElementById('action_message');

    const todoNumber = index + 1;
    action_message.innerHTML = `<p>Deleting to-do-${todoNumber}...</p>`;

    setTimeout(function () {
        todos.splice(index, 1);
        renderTodos();
        saveTodos();
        loadingSpinner.classList.add('hidden');
        action_message.innerHTML = ''; // Clear the message after deletion
    }, 1000);
}
    
  window.editTodoItem = function (index) {
    const todoItem = todos[index];
    const todoTextInput = document.querySelectorAll('.todo-text')[index];
    const todoEditImg = document.querySelectorAll('.edit-action-icon')[index];
    if (todoTextInput.readOnly) {
      todoTextInput.removeAttribute('readonly');
      todoEditImg.src = 'save.png';
      todoTextInput.focus();
    } else {
      todoTextInput.setAttribute('readonly', true);
      todoEditImg.src = 'edit.png';
      todoItem.text = todoTextInput.value;
      saveTodos();
    }
  }

  window.changeBgColor = function (index, color) {
    todos[index].bgColor = color;
    renderTodos();
    saveTodos();
  }

  window.toggleComplete = function (index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
    saveTodos();
  }

  function renderTodos() {
    todoListContainer.innerHTML = '';
    todos.forEach((todo, index) => {
      const todoItem = document.createElement('li');
      todoItem.classList.add('todo-item');
      todoItem.style.backgroundColor = todo.bgColor;
      todoItem.innerHTML = `
        <div class="top-todos-item">
          <div class="top-left-todos-item">
            <div class="todo-date">
              <p class="todo-date-text">${todo.date}</p>
            </div>
          </div>
          <div class="top-right-todos-items">
            <div class="todo-action edit-action" onclick="editTodoItem(${index})">
              <img src="edit.png" alt="Edit" class="edit-action-icon">
            </div>
            <div class="todo-action delete-action" onclick="deleteTodoItem(${index})">
              <img src="trash.png" alt="Delete">
            </div>
            <div class="todo-action bg-change-action">
              <input type="color" id="changeListBg" value="${todo.bgColor}" onchange="changeBgColor(${index}, this.value)">
            </div>
          </div>
        </div>
        <div class="todos-list-bottom"></div>
        <div class="todo-content-section">
          <p>To-do-<span class="todo-number">${index + 1}</span></p>
          <div class="todos-text-div">
            <input type="checkbox" class="custom-checkbox" ${todo.completed ? 'checked' : ''} onclick="toggleComplete(${index})">
            <input type="text" class="todo-text ${todo.completed ? 'completed' : ''}" value="${todo.text}" readonly>
          </div>
        </div>
      `;
      todoItem.querySelector('.todo-text').addEventListener('click', function () {
        toggleComplete(index);
      });
      todoItem.querySelector('.custom-checkbox').addEventListener('click', function () {
        toggleComplete(index);
      });
      todoListContainer.appendChild(todoItem);
    });
    updateCounts();
    filterTodos(currentFilter);
  }

 function updateCounts() {
    const allTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const pendingTodos = allTodos - completedTodos;

    allCount.textContent = allTodos;
    pendingCount.textContent = pendingTodos;
    completedCount.textContent = completedTodos;

    if (allTodos === 0) {
        taskIndicatorText.innerText = 'Task';
        allCount.style.color = '#d50808';
        taskIndicatorText.style.color = '#d50808';
    } else if (allTodos === 1) {
        taskIndicatorText.innerText = 'Task';
        allCount.style.color = '#9000E4';
        taskIndicatorText.style.color = '#9000E4';
    } else {
        taskIndicatorText.innerText = 'Tasks';
        allCount.style.color = '#9000E4';
        taskIndicatorText.style.color = '#9000E4';
    }

    if (pendingTodos > 0) {
        pendingCount.style.color = '#9000E4';
        pendingIndicatorText.style.color = '#9000E4';
    } else {
        pendingCount.style.color = '#d50808';
        pendingIndicatorText.style.color = '#d50808';
    }

    if (completedTodos > 1) {
        completedCount.style.color = '#009034';
        completedIndicatorText.style.color = '#009034';
    } else if (completedTodos > 0) {
        completedCount.style.color = '#9000E4';
        completedIndicatorText.style.color = '#9000E4';
    } else {
        completedCount.style.color = '#d50808';
        completedIndicatorText.style.color = '#d50808';
    }
}
    
    filters.forEach(filter => {
    filter.addEventListener('click', function () {
      filters.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter');
      filterTodos(currentFilter);
    });
  });

  function filterTodos(filter) {
    const todoItems = todoListContainer.querySelectorAll('.todo-item');
    todoItems.forEach((item, index) => {
      const isCompleted = todos[index].completed;
      switch (filter) {
        case 'all':
          item.style.display = 'block';
          break;
        case 'pending':
          item.style.display = isCompleted ? 'none' : 'block';
          break;
        case 'completed':
          item.style.display = isCompleted ? 'block' : 'none';
          break;
      }
    });
  }

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      todos = savedTodos;
      renderTodos();
    }
  }

  loadTodos();
});