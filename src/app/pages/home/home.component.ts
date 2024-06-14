import { Component } from '@angular/core';
import JSZip from 'jszip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  CERTIFICATE_FILE = "certificate.json";
  result: string = '';
  showScanner: boolean = false;

  toggleScanner() {
    this.showScanner = !this.showScanner;
  }

  handleScan(data: string) {
    if (data) {
      const zip = new JSZip();
      zip.loadAsync(data).then((contents) => {
        return contents.files[this.CERTIFICATE_FILE].async('text');
      }).then((contents) => {
        this.result = contents;
      }).catch(err => {
        this.result = data;
      });
    }
  }

  handleError(err: any) {
    console.error(err);
  }

  reset() {
    this.showScanner = false;
    this.result = '';
  }
}
