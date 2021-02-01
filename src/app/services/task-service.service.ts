import { Injectable } from '@angular/core';
import { Task } from '../shared/task-types';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  date = new Date();
  tasks: Array<Task> = [];
  filteredTasks = this.tasks;
  constructor() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = JSON.parse(localStorage.getItem('arview_tasks') || '[]');
    this.filterTasks();
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.saveTasks();
  }

  removeTask(taskId: number) {

  }

  filterTasks() {
    this.filteredTasks = this.tasks.filter(task => task.date === this.date.toISOString());
  }

  saveTasks() {
    localStorage.setItem('arview_tasks', JSON.stringify(this.tasks));
    this.loadTasks();
  }
}
