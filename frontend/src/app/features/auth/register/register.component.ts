import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  step = 1;
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  passwordConfirm = '';
  showPw = false;
  showPwC = false;
  loading = false;

  constructor(private auth: AuthService, private toast: ToastService, private router: Router) {}

  nextStep(): void { this.step = 2; }
  prevStep(): void { this.step = 1; }

  get step1Valid(): boolean { return !!this.firstName && !!this.lastName && !!this.email; }
  get pwMatch(): boolean { return this.password === this.passwordConfirm; }
  get step2Valid(): boolean { return this.password.length >= 8 && this.pwMatch; }

  register(): void {
    if (!this.pwMatch) { this.toast.error('Passwords do not match'); return; }
    this.loading = true;
    this.auth.register(this.firstName, this.lastName, this.email, this.password, this.passwordConfirm).subscribe(ok => {
      this.loading = false;
      if (ok) { this.toast.success('Account created!'); this.router.navigate(['/products']); }
      else { this.toast.error('Registration failed. Email may already be in use.'); }
    });
  }
}
