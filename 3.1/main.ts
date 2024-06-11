import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';

type Task = {
  id: string;
  text: string;
  isDone: boolean;
};

const LOCAL_STORAGE_KEY = 'tasks';

@customElement('tasks-manager')
class TasksManager extends LitElement {
  static styles = css`
    button {
      border: none;
      background-color: #f1f1f1;
      border-radius: 4px;
      cursor: pointer;
      padding: 12px;
    }

    input {
      border: none;
      border-bottom: 2px solid #dedede;
      padding: 12px 0;
      flex-grow: 1;
      outline: none;
    }

    input:focus {
      border-color: #555;
    }

    .task-form {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      column-gap: 16px;
    }

    .tasks-list__item {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: space-between;
      column-gap: 24px;
    }

    .task__text {
      user-select: none;
      cursor: pointer;
      position: relative;
    }

    .task__text::after {
      content: ' ';
      position: absolute;
      top: 50%;
      left: -3%;
      width: 0;
      height: 10px;
      opacity: 80%;
      transform: translateY(-50%);
      transition: all 0.2s;
      background: repeat-x
        url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAKAQMAAAByjsdvAAAABlBMVEUAAADdMzNrjRuKAAAAAXRSTlMAQObYZgAAADdJREFUCNdj+MMABP8ZGCQY/h9g+MHw/AHzDwbGD+w/GBhq6h8wMNj/b2BgkP8HVMMPUsn+gQEAsTkQNRVnI4cAAAAASUVORK5CYII=);
    }

    .task__text--done::after {
      width: 106%;
    }

    .task__remove-btn {
      width: 24px;
      height: 24px;
      padding: 0;
      flex-shrink: 0;
    }
  `;

  @property({
    type: Array,
    state: true,
    hasChanged: newValue => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));

      return true;
    },
  })
  tasks: Task[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '""') || [];

  @state()
  currentTaskId = 0;

  _handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    const data = Object.fromEntries(new FormData(form));

    this.tasks = [
      ...this.tasks,
      {
        id: crypto.randomUUID(),
        text: data['task-name'] as string,
        isDone: false,
      },
    ];

    form.reset();
  }

  _remove_task(id: string) {
    this.tasks = this.tasks.filter(({ id: taskId }) => taskId !== id);
  }

  _toggle_status(id: string) {
    this.tasks = this.tasks.map(task =>
      task.id === id
        ? {
            ...task,
            isDone: !task.isDone,
          }
        : task,
    );
  }

  render() {
    return html`<form class="task-form" @submit=${this._handleSubmit}>
        <input type="text" name="task-name" />
        <button type="submit">Add task</button>
      </form>
      <button @click=${() => (this.tasks = [])}>Reset tasks</button>
      ${this.tasks.length
        ? html`<div class="tasks-list">
            ${this.tasks.map(
              task => html` <div class="tasks-list__item">
                <p
                  class="task__text ${task.isDone ? 'task__text--done' : ''}"
                  @click=${() => this._toggle_status(task.id)}
                >
                  ${task.text}
                </p>
                <button class="task__remove-btn" @click=${() => this._remove_task(task.id)}>
                  ✖
                </button>
              </div>`,
            )}
          </div>`
        : ''}`;
  }
}
