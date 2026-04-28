import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Product, ProductRequest, ProductUpdateRequest } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products-page.component.html',
  styleUrl: './admin-products-page.component.scss'
})
export class AdminProductsPageComponent implements OnInit {
  readonly createForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    availableQuantity: [1, Validators.required],
    price: [1, Validators.required],
    categoryId: [1, Validators.required]
  });

  readonly updateForm = this.formBuilder.group({
    name: [''],
    description: [''],
    availableQuantity: [null as number | null],
    price: [null as number | null],
    categoryId: [null as number | null]
  });

  products: Product[] = [];
  selectedFiles: File[] = [];
  selectedProductId: number | null = null;

  creating = false;
  loading = false;
  updating = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      this.selectedFiles = [];
      return;
    }

    this.selectedFiles = Array.from(input.files);
  }

  createProduct(): void {
    if (this.createForm.invalid || this.creating) {
      this.createForm.markAllAsTouched();
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'At least one product image file is required.';
      return;
    }

    const rawValue = this.createForm.getRawValue();
    const payload: ProductRequest = {
      id: null,
      name: rawValue.name,
      description: rawValue.description,
      availableQuantity: rawValue.availableQuantity,
      price: rawValue.price,
      categoryId: rawValue.categoryId
    };

    this.creating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService
      .createProduct(payload, this.selectedFiles)
      .pipe(finalize(() => (this.creating = false)))
      .subscribe({
        next: (id) => {
          this.successMessage = `Product created successfully with ID ${id}.`;
          this.createForm.reset({
            name: '',
            description: '',
            availableQuantity: 1,
            price: 1,
            categoryId: 1
          });
          this.selectedFiles = [];
          this.loadProducts();
        },
        error: () => {
          this.errorMessage = 'Product creation failed.';
        }
      });
  }

  selectProductForUpdate(product: Product): void {
    this.selectedProductId = product.id;
    this.updateForm.patchValue({
      name: product.name,
      description: product.description,
      availableQuantity: product.availableQuantity,
      price: product.price,
      categoryId: product.categoryId
    });
  }

  updateSelectedProduct(): void {
    if (this.selectedProductId === null || this.updating) {
      return;
    }

    const rawValue = this.updateForm.getRawValue();
    const payload: ProductUpdateRequest = {};

    if (rawValue.name) {
      payload.name = rawValue.name;
    }
    if (rawValue.description) {
      payload.description = rawValue.description;
    }
    if (rawValue.availableQuantity !== null) {
      payload.availableQuantity = rawValue.availableQuantity;
    }
    if (rawValue.price !== null) {
      payload.price = rawValue.price;
    }
    if (rawValue.categoryId !== null) {
      payload.categoryId = rawValue.categoryId;
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    this.updating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService
      .updateProduct(this.selectedProductId, payload)
      .pipe(finalize(() => (this.updating = false)))
      .subscribe({
        next: () => {
          this.successMessage = `Product #${this.selectedProductId} updated.`;
          this.loadProducts();
        },
        error: () => {
          this.errorMessage = 'Product update failed.';
        }
      });
  }

  deleteProduct(productId: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.successMessage = `Product #${productId} deleted.`;
        this.loadProducts();
      },
      error: () => {
        this.errorMessage = `Could not delete product #${productId}.`;
      }
    });
  }

  private loadProducts(): void {
    this.loading = true;

    this.productService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (products) => {
          this.products = products;
        },
        error: () => {
          this.errorMessage = 'Could not load products.';
        }
      });
  }
}
