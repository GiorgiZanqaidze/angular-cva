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

export interface AddressInfoData {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export type AddressInfoDataFn = (value: AddressInfoData) => void;

export type AddressInfoDataTouchedFn = () => void;

@Component({
  selector: 'app-address-info-cva',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './address-info-cva.component.html',
  styleUrl: './address-info-cva.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AddressInfoCvaComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: AddressInfoCvaComponent,
      multi: true
    }
  ]
})
export class AddressInfoCvaComponent implements ControlValueAccessor, Validator, OnInit {
  addressForm: FormGroup;

  countries = [
    { code: '', name: 'Select Country' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'AU', name: 'Australia' }
  ];

  // CVA callback functions
  private onChange = (value: AddressInfoData) => {};
  private onTouched = () => {};

  touched() {
    this.onTouched();
  }

  constructor(private fb: FormBuilder) {
    this.addressForm = this.createAddressForm();
  }

  ngOnInit() {
    // Subscribe to form changes and notify parent
    this.addressForm.valueChanges.subscribe(value => {
      this.onChange(value);
      console.log('🏠 Address Info CVA - Value changed:', value);
    });
  }

  private createAddressForm(): FormGroup {
    return this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]]
    });
  }

  // CVA Implementation
  writeValue(value: AddressInfoData): void {
    console.log('📥 Address Info CVA - Value received:', value);
    if (value) {
      this.addressForm.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: AddressInfoDataFn): void {
    console.log('🔗 Address Info CVA - registerOnChange called');
    this.onChange = fn;
  }

  registerOnTouched(fn: AddressInfoDataTouchedFn): void {
    console.log('👆 Address Info CVA - registerOnTouched called');
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('🔒 Address Info CVA - setDisabledState:', isDisabled);
    if (isDisabled) {
      this.addressForm.disable();
    } else {
      this.addressForm.enable();
    }
  }

  // Validator Implementation - bubbles up validation state to parent
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.addressForm && this.addressForm.invalid) {
      const errors: ValidationErrors = {};

      // Collect all field errors
      Object.keys(this.addressForm.controls).forEach(key => {
        const fieldControl = this.addressForm.get(key);
        if (fieldControl && fieldControl.invalid && fieldControl.errors) {
          errors[key] = fieldControl.errors;
        }
      });

      console.log('🏠 Address Info CVA - Validation errors:', errors);
      return Object.keys(errors).length > 0 ? { addressInfo: errors } : null;
    }

    console.log('🏠 Address Info CVA - Valid!');
    return null;
  }

  // Helper method to mark form as touched
  markAsTouched() {
    this.addressForm.markAllAsTouched();
    this.onTouched();
  }

  // Helper methods for validation
  hasError(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.addressForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    if (errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
    if (errors['pattern']) return 'Please enter a valid postal code (4-6 digits)';

    return 'Invalid input';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      street: 'Street address',
      city: 'City',
      state: 'State/Province',
      country: 'Country',
      postalCode: 'Postal code'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Getter for form validity
  get isValid(): boolean {
    return this.addressForm.valid;
  }

  get isTouched(): boolean {
    return this.addressForm.touched;
  }
}
