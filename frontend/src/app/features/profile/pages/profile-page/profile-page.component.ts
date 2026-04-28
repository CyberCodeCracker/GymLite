import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { CustomerRequest } from '../../../../core/models/customer.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomerService } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  readonly profileForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    street: [''],
    city: [''],
    houseNumber: [''],
    zipCode: ['']
  });

  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.prefillFromToken();
    this.loadCustomerFromBackend();
  }

  save(): void {
    if (this.profileForm.invalid || this.saving) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getUser();
    if (!user?.id) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.buildCustomerPayload(user.id);

    this.customerService
      .existsById(user.id)
      .pipe(
        switchMap((exists) =>
          exists ? this.customerService.update(payload, 0) : this.customerService.create(payload)
        ),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Profile saved successfully.';
        },
        error: () => {
          this.errorMessage = 'Unable to save your profile right now.';
        }
      });
  }

  private prefillFromToken(): void {
    const user = this.authService.getUser();
    if (!user) {
      return;
    }

    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  }

  private loadCustomerFromBackend(): void {
    const user = this.authService.getUser();
    if (!user?.id) {
      return;
    }

    this.customerService.getById(user.id).subscribe({
        next: (customer) => {
          this.profileForm.patchValue({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            street: customer.address?.street ?? '',
            city: customer.address?.city ?? '',
            houseNumber: customer.address?.houseNumber ?? '',
            zipCode: customer.address?.zipCode ?? ''
          });
        },
        error: () => {
          this.errorMessage = '';
        }
      });
  }

  private buildCustomerPayload(id: string): CustomerRequest {
    const rawValue = this.profileForm.getRawValue();

    return {
      id,
      firstName: rawValue.firstName,
      lastName: rawValue.lastName,
      email: rawValue.email,
      address: {
        street: rawValue.street,
        city: rawValue.city,
        houseNumber: rawValue.houseNumber,
        zipCode: rawValue.zipCode
      }
    };
  }
}
