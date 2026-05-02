import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, ProductRequest } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  showForm = false;
  editId: number | null = null;
  form: ProductRequest = { name: '', description: '', availableQuantity: 0, price: 0, categoryId: 0 };
  files: File[] = [];
  loading = false;
  page = 1;
  pageSize = 10;
  searchTerm = '';
  categoryFilter = 'all';
  stockFilter = 'all';
  private readonly categoryPalette = [
    { hue: '#ef4444', darkText: '#fca5a5', lightText: '#b91c1c' },
    { hue: '#3b82f6', darkText: '#93c5fd', lightText: '#1d4ed8' },
    { hue: '#22c55e', darkText: '#86efac', lightText: '#15803d' },
    { hue: '#a855f7', darkText: '#d8b4fe', lightText: '#7e22ce' },
    { hue: '#f59e0b', darkText: '#fcd34d', lightText: '#b45309' },
    { hue: '#14b8a6', darkText: '#5eead4', lightText: '#0f766e' },
    { hue: '#ec4899', darkText: '#f9a8d4', lightText: '#be185d' }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.load(); this.categoryService.findAll().subscribe((c: Category[]) => this.categories = c); }
  load(): void { this.productService.findAll().subscribe((p: Product[]) => this.products = p); }

  get filteredProducts(): Product[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.products.filter(product => {
      const matchesSearch = !query ||
        product.name.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query);
      const matchesCategory = this.categoryFilter === 'all' || String(product.categoryId) === this.categoryFilter;
      const matchesStock =
        this.stockFilter === 'all' ||
        (this.stockFilter === 'in-stock' && product.availableQuantity > 0) ||
        (this.stockFilter === 'out-of-stock' && product.availableQuantity <= 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }

  get paged(): Product[] {
    const s = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(s, s + this.pageSize);
  }

  onFilterChange(): void { this.page = 1; }

  categoryStyle(product: Product): Record<string, string> {
    const color = this.categoryPalette[this.categoryColorIndex(product)];
    return {
      '--category-hue': color.hue,
      '--category-dark-text': color.darkText,
      '--category-light-text': color.lightText
    };
  }

  private categoryColorIndex(product: Product): number {
    const key = product.categoryId || product.categoryName.length;
    return Math.abs(key) % this.categoryPalette.length;
  }

  openCreate(): void {
    this.editId = null;
    this.form = { name: '', description: '', availableQuantity: 0, price: 0, categoryId: 0 };
    this.files = [];
    this.showForm = true;
  }

  openEdit(p: Product): void {
    this.editId = p.id;
    this.form = { name: p.name, description: p.description, availableQuantity: p.availableQuantity, price: p.price, categoryId: p.categoryId };
    this.files = [];
    this.showForm = true;
  }

  onFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.files = input.files ? Array.from(input.files) : [];
  }

  save(): void {
    this.loading = true;
    if (this.editId) {
      this.productService.update(this.editId, this.form).subscribe({
        next: () => { this.toast.success('Product updated'); this.showForm = false; this.load(); this.loading = false; },
        error: () => { this.toast.error('Update failed'); this.loading = false; }
      });
    } else {
      this.productService.create(this.form, this.files).subscribe({
        next: () => { this.toast.success('Product created'); this.showForm = false; this.load(); this.loading = false; },
        error: () => { this.toast.error('Creation failed'); this.loading = false; }
      });
    }
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: () => { this.toast.success('Product deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }

  cancel(): void { this.showForm = false; }
}
