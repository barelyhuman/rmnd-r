function Tasks() {
    this.tasks = [];
}

Tasks.prototype.load = function (tasks) {
    this.tasks = tasks;
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

Tasks.prototype.getAll = function () {
    return this.tasks.slice();
}

Tasks.prototype.getAllAsBase64 = function () {
    let objJsonStr = JSON.stringify(this.tasks);
    return btoa(objJsonStr);
}

Tasks.prototype.setTasksFromBase64 = function (base64String) {
    const tasks = JSON.parse(atob(base64String));
    this.tasks = tasks;
    return true;
}