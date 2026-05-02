import { Component, OnInit, inject } from '@angular/core';
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
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cart = inject(CartService);
  private toast = inject(ToastService);

  allProducts: Product[] = [];
  categories: Category[] = [];
  search = '';
  selectedCategory = 0;
  sortBy = 'name';
  page = 1;
  pageSize = 12;
  loading = true;
  showSuggestions = false;
  quantities: { [id: number]: number } = {};

  ngOnInit(): void {
    this.productService.findAll().subscribe(p => { this.allProducts = p; this.loading = false; });
    this.categoryService.findAll().subscribe(c => this.categories = c);
  }

  get suggestions(): Product[] {
    if (!this.search || this.search.length < 2) return [];
    const s = this.search.toLowerCase();
    return this.allProducts.filter(p => p.name.toLowerCase().includes(s)).slice(0, 5);
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

  onSearchInput(): void { this.page = 1; this.showSuggestions = this.search.length >= 2; }
  selectSuggestion(name: string): void { this.search = name; this.showSuggestions = false; this.page = 1; }
  hideSuggestions(): void { setTimeout(() => this.showSuggestions = false, 200); }
  onPageChange(p: number): void { this.page = p; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  resetFilters(): void { this.search = ''; this.selectedCategory = 0; this.sortBy = 'name'; this.page = 1; }

  getQty(id: number): number { return this.quantities[id] ?? 1; }
  setQty(id: number, val: number): void { this.quantities[id] = Math.max(1, val); }

  addToCart(p: Product): void {
    const qty = this.getQty(p.id);
    this.cart.add({ productId: p.id, name: p.name, price: p.price, quantity: qty, imageUrl: p.imageUrls?.[0] ?? '' });
    this.toast.success(`${p.name} x${qty} added to cart`);
    this.quantities[p.id] = 1;
  }
}
