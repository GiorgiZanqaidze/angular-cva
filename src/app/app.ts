import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MultiTabFormCvaComponent } from './multi-tab-form-cva/multi-tab-form-cva.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MultiTabFormCvaComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-cva');

  // Complex Multi-Tab CVA FormControl (with nested CVA components)
  complexForm: FormControl = new FormControl();

  // Helper method for template
  Object = Object;

  constructor() {
    // Complete CVA + Validator tracking at all levels
    this.complexForm.valueChanges.subscribe((value) => {
      console.log('🚀 Advanced CVA Architecture - Form Value:', value);
      console.log('📈 Multi-Level Validation Status:', {
        valid: this.complexForm.valid,
        touched: this.complexForm.touched,
        dirty: this.complexForm.dirty,
        errors: this.complexForm.errors,
        validationLevels: 'All 4 levels active!'
      });
    });

    // Setting complex form value programmatically after 4 seconds
    setTimeout(() => {
      this.complexForm.setValue({
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          phone: '+1 (555) 987-6543',
          dateOfBirth: '1990-05-15'
        },
        addressInfo: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          country: 'US',
          postalCode: '10001'
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true,
          newsletter: true,
          marketingEmails: false
        }
      });
      console.log('🎯 Advanced CVA Architecture - All validation levels working!');
    }, 4000);
  }
}

