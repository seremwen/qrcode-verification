import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BarcodeFormat, BrowserMultiFormatReader, Result } from '@zxing/library';
import JSZip from 'jszip';

@Component({
  selector: 'app-scan-qrcode',
  templateUrl: './scan-qrcode.component.html',
  styleUrl: './scan-qrcode.component.css'
})
export class ScanQrcodeComponent implements OnInit, OnDestroy {
  availableDevices!: MediaDeviceInfo[];
  deviceCurrent!: MediaDeviceInfo;
  deviceSelected!: string;
  result!: string;
  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices!: boolean;
  hasPermission!: boolean;

  qrResultString!: any;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  @Input() className: string = '';
  @Input() height: number = 1000;
  @Input() width: number = 1000;
  @Input() videoConstraints: any = { facingMode: 'environment' };
  @Output() onScan = new EventEmitter<string>();
  @Output() onError = new EventEmitter<any>();

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  private codeReader!: BrowserMultiFormatReader ;
src: any;

  ngOnInit() {
    this.codeReader = new BrowserMultiFormatReader();
    if (this.hasGetUserMedia()) {
      this.requestUserMedia();
    }
  }
  clearResult(): void {
    this.qrResultString = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    console.log(this.availableDevices);
    
    this.hasDevices = Boolean(devices && devices.length);
  }
  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  openInfoDialog() {
    const data = {
      hasDevices: this.hasDevices,
      hasPermission: this.hasPermission,
    };

  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  ngOnDestroy() {
    this.codeReader.reset();
  }

  private hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  private async requestUserMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: this.videoConstraints });
      this.videoElement.nativeElement.srcObject = stream;
      this.startScanning();
    } catch (error) {
      this.onError.emit(error);
    }
  }

  private startScanning() {
    this.codeReader.decodeFromVideoDevice(null, this.videoElement.nativeElement, (result: Result, error: any) => {
      if (result) {
        this.onScan.emit(result.getText());
      } else if (error) {
        this.onError.emit(error);
      }
    });
  }
  CERTIFICATE_FILE = "certificate.json";
  
  showScanner: boolean = false;
   contentOf:any
  toggleScanner() {
    this.showScanner = !this.showScanner;
  }

  onCodeResult(data: string) {
    this.qrResultString = data;
    if (data) {
      console.log('Scanned data:', data); // Log the initial scanned data
     
      console.log('Data type:', typeof data); // Log the type of the data
      console.log('Data length:', data.length); // Log the length of the data
  
      // Check if the data is base64 encoded
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(data);
      const binaryData = isBase64 ? atob(data) : data;
  
      // Convert binary data to a Uint8Array
      const uint8Array = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
  
      // Initialize JSZip
      const zip = new JSZip();
  
      zip.loadAsync(uint8Array)
        .then((contents) => {
          console.log('Zip contents:', contents); // Log the contents of the zip
          console.log('Files in zip:', Object.keys(contents.files));
  
          // Extract the certificate.json file
          return contents.files['certificate.json'].async('text');
        })
        .then((certificateContents) => {
          this.contentOf=certificateContents
          console.log('Unzipped file contents:', certificateContents); // Log the unzipped file contents
          this.result = certificateContents; // Store the certificate contents
        })
        .catch((err) => {
          console.error('Error unzipping data:', err); // Log any errors
          this.result = data; // Fallback to original data
        });
    }
  }
  
}
//   availableDevices!: MediaDeviceInfo[];
//   deviceCurrent!: MediaDeviceInfo;
//   deviceSelected!: string;
//   result!: string;
//   formatsEnabled: BarcodeFormat[] = [
//     BarcodeFormat.CODE_128,
//     BarcodeFormat.DATA_MATRIX,
//     BarcodeFormat.EAN_13,
//     BarcodeFormat.QR_CODE,
//   ];

//   hasDevices!: boolean;
//   hasPermission!: boolean;

//   qrResultString!: any;

//   torchEnabled = false;
//   torchAvailable$ = new BehaviorSubject<boolean>(false);
//   tryHarder = false;

//   constructor(private readonly _dialog: MatDialog) { }
 
//   clearResult(): void {
//     this.qrResultString = null;
//   }

//   onCamerasFound(devices: MediaDeviceInfo[]): void {
//     this.availableDevices = devices;
//     console.log(this.availableDevices);
    
//     this.hasDevices = Boolean(devices && devices.length);
//   }

//   onCodeResult(resultString: string) {
//     this.qrResultString = resultString;
//     if (resultString) {
//       const zip = new JSZip();
//       zip.loadAsync(resultString).then((contents) => {
//         const CERTIFICATE_FILE = 'data.txt'; // Replace with your actual file name
//         return contents.files[CERTIFICATE_FILE].async('text');
//       }).then((contents) => {
//         this.result = contents;
//         console.log('Unzipped Data:', this.result);
//       }).catch(err => {
//         this.result = resultString;
//         console.error('Error unzipping data:', err);
//       });
//     }
//   }
  



//   onDeviceChange(device: MediaDeviceInfo) {
//     const selectedStr = device?.deviceId || '';
//     if (this.deviceSelected === selectedStr) { return; }
//     this.deviceSelected = selectedStr;
//     this.deviceCurrent = device || undefined;
//   }

//   onHasPermission(has: boolean) {
//     this.hasPermission = has;
//   }

//   openInfoDialog() {
//     const data = {
//       hasDevices: this.hasDevices,
//       hasPermission: this.hasPermission,
//     };

//   }

//   onTorchCompatible(isCompatible: boolean): void {
//     this.torchAvailable$.next(isCompatible || false);
//   }

//   toggleTorch(): void {
//     this.torchEnabled = !this.torchEnabled;
//   }

 
// }
