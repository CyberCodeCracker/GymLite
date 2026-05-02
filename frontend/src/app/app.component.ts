import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CartWidgetComponent } from './shared/components/cart-widget/cart-widget.component';
import { BreadcrumbsComponent } from './shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent, CartWidgetComponent, BreadcrumbsComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  isAuthPage = false;

  constructor(private router: Router) {
    this.setAuthPage(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.setAuthPage(event.urlAfterRedirects));
  }

  private setAuthPage(url: string): void {
    this.isAuthPage = url.startsWith('/login') || url.startsWith('/register');
  }
}
