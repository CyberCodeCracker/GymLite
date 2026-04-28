import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent implements OnInit {
  loading = false;
  errorMessage = '';
  successMessage = '';

  selectedCategory = 'all';
  categoryOptions: string[] = ['all'];
  products: Product[] = [];

  private allProducts: Product[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  onCategoryChange(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.applyCategoryFilter();
  }

  addToCart(event: { product: Product; quantity: number }): void {
    this.cartService.addItem(event.product, event.quantity);
    this.successMessage = `${event.quantity} x ${event.product.name} added to cart.`;

    window.setTimeout(() => {
      this.successMessage = '';
    }, 2500);
  }

  private loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (products) => {
          this.allProducts = products;
          const categories = new Set(
            products
              .map((product) => product.categoryName)
              .filter((name): name is string => typeof name === 'string' && name.length > 0)
          );
          this.categoryOptions = ['all', ...Array.from(categories)];
          this.applyCategoryFilter();
        },
        error: () => {
          this.errorMessage = 'Unable to load products right now. Please try again.';
        }
      });
  }

  private applyCategoryFilter(): void {
    if (this.selectedCategory === 'all') {
      this.products = [...this.allProducts];
      return;
    }

    this.products = this.allProducts.filter(
      (product) => product.categoryName === this.selectedCategory
    );
  }
}
