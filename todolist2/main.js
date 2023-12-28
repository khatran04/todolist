var editingTodo = null;

        // Load todos from local storage
        document.addEventListener('DOMContentLoaded', function () {
            loadTodos();
        });

        function addTodo() {
            var todoInput = document.getElementById('newTodo');
            var hoursInput = document.getElementById('hours');
            var minutesInput = document.getElementById('minutes');
            var todoList = document.getElementById('todoList');

            if (todoInput.value.trim() === '') {
                alert('Please enter a todo!');
                return;
            }

            var hours = hoursInput.value || 0;
            var minutes = minutesInput.value || 0;

            var li = document.createElement('li');
            li.innerHTML = `
                <span class="todo-text">${todoInput.value}</span>
                <span class="todo-time">${padZero(hours)}:${padZero(minutes)}</span>
            `;

            var actions = document.createElement('div');
            actions.innerHTML = `
                <button onclick="removeTodo(this)"><i class="fas fa-trash"></i></button>
                <button onclick="toggleCompleted(this)"><i class="fas fa-check"></i></button>
                <button onclick="editTodo(this)"><i class="fas fa-edit"></i></button>
            `;

            li.appendChild(actions);
            todoList.appendChild(li);
            todoInput.value = '';
            hoursInput.value = '';
            minutesInput.value = '';

            saveTodos();
        }

        function removeTodo(button) {
            var li = button.parentNode.parentNode;
            var todoList = document.getElementById('todoList');
            todoList.removeChild(li);

            saveTodos();
        }

        function toggleCompleted(button) {
            var li = button.parentNode.parentNode;
            var span = li.querySelector('.todo-text');
            span.classList.toggle('completed');

            saveTodos();
        }

        function editTodo(button) {
            var li = button.parentNode.parentNode;
            var spanText = li.querySelector('.todo-text');
            var spanTime = li.querySelector('.todo-time');
            editingTodo = {
                li: li,
                text: spanText.innerText,
                hours: extractHours(spanTime.innerText),
                minutes: extractMinutes(spanTime.innerText)
            };

            var editTodoText = document.getElementById('editTodoText');
            var editHours = document.getElementById('editHours');
            var editMinutes = document.getElementById('editMinutes');

            editTodoText.value = editingTodo.text;
            editHours.value = editingTodo.hours;
            editMinutes.value = editingTodo.minutes;

            openModal();
        }

        function saveEditedTodo() {
            if (editingTodo) {
                var editTodoText = document.getElementById('editTodoText');
                var editHours = document.getElementById('editHours');
                var editMinutes = document.getElementById('editMinutes');

                editingTodo.li.querySelector('.todo-text').innerText = editTodoText.value;
                editingTodo.li.querySelector('.todo-time').innerText = `${padZero(editHours.value)}:${padZero(editMinutes.value)}`;

                closeModal();
                saveTodos();
            }
        }

        function openModal() {
            var modal = document.getElementById('editModal');
            modal.style.display = 'block';
        }

        function closeModal() {
            var modal = document.getElementById('editModal');
            modal.style.display = 'none';
            editingTodo = null;
        }

        function saveTodos() {
            var todoList = document.getElementById('todoList');
            var todos = [];

            for (var i = 0; i < todoList.children.length; i++) {
                var li = todoList.children[i];
                var todo = {
                    text: li.querySelector('.todo-text').innerText,
                    time: li.querySelector('.todo-time').innerText,
                    completed: li.querySelector('.todo-text').classList.contains('completed')
                };
                todos.push(todo);
            }

            localStorage.setItem('todos', JSON.stringify(todos));
        }

        function loadTodos() {
            var todoList = document.getElementById('todoList');
            var todos = JSON.parse(localStorage.getItem('todos')) || [];

            todos.forEach(function (todo) {
                var li = document.createElement('li');
                li.innerHTML = `
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                    <span class="todo-time">${todo.time}</span>
                `;

                var actions = document.createElement('div');
                actions.innerHTML = `
                    <button onclick="removeTodo(this)"><i class="fas fa-trash"></i></button>
                    <button onclick="toggleCompleted(this)"><i class="fas fa-check"></i></button>
                    <button onclick="editTodo(this)"><i class="fas fa-edit"></i></button>
                `;

                li.appendChild(actions);
                todoList.appendChild(li);
            });
        }

        function padZero(num) {
            return num < 10 ? '0' + num : num;
        }

        function extractHours(time) {
            return parseInt(time.split(':')[0]);
        }

        function extractMinutes(time) {
            return parseInt(time.split(':')[1]);
        }