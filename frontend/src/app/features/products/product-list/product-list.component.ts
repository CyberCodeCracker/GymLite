import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  categories: Category[] = [];
  search = '';
  selectedCategory = 0;
  sortBy = 'name';
  page = 1;
  pageSize = 12;
  loading = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cart: CartService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.productService.findAll().subscribe((p: Product[]) => { this.allProducts = p; this.loading = false; });
    this.categoryService.findAll().subscribe((c: Category[]) => this.categories = c);
  }

  get filtered(): Product[] {
    let items = this.allProducts;
    if (this.search) {
      const s = this.search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s));
    }
    if (this.selectedCategory) items = items.filter(p => p.categoryId === this.selectedCategory);
    if (this.sortBy === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
    else if (this.sortBy === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
    else items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }

  get paged(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onPageChange(p: number): void { this.page = p; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  resetFilters(): void { this.search = ''; this.selectedCategory = 0; this.sortBy = 'name'; this.page = 1; }

  addToCart(p: Product): void {
    this.cart.add({ productId: p.id, name: p.name, price: p.price, quantity: 1, imageUrl: p.imageUrls?.[0] ?? '' });
    this.toast.success(`${p.name} added to cart`);
  }
}
