type Todo = { id: string; [key: string]: unknown };
let todos: Todo[] = [];

export const getTodos = () => todos;
export const createTodo = (todo: Todo) => {
  todos.push(todo);
  return todo;
};
export const updateTodo = (id: string, updates: Partial<Todo>) => {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx !== -1) {
    todos[idx] = { ...todos[idx], ...updates };
    return todos[idx];
  }
  return null;
};
export const deleteTodo = (id: string) => {
  const prevLen = todos.length;
  todos = todos.filter((t) => t.id !== id);
  return todos.length < prevLen;
};
