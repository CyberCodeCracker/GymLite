import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CategoryResponse } from '../../../../core/models/category.model';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-admin-categories-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories-page.component.html',
  styleUrl: './admin-categories-page.component.scss'
})
export class AdminCategoriesPageComponent implements OnInit {
  readonly createForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  readonly deleteForm = this.formBuilder.nonNullable.group({
    categoryId: [1, Validators.required]
  });

  categories: CategoryResponse[] = [];
  loading = false;
  creating = false;
  deleting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  createCategory(): void {
    if (this.createForm.invalid || this.creating) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.creating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.categoryService
      .create(this.createForm.getRawValue())
      .pipe(finalize(() => (this.creating = false)))
      .subscribe({
        next: (categoryId) => {
          this.successMessage = `Category created successfully with ID ${categoryId}.`;
          this.createForm.reset({ name: '', description: '' });
          this.loadCategories();
        },
        error: () => {
          this.errorMessage = 'Category creation failed.';
        }
      });
  }

  deleteCategory(): void {
    if (this.deleteForm.invalid || this.deleting) {
      this.deleteForm.markAllAsTouched();
      return;
    }

    const categoryId = this.deleteForm.getRawValue().categoryId;
    this.deleting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.categoryService
      .delete(categoryId)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe({
        next: () => {
          this.successMessage = `Category #${categoryId} deleted.`;
          this.loadCategories();
        },
        error: () => {
          this.errorMessage = `Unable to delete category #${categoryId}.`;
        }
      });
  }

  private loadCategories(): void {
    this.loading = true;

    this.categoryService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: () => {
          this.errorMessage = 'Could not load categories. Ensure /api/category is routed in gateway.';
        }
      });
  }
}
