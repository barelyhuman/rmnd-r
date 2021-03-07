const tasker = new Tasks();
const themer = new Themer({ trigger: '#darkModeToggle' });
function main() {
  const shareIcon = feather.icons['share-2'].toSvg({ height: 18, width: 18 });
  const deleteIcon = feather.icons['delete'].toSvg({ height: 18, width: 18 });

  const taskInput = document.getElementById('taskInput');
  const clearTasks = document.getElementById('clearTasks');
  const shareTasks = document.getElementById('shareTasks');
  const todoFilterToggle = document.getElementById('todoFilterToggle');

  let listData = [];

  clearTasks.innerHTML = deleteIcon;
  shareTasks.innerHTML = shareIcon;

  shareTasks.onclick = function () {
    generateShareLink();
  };

  clearTasks.onclick = function () {
    tasker.clearCompleted();
    renderList('taskList', tasker.tasks, tasker);
  };

  todoFilterToggle.onclick = function () {
    const mode = todoFilterToggle.getAttribute('data-mode');
    const markedTasks = tasker.tasks.filter((item) => item.completed);
    const unMarkedTasks = tasker.tasks.filter((item) => !item.completed);
    const allTasks = tasker.tasks.slice();
    switch (parseInt(mode, 10)) {
      case -1: {
        todoFilterToggle.innerText = 'Showing: Completed';
        todoFilterToggle.setAttribute('data-mode', 0);
        renderList('taskList', markedTasks, tasker);
        break;
      }
      case 0: {
        todoFilterToggle.innerText = 'Showing: Pending';
        todoFilterToggle.setAttribute('data-mode', 1);
        renderList('taskList', unMarkedTasks, tasker);
        break;
      }
      case 1: {
        todoFilterToggle.innerText = 'Showing: All';
        todoFilterToggle.setAttribute('data-mode', -1);
        renderList('taskList', allTasks, tasker);
        break;
      }
    }
  };

  if (getTasksFromURL()) {
    listData = tasker.getAll();
  } else {
    let tasksFromStorage = JSON.parse(window.localStorage.getItem('tasks'));
    if (!tasksFromStorage || !tasksFromStorage.length) {
      tasksFromStorage = [];
      window.localStorage.setItem('tasks', JSON.stringify(tasksFromStorage));
    }
    listData = tasker.load(tasksFromStorage);
  }

  renderList('taskList', listData, tasker);
  taskInput.addEventListener('keyup', function (inputEvent) {
    dispatchForCode(inputEvent, [13, 'Enter'], function () {
      tasker.create(inputEvent.target.value);
      renderList('taskList', tasker.tasks, tasker);
      inputEvent.target.value = '';
    });
  });
}

function renderList(listId, data) {
  const checkIcon = feather.icons['check'].toSvg({
    height: 20,
    width: 20,
    'stroke-width': '3px',
  });
  const lists = document.querySelector('#' + listId);
  lists.innerHTML = '';
  data.forEach(function (listItem) {
    const listItemLI = document.createElement('li');
    const iconSpan = document.createElement('span');
    listItemLI.classList.add('list-item');
    if (listItem.completed) {
      listItemLI.classList.add('marked');
      iconSpan.innerHTML = checkIcon;
    }
    listItemLI.innerText = listItem.text;
    listItemLI.append(iconSpan);
    listItemLI.onclick = function () {
      tasker.toggleMarked(listItem.id);
      renderList(listId, tasker.tasks, tasker);
    };
    lists.appendChild(listItemLI);
  });
}

function generateShareLink() {
  window.location.hash = tasker.getAllAsBase64();
  const url = window.location.href;
  setTimeout(() => {
    copyShareLink(url);
    showToast('Shareable link, copied to clipboard');
  }, 200);
}

function copyShareLink(shareUrl) {
  const el = document.createElement('textarea');
  el.value = shareUrl;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

function getTasksFromURL() {
  const params = window.location.hash.replace('#', '');
  if (params.length) {
    const tasksString = params;
    const done = tasker.setTasksFromBase64(tasksString);
    return done;
  }
  return false;
}

function showToast(text) {
  const isDark = document.body.hasAttribute('data-dark-mode');
  Toastify({
    text,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    className: 'toast',
    stopOnFocus: true,
  }).showToast();
}

main();

function dispatchForCode(event, match, callback) {
  var code;

  if (event.key !== undefined) {
    code = event.key;
  } else if (event.keyIdentifier !== undefined) {
    code = event.keyIdentifier;
  } else if (event.keyCode !== undefined) {
    code = event.keyCode;
  }

  if (match.indexOf(code) > -1) {
    callback(code);
  }
}
