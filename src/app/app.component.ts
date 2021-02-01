import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskModalComponent } from './components/modals/add-task-modal/add-task-modal.component';
import { TaskService } from './services/task-service.service';
import { TASK_TYPES, Task } from './shared/task-types';

enum APP_STATES {
  initial,
  readyToAdd,
  filling,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  TASK_TYPES = TASK_TYPES;
  APP_STATES = APP_STATES;
  appState = APP_STATES.initial;
  date = new FormControl();

  dateClass: MatCalendarCellClassFunction<Date> = (date, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      for (const task of this.taskService.tasks) {
        if (task.date === date.toISOString()) {
          return 'has-task';
        }
      }
    }

    return '';
  }

  constructor(
    private dateAdapter: DateAdapter<any>,
    private dialog: MatDialog,
    public taskService: TaskService
  ) {
    this.dateAdapter.setLocale('ru');
  }

  ngAfterViewInit() {
  }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskModalComponent, {
      data: { date: this.date.value.toISOString() },
      width: '400px'
    });
  }

  editTask(task: Task) {
    const dialogRef = this.dialog.open(AddTaskModalComponent, {
      data: { task: task },
      width: '400px'
    });
  }

  removeTask(task: Task) {
    //TODO удаление по taskID
    this.taskService.removeTask(0);
  }

  setAppState(state: APP_STATES) {
    this.appState = state;
  }

  onDateInput() {
    this.appState = this.date.value ? APP_STATES.readyToAdd : APP_STATES.initial;
    this.taskService.date = this.date.value;
    this.taskService.filterTasks();
  }
}
