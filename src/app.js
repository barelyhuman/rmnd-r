import React from "react";
import { render } from "react-dom";

import { Container, Input, Panel } from "./modules/";

class App extends React.Component {
  //App State
  state = {
    todos: [],
    todoText: ""
  };

  //Lifecycle Handlers
  componentWillMount() {
    var a = localStorage.getItem("todos");
    if (a) {
      const rawTodoList = JSON.parse(a);
      const {marked,unmarked} = markedAndUnmarked(rawTodoList);
      this.setState({
        todos: [...unmarked,...marked]
      });
    }
  }

  //Event Handlers
  onInputChage = e => {
    const val = e.target.value;
    this.setState({
      todoText: val
    });
  };

  addToList = e => {
    if (e.key === "Enter") {
      if (!this.state.todoText) {
        alert("Empty Task Field");
        return;
      }
      const a = this.state.todos;
      a.push({
        id: this.state.todos.length,
        value: this.state.todoText,
        marked: false
      });
      this.setState({
        todos: a,
        todoText: ""
      });

      localStorage.setItem("todos", JSON.stringify(a));
    }
  };

  //Additional Functions
  removeTodo = id => {
    var a = this.state.todos;
    a.splice(id, 1);
    this.setState({
      todos: a
    });
    localStorage.setItem("todos", JSON.stringify(a));
  };

  markTodo = id => {
    var a = this.state.todos.slice();
    a[id].marked = true;
    const {marked,unmarked} = markedAndUnmarked(a);
    const newTodos = [...unmarked, ...marked];
    this.setState({
      todos: newTodos
    });
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  unmarkTodo = id => {
    var a = this.state.todos;
    a[id].marked = false;
    this.setState({
      todos: a
    });
    localStorage.setItem("todos", JSON.stringify(a));
  };

  moveTodoUp = id => {
    const todos = [...this.state.todos];
    const currTodo = todos[id];
    const toMoveTodo = todos[id - 1];
    todos[id - 1] = currTodo;
    todos[id] = toMoveTodo;
    console.log(todos);
    this.setState({ todos });
  };

  moveTodoDown = id => {};

  //Render Method
  render() {
    return (
      <div id="app">
        <Container>
          <Input
            elid="todo-text"
            onChange={this.onInputChage}
            keyPress={this.addToList}
            value={this.state.todoText}
            placeholder="Enter a task... "
          />
          <Panel
            dataList={this.state.todos}
            unMark={this.unmarkTodo}
            mark={this.markTodo}
            changePosition={{ up: this.moveTodoUp, down: this.moveTodoDown }}
            remove={this.removeTodo}
          />
        </Container>
      </div>
    );
  }
}


function markedAndUnmarked(list){
  const marked = list.filter((item)=>item.marked);
  const unmarked = list.filter((item)=>!item.marked);
  return {
    marked,unmarked
  }

}

render(<App />, document.getElementById("root"));
