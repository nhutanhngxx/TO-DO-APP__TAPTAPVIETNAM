import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import TodoListScreen from "./screens/TodoListScreen";

export default function App() {
  return (
    <Provider store={store}>
      <TodoListScreen />
    </Provider>
  );
}
