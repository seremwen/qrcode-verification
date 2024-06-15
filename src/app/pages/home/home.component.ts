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
      this.contentOf=data
      console.log('Data type:', typeof data); // Log the type of the data
      console.log('Data length:', data.length); // Log the length of the data

      // If data is base64 encoded, decode it
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(data);
      const binaryData = isBase64 ? atob(data) : data;
      const zip = new JSZip();
      zip.loadAsync(binaryData)
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
