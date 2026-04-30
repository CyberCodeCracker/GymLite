import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  showPw = false;
  loading = false;
  private redirect: string;

  constructor(private auth: AuthService, private toast: ToastService, private router: Router, route: ActivatedRoute) {
    this.redirect = route.snapshot.queryParamMap.get('redirect') ?? '/products';
    if (auth.isAuthenticated()) router.navigateByUrl(this.redirect);
  }

  login(): void {
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe(ok => {
      this.loading = false;
      if (ok) { this.toast.success('Welcome back!'); this.router.navigateByUrl(this.redirect); }
      else { this.toast.error('Invalid email or password'); }
    });
  }
}
