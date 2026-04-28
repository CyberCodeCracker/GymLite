import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  redirectPath = '/products';
  email = '';
  password = '';
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

  login(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          void this.router.navigateByUrl(this.redirectPath);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }

  goToRegister(): void {
    void this.router.navigate(['/register'], {
      queryParams: { redirect: this.redirectPath }
    });
  }
}
