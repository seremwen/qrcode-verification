import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-certificate-status',
  templateUrl: './certificate-status.component.html',
  styleUrl: './certificate-status.component.css'
})
export class CertificateStatusComponent {
  @Input() certificateData: any;
  @Output() goBack = new EventEmitter<void>();

  objectKeys = Object.keys;
}
