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

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.load(); this.categoryService.findAll().subscribe((c: Category[]) => this.categories = c); }
  load(): void { this.productService.findAll().subscribe((p: Product[]) => this.products = p); }

  get paged(): Product[] {
    const s = (this.page - 1) * this.pageSize;
    return this.products.slice(s, s + this.pageSize);
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
