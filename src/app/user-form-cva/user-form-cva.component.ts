import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, SelectControlValueAccessor, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form-cva',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form-cva.component.html',
  styleUrl: './user-form-cva.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UserFormCvaComponent,
      multi: true
    }
  ]
})
export class UserFormCvaComponent implements ControlValueAccessor {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      activity: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Data:', this.userForm.value);
      alert('Form submitted successfully!');
    } else {
      alert('Please fill in all required fields!');
    }
  }


  writeValue(value: any): void {
    this.userForm.patchValue(value);
  }

  registerOnChange(fn: any): void {
    this.userForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.userForm.valueChanges.subscribe(fn);
  }
}
