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
   contentOf:any
  toggleScanner() {
    this.showScanner = !this.showScanner;
  }

  handleScan(data: string) {
    if (data) {
      console.log('Scanned data:', data); // Log the initial scanned data
      const zip = new JSZip();
      zip.loadAsync(data)
        .then((contents) => {
          console.log('Zip contents:', contents); // Log the contents of the zip
          this.contentOf= Object.keys(contents.files)
          console.log('Files in zip:', Object.keys(contents.files));
          return contents.files[this.CERTIFICATE_FILE].async('text');
        })
        .then((contents) => {
          console.log('Unzipped file contents:', contents); // Log the unzipped file contents
          this.result = contents;
        })
        .catch((err) => {
          console.error('Error unzipping data:', err); // Log any errors
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
