import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';

export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

@Component({
  selector: 'app-personal-info-cva',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './personal-info-cva.component.html',
  styleUrl: './personal-info-cva.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PersonalInfoCvaComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PersonalInfoCvaComponent,
      multi: true
    }
  ]
})
export class PersonalInfoCvaComponent implements ControlValueAccessor, Validator, OnInit {
  personalForm: FormGroup;

  // CVA callback functions
  private onChange = (value: PersonalInfoData) => {};
  private onTouched = () => {};

  touched() {
    this.onTouched();
  }

  constructor(private fb: FormBuilder) {
    this.personalForm = this.createPersonalForm();
  }

  ngOnInit() {
    // Subscribe to form changes and notify parent
    this.personalForm.valueChanges.subscribe(value => {
      this.onChange(value);
      console.log('👤 Personal Info CVA - Value changed:', value);
    });
  }

  private createPersonalForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      dateOfBirth: ['', [Validators.required]]
    });
  }

  // CVA Implementation
  writeValue(value: PersonalInfoData): void {
    console.log('📥 Personal Info CVA - Value received:', value);
    if (value) {
      this.personalForm.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    console.log('🔗 Personal Info CVA - registerOnChange called');
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('👆 Personal Info CVA - registerOnTouched called');
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('🔒 Personal Info CVA - setDisabledState:', isDisabled);
    if (isDisabled) {
      this.personalForm.disable();
    } else {
      this.personalForm.enable();
    }
  }

  // Validator Implementation - bubbles up validation state to parent
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.personalForm && this.personalForm.invalid) {
      const errors: ValidationErrors = {};

      // Collect all field errors
      Object.keys(this.personalForm.controls).forEach(key => {
        const fieldControl = this.personalForm.get(key);
        if (fieldControl && fieldControl.invalid && fieldControl.errors) {
          errors[key] = fieldControl.errors;
        }
      });

      console.log('👤 Personal Info CVA - Validation errors:', errors);
      return Object.keys(errors).length > 0 ? { personalInfo: errors } : null;
    }

    console.log('👤 Personal Info CVA - Valid!');
    return null;
  }

  // Helper method to mark form as touched
  markAsTouched() {
    this.personalForm.markAllAsTouched();
    this.onTouched();
  }

  // Helper methods for validation
  hasError(fieldName: string): boolean {
    const field = this.personalForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.personalForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    if (errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
    if (errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['pattern']) return 'Please enter a valid phone number';

    return 'Invalid input';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone number',
      dateOfBirth: 'Date of birth'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Getter for form validity
  get isValid(): boolean {
    return this.personalForm.valid;
  }

  get isTouched(): boolean {
    return this.personalForm.touched;
  }
}
