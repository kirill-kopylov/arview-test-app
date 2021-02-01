import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task-service.service';
import { Task, TASK_TYPES } from 'src/app/shared/task-types';

export interface DialogData {
  date?: string;
  task? : Task;
}
@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss']
})
export class AddTaskModalComponent implements OnInit {

  TASK_TYPES = TASK_TYPES;
  taskTypes = [
    { name: 'Праздник', value: TASK_TYPES.holiday },
    { name: 'Мероприятие', value: TASK_TYPES.event },
    { name: 'Пометки / Другое', value: TASK_TYPES.other }
  ]

  taskForm = new FormGroup({
    type: new FormControl('', Validators.required),
    date: new FormControl(this.data.date),
    title: new FormControl('', Validators.required),
    address: new FormControl('', this.requiredInType(TASK_TYPES.event)),
    time: new FormControl('', this.requiredInType(TASK_TYPES.event)),
    cost: new FormControl('', this.requiredInType(TASK_TYPES.holiday)),
    other: new FormControl('', this.requiredInType(TASK_TYPES.other))
  })

  constructor(
    public dialogRef: MatDialogRef<AddTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private taskService: TaskService
  ) {
    if (data.task) {
      //TODO суём данные в форму, чтобы редактировать таску.
    }
  }
  requiredInType(type: TASK_TYPES): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = control.parent?.get('type')?.value !== type || (control.value && control.value.toString().trim() !== "");
      return !valid ? { required: true } : null;
    };
  }
  ngOnInit(): void {
  }
  close(): void {
    this.dialogRef.close();
  }
  save() {
    const rawTask: Task = this.taskForm.getRawValue();
    let newTask: Task = {
      title: rawTask.title,
      type: rawTask.type,
      date: rawTask.date
    };
    switch (rawTask.type) {
      case TASK_TYPES.event:
        newTask.address = rawTask.address;
        newTask.time = rawTask.time;
        break;
      case TASK_TYPES.holiday:
        newTask.cost = rawTask.cost;
        break;
      case TASK_TYPES.other:
        newTask.other = rawTask.other;
        break;
      default:
        break;
    }

    this.taskService.addTask(newTask);
    this.dialogRef.close();
  }
}
