const tasker = new Tasks();

function main() {

  const taskInput = document.querySelector('#taskInput');
  const clearTasks = document.querySelector('#clearTasks');
  const shareTasks = document.querySelector('#shareTasks');
  let listData = [];

  shareTasks.onclick = function () {
    generateShareLink();
  }

  clearTasks.onclick = function () {
    tasker.clearCompleted();
    renderList('taskList', tasker.tasks, tasker);
  }


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
  taskInput.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) {
      tasker.create(event.target.value);
      renderList('taskList', tasker.tasks, tasker);
      event.target.value = '';
    }
  })
}

function renderList(listId, data) {
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


function generateShareLink() {
  const url = window.location.href + '#' + CONSTANTS.QUERYSHARE + '=' + tasker.getAllAsBase64();
  copyShareLink(url);
  showToast("Shareable link, copied to clipboard");
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
  const params = window.location.hash.replace('#', '').split('=');
  if (params[0] === CONSTANTS.QUERYSHARE) {
    const tasksString = params[1];
    const done = tasker.setTasksFromBase64(tasksString);
    return done;
  }
  return false;
}

function showToast(text) {
  Toastify({
    text,
    duration: 3000,
    gravity: "top",
    position: 'right',
    backgroundColor: "#131313",
    stopOnFocus: true,
  }).showToast();
}


main();

