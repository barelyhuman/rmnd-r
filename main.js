function main() {
  const tasker = new Tasks();
  const taskInput = document.querySelector('#taskInput');

  const clearTasks = document.querySelector('#clearTasks');

  clearTasks.onclick = function () {
    tasker.clearCompleted();
    renderList('taskList', tasker.tasks, tasker);
  }

  let tasksFromStorage = window.localStorage.getItem('tasks');
  if (!tasksFromStorage) {
    tasksFromStorage = [];
    window.localStorage.setItem('tasks', JSON.stringify(tasksFromStorage));
  }

  const listData = tasker.load(tasksFromStorage);
  renderList('taskList', listData, tasker);
  taskInput.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) {
      tasker.create(event.target.value);
      renderList('taskList', tasker.tasks, tasker);
      event.target.value = '';
    }
  })

}

function renderList(listId, data, tasker) {
  const lists = document.querySelector("#" + listId);
  lists.innerHTML = '';
  data.forEach(function (listItem) {
    const listItemLI = document.createElement('li');
    listItemLI.classList.add('list-item');
    if (listItem.completed) {
      listItemLI.classList.add('marked');
    }
    listItemLI.innerText = listItem.text;
    listItemLI.onclick = function () {
      tasker.toggleMarked(listItem.id);
      renderList(listId, tasker.tasks, tasker);
    }
    lists.appendChild(listItemLI);
  });
}

function Tasks() {
  this.tasks = [];
}

Tasks.prototype.load = function (tasks) {
  this.tasks = JSON.parse(tasks);
  if (typeof this.tasks == 'string' || !tasks) {
    this.tasks = [];
  }
  return this.tasks;
}

Tasks.prototype.clearCompleted = function () {
  this.tasks = this.tasks.filter(function (item) {
    return !item.completed
  })

  this.tasks = this.tasks.map(function (item, index) {
    item.id = index;
    return item;
  })

  window.localStorage.setItem('tasks', JSON.stringify(this.tasks));
}

Tasks.prototype.create = function (taskText) {
  if (!taskText) {
    return;
  }
  const id = this.tasks.length;
  this.tasks.push({
    id: id,
    text: taskText,
    completed: false
  });
  window.localStorage.setItem('tasks', JSON.stringify(this.tasks));
}

Tasks.prototype.toggleMarked = function (taskId) {
  this.tasks = this.tasks.map(function (item) {
    if (item.id === taskId) {
      item.completed = !item.completed;
    }
    return item;
  });

  window.localStorage.setItem('tasks', JSON.stringify(this.tasks));
}


Tasks.prototype.delete = function (taskId) {
  this.tasks = this.tasks.filter(function (item) {
    if (item.id !== taskId) {
      return true;
    }
    return false;
  });
  window.localStorage.setItem('tasks', JSON.stringify(this.tasks));
}


main();

