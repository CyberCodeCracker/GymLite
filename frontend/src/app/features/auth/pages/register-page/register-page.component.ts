import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent implements OnInit {
  redirectPath = '/products';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  passwordConfirm = '';
  errorMessage = '';
  loading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    if (redirect) {
      this.redirectPath = redirect;
    }

    if (this.authService.isAuthenticated()) {
      void this.router.navigateByUrl(this.redirectPath);
    }
  }

  register(): void {
    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService
      .register(this.firstName, this.lastName, this.email, this.password, this.passwordConfirm)
      .subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            void this.router.navigateByUrl(this.redirectPath);
          } else {
            this.errorMessage = 'Registration failed. The email may already be in use.';
          }
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });
  }

  backToLogin(): void {
    void this.router.navigate(['/login'], {
      queryParams: { redirect: this.redirectPath }
    });
  }
}
