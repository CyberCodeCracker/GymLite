import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CartPanelComponent } from './features/cart/components/cart-panel/cart-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CartPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isCartOpen = false;

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }
}
