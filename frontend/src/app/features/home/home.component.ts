import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  featured: Product[] = [];
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.productService.findAll().subscribe((p: Product[]) => this.featured = p.slice(0, 4));
  }
}
