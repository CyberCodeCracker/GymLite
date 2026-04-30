import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category, CategoryRequest } from '../../../core/models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html'
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  showForm = false;
  editId: number | null = null;
  form: CategoryRequest = { name: '', description: '' };
  loading = false;

  constructor(private categoryService: CategoryService, private toast: ToastService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.categoryService.findAll().subscribe((c: Category[]) => this.categories = c); }

  openCreate(): void { this.editId = null; this.form = { name: '', description: '' }; this.showForm = true; }
  openEdit(c: Category): void { this.editId = c.id!; this.form = { name: c.name, description: c.description }; this.showForm = true; }
  cancel(): void { this.showForm = false; }

  save(): void {
    this.loading = true;
    const onSuccess = () => { this.toast.success(this.editId ? 'Category updated' : 'Category created'); this.showForm = false; this.load(); this.loading = false; };
    const onError = () => { this.toast.error('Operation failed'); this.loading = false; };
    if (this.editId) {
      this.categoryService.update(this.editId, this.form).subscribe({ next: onSuccess, error: onError });
    } else {
      this.categoryService.create(this.form).subscribe({ next: onSuccess, error: onError });
    }
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this category?')) return;
    this.categoryService.delete(id).subscribe({
      next: () => { this.toast.success('Category deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }
}
