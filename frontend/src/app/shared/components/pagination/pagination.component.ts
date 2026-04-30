import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 12;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number { return Math.ceil(this.totalItems / this.pageSize) || 1; }
  get pages(): number[] {
    const p: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) p.push(i);
    return p;
  }
  go(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) this.pageChange.emit(page);
  }
}
