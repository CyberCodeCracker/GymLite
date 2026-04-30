import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  qty = 1;
  selectedImage = 0;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private productService: ProductService, private cart: CartService, private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.findById(id).subscribe({
      next: (p: Product) => { this.product = p; this.loading = false; },
      error: () => { this.toast.error('Product not found'); this.router.navigate(['/products']); }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    this.cart.add({ productId: this.product.id, name: this.product.name, price: this.product.price, quantity: this.qty, imageUrl: this.product.imageUrls?.[0] ?? '' });
    this.toast.success(`${this.product.name} added to cart`);
  }
}
