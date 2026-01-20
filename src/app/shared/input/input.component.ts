import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="input-wrapper">
      <label *ngIf="label" [for]="inputId" class="block text-sm font-medium text-gray-700 mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>

      <div class="relative">
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          [required]="required"
          [attr.aria-describedby]="error ? errorId : null"
          class="input-field"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />

        <!-- Password toggle for password inputs -->
        <button
          *ngIf="type === 'password' || showPasswordToggle"
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
          (click)="togglePasswordVisibility()"
          [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
        >
          <svg *ngIf="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg *ngIf="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
          </svg>
        </button>
      </div>

      <div *ngIf="error" [id]="errorId" class="mt-1 text-sm text-red-600" role="alert">
        {{ error }}
      </div>

      <p *ngIf="hint && !error" class="mt-1 text-sm text-gray-500">
        {{ hint }}
      </p>
    </div>
  `,
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'tel' = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() showPasswordToggle = false;

  @Output() valueChange = new EventEmitter<string>();

  value = '';
  showPassword = false;
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  errorId = `error-${this.inputId}`;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }
}