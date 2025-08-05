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

export interface PreferencesData {
  theme: string;
  language: string;
  notifications: boolean;
  newsletter: boolean;
  marketingEmails: boolean;
}

@Component({
  selector: 'app-preferences-cva',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './preferences-cva.component.html',
  styleUrl: './preferences-cva.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PreferencesCvaComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PreferencesCvaComponent,
      multi: true
    }
  ]
})
export class PreferencesCvaComponent implements ControlValueAccessor, Validator, OnInit {
  preferencesForm: FormGroup;

  themes = [
    { value: 'light', label: '🌞 Light Theme' },
    { value: 'dark', label: '🌙 Dark Theme' },
    { value: 'auto', label: '🔄 Auto (System)' }
  ];

  languages = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'es', label: '🇪🇸 Spanish' },
    { value: 'fr', label: '🇫🇷 French' },
    { value: 'de', label: '🇩🇪 German' },
    { value: 'ja', label: '🇯🇵 Japanese' }
  ];

  communicationOptions = [
    {
      key: 'notifications',
      icon: '🔔',
      title: 'Push Notifications',
      description: 'Receive instant notifications about important updates'
    },
    {
      key: 'newsletter',
      icon: '📰',
      title: 'Newsletter Subscription',
      description: 'Get weekly newsletters with latest updates and tips'
    },
    {
      key: 'marketingEmails',
      icon: '🎯',
      title: 'Marketing Emails',
      description: 'Receive promotional offers and product announcements'
    }
  ];

  // CVA callback functions
  private onChange = (value: PreferencesData) => {};
  private onTouched = () => {};

  constructor(private fb: FormBuilder) {
    this.preferencesForm = this.createPreferencesForm();
  }

  ngOnInit() {
    // Subscribe to form changes and notify parent
    this.preferencesForm.valueChanges.subscribe(value => {
      this.onChange(value);
      console.log('⚙️ Preferences CVA - Value changed:', value);
    });
  }

  private createPreferencesForm(): FormGroup {
    return this.fb.group({
      theme: ['light', [Validators.required]],
      language: ['en', [Validators.required]],
      notifications: [true],
      newsletter: [false],
      marketingEmails: [false]
    });
  }

  // CVA Implementation
  writeValue(value: PreferencesData): void {
    console.log('📥 Preferences CVA - Value received:', value);
    if (value) {
      this.preferencesForm.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    console.log('🔗 Preferences CVA - registerOnChange called');
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('👆 Preferences CVA - registerOnTouched called');
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('🔒 Preferences CVA - setDisabledState:', isDisabled);
    if (isDisabled) {
      this.preferencesForm.disable();
    } else {
      this.preferencesForm.enable();
    }
  }

  // Validator Implementation - bubbles up validation state to parent
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.preferencesForm && this.preferencesForm.invalid) {
      const errors: ValidationErrors = {};

      // Collect all field errors
      Object.keys(this.preferencesForm.controls).forEach(key => {
        const fieldControl = this.preferencesForm.get(key);
        if (fieldControl && fieldControl.invalid && fieldControl.errors) {
          errors[key] = fieldControl.errors;
        }
      });

      console.log('⚙️ Preferences CVA - Validation errors:', errors);
      return Object.keys(errors).length > 0 ? { preferences: errors } : null;
    }

    console.log('⚙️ Preferences CVA - Valid!');
    return null;
  }

  // Helper method to mark form as touched
  markAsTouched() {
    this.preferencesForm.markAllAsTouched();
    this.onTouched();
  }

  // Handle checkbox/select changes with touch
  onFieldChange() {
    this.onTouched();
  }

  // Helper methods for validation
  hasError(fieldName: string): boolean {
    const field = this.preferencesForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.preferencesForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    if (errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;

    return 'Invalid input';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      theme: 'Theme',
      language: 'Language'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Getter for form validity
  get isValid(): boolean {
    return this.preferencesForm.valid;
  }

  get isTouched(): boolean {
    return this.preferencesForm.touched;
  }
}
