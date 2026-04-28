import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();

  quantity = 1;

  decreaseQuantity(): void {
    if (this.quantity <= 1) {
      return;
    }

    this.quantity -= 1;
  }

  increaseQuantity(): void {
    this.quantity += 1;
  }

  add(): void {
    this.addToCart.emit({ product: this.product, quantity: this.quantity });
    this.quantity = 1;
  }
}
