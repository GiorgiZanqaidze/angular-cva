import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserFormCvaComponent } from './user-form-cva/user-form-cva.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserFormCvaComponent, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-cva');

  userForm: FormControl = new FormControl();

  constructor() {
    this.userForm.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }
}
