import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-page-header',
  imports: [],
  standalone: true,
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() pageEyebrow: string = '';
  @Input() pageTitle: string = '';
  @Input() pageDescription: string = '';
}
