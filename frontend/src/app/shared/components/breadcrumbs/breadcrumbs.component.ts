import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { filter } from 'rxjs';

interface Breadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {
    this.setBreadcrumbs(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.setBreadcrumbs(event.urlAfterRedirects));
  }

  private setBreadcrumbs(url: string): void {
    const path = url.split('?')[0].split('#')[0];
    const segments = path.split('/').filter(Boolean);

    this.breadcrumbs = this.buildBreadcrumbs(segments);
  }

  private buildBreadcrumbs(segments: string[]): Breadcrumb[] {
    if (segments[0] === 'products' && segments[1]) {
      return [
        { label: 'Shop', url: '/products' },
        { label: 'Product Details' }
      ];
    }

    if (segments[0] === 'checkout') {
      return [
        { label: 'Cart', url: '/cart' },
        { label: 'Checkout' }
      ];
    }

    if (segments[0] === 'admin' && segments[1]) {
      return [
        { label: 'Admin', url: '/admin/products' },
        { label: this.formatSegment(segments[1]) }
      ];
    }

    return [];
  }

  private formatSegment(segment: string): string {
    return segment
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
