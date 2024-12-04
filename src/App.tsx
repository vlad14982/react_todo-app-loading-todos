/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isActive] = useState<number>();
  const [filter, setFilter] = useState<Filter>('all');
  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const todosData = await getTodos();

      setTodos(todosData);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  const todosLeft = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            disabled={loading || todosLeft === 0}
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              ref={inputRef}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            return (
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  completed: todo.completed,
                })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => {}}
                    disabled={loading}
                  />
                </label>

                {todo.id === isActive ? (
                  <form>
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={todo.title}
                      onChange={() => {}}
                    />
                  </form>
                ) : (
                  <>
                    <span data-cy="TodoTitle" className="todo__title">
                      {todo.title}
                    </span>

                    {/* Remove button appears only on hover */}
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onChange={() => {}}
                      disabled={loading}
                    >
                      ×
                    </button>
                  </>
                )}

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active': loading,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer
            className={classNames('todoapp__footer', {
              hidden: todos.length === 0,
            })}
            data-cy="Footer"
          >
            <span className="todo-count" data-cy="TodosCounter">
              {todosLeft} item{todosLeft !== 1 ? 's' : ''} left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={loading || !todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
