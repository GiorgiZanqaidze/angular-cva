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
import { PersonalInfoCvaComponent, PersonalInfoData } from '../personal-info-cva/personal-info-cva.component';
import { AddressInfoCvaComponent, AddressInfoData } from '../address-info-cva/address-info-cva.component';
import { PreferencesCvaComponent, PreferencesData } from '../preferences-cva/preferences-cva.component';

interface ComplexFormData {
  personalInfo: PersonalInfoData;
  addressInfo: AddressInfoData;
  preferences: PreferencesData;
}

export type ComplexFormDataFn = (value: ComplexFormData) => void;

export type ComplexFormDataTouchedFn = () => void;

@Component({
  selector: 'app-multi-tab-form-cva',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PersonalInfoCvaComponent, AddressInfoCvaComponent, PreferencesCvaComponent],
  templateUrl: './multi-tab-form-cva.component.html',
  styleUrl: './multi-tab-form-cva.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MultiTabFormCvaComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: MultiTabFormCvaComponent,
      multi: true
    }
  ]
})
export class MultiTabFormCvaComponent implements ControlValueAccessor, Validator, OnInit {
  complexForm: FormGroup;
  activeTab: number = 0;

  tabs = [
    { id: 0, title: 'Personal Info', icon: '👤' },
    { id: 1, title: 'Address', icon: '🏠' },
    { id: 2, title: 'Preferences', icon: '⚙️' }
  ];

  // CVA callback functions
  private onChange = (value: ComplexFormData) => {};
  private onTouched = () => {};

  constructor(private fb: FormBuilder) {
    this.complexForm = this.createComplexForm();
  }

  ngOnInit() {
    // Subscribe to form changes and notify parent
    this.complexForm.valueChanges.subscribe(value => {
      const formattedValue: ComplexFormData = value;
      this.onChange(formattedValue);
      console.log('🔥 Complex CVA Form Value Changed (Nested CVAs):', formattedValue);
    });
  }

  private createComplexForm(): FormGroup {
    return this.fb.group({
      personalInfo: [null],  // Will be handled by nested CVA
      addressInfo: [null],   // Will be handled by nested CVA
      preferences: [null]    // Will be handled by nested CVA
    });
  }

  // CVA Implementation
  writeValue(value: ComplexFormData): void {
    console.log('📥 Complex CVA - Value received:', value);
    if (value) {
      this.complexForm.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: ComplexFormDataFn): void {
    console.log('🔗 Complex CVA - registerOnChange called');
    this.onChange = fn;
  }

  registerOnTouched(fn: ComplexFormDataTouchedFn): void {
    console.log('👆 Complex CVA - registerOnTouched called');
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('🔒 Complex CVA - setDisabledState:', isDisabled);
    if (isDisabled) {
      this.complexForm.disable();
    } else {
      this.complexForm.enable();
    }
  }

  // Validator Implementation - bubbles up all nested validation errors
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.complexForm && this.complexForm.invalid) {
      const errors: ValidationErrors = {};

      // Collect errors from all tabs
      const tabNames = ['personalInfo', 'addressInfo', 'preferences'];
      tabNames.forEach(tabName => {
        const tabControl = this.complexForm.get(tabName);
        if (tabControl && tabControl.invalid && tabControl.errors) {
          errors[tabName] = tabControl.errors;
        }
      });

      console.log('🚀 Multi-Tab CVA - Validation errors:', errors);
      return Object.keys(errors).length > 0 ? { multiTabForm: errors } : null;
    }

    console.log('🚀 Multi-Tab CVA - All tabs valid!');
    return null;
  }

  // Tab Navigation with validation
  switchTab(tabIndex: number) {
    // Check if user can switch to this tab (must complete previous tabs)
    if (this.canSwitchToTab(tabIndex)) {
      this.activeTab = tabIndex;
      this.onTouched(); // Mark as touched when user interacts
      console.log('📑 Tab switched to:', this.tabs[tabIndex].title);
    } else {
      console.log('🚫 Cannot switch to tab - previous tabs incomplete');
      alert(`Please complete all previous tabs before accessing "${this.tabs[tabIndex].title}"`);
    }
  }

  // Check if user can switch to a specific tab
  canSwitchToTab(tabIndex: number): boolean {
    // Allow going backwards or to current tab
    if (tabIndex <= this.activeTab) {
      return true;
    }

    // For forward navigation, check if all previous tabs are valid
    for (let i = 0; i < tabIndex; i++) {
      if (!this.isTabValid(i)) {
        return false;
      }
    }

    return true;
  }

  nextTab() {
    if (this.activeTab < this.tabs.length - 1) {
      this.switchTab(this.activeTab + 1);
    }
  }

  previousTab() {
    if (this.activeTab > 0) {
      this.switchTab(this.activeTab - 1);
    }
  }

    // Form Submission
  onSubmit() {
    this.onTouched();

    if (this.complexForm.valid) {
      const formData = this.complexForm.value;
      console.log('✅ Complex Form Submitted Successfully:', formData);
      alert('🎉 Complex form submitted successfully!');
    } else {
      console.log('❌ Complex Form is invalid - Validation errors:', this.complexForm.errors);
      this.markAllFieldsAsTouched();

      // Find first invalid tab and switch to it
      const firstInvalidTab = this.findFirstInvalidTab();
      if (firstInvalidTab !== -1) {
        this.switchTab(firstInvalidTab);
        alert(`❌ Please complete the "${this.tabs[firstInvalidTab].title}" tab before submitting.`);
      } else {
        alert('❌ Please fill in all required fields across all tabs!');
      }
    }
  }

  // Helper method to find first invalid tab
  private findFirstInvalidTab(): number {
    for (let i = 0; i < this.tabs.length; i++) {
      if (!this.isTabValid(i)) {
        return i;
      }
    }
    return -1;
  }

  private markAllFieldsAsTouched() {
    this.complexForm.markAllAsTouched();
  }

  // Helper methods for template
  isTabValid(tabIndex: number): boolean {
    const tabNames = ['personalInfo', 'addressInfo', 'preferences'];
    const tabControl = this.complexForm.get(tabNames[tabIndex]);
    return tabControl ? tabControl.valid : false;
  }

  isTabTouched(tabIndex: number): boolean {
    const tabNames = ['personalInfo', 'addressInfo', 'preferences'];
    const tabControl = this.complexForm.get(tabNames[tabIndex]);
    return tabControl ? tabControl.touched : false;
  }

  // Check if current active tab is valid
  isCurrentTabValid(): boolean {
    return this.isTabValid(this.activeTab);
  }

  // Check if all previous tabs are valid (for navigation validation)
  areAllPreviousTabsValid(): boolean {
    for (let i = 0; i <= this.activeTab; i++) {
      if (!this.isTabValid(i)) {
        return false;
      }
    }
    return true;
  }

  // Check if user can proceed to next tab
  canProceedToNext(): boolean {
    return this.isCurrentTabValid();
  }

  // Check if form can be submitted (all tabs valid)
  canSubmitForm(): boolean {
    return this.complexForm.valid;
  }

  getTabErrors(tabIndex: number): number {
    const tabNames = ['personalInfo', 'addressInfo', 'preferences'];
    const tabControl = this.complexForm.get(tabNames[tabIndex]);

    if (tabControl && tabControl.errors) {
      const sectionErrors = tabControl.errors[tabNames[tabIndex]];
      if (sectionErrors) {
        return Object.keys(sectionErrors).length;
      }
    }

    return 0;
  }

  // Methods to interact with nested CVA components
  onNestedCvaChange(sectionName: string, value: any) {
    this.complexForm.get(sectionName)?.setValue(value);
    this.onTouched();
  }

  onNestedCvaTouched(sectionName: string) {
    this.complexForm.get(sectionName)?.markAsTouched();
    this.onTouched();
  }
}
