import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BrowserQRCodeReader, NotFoundException, Result } from '@zxing/library';

@Component({
  selector: 'app-scan-qrcode',
  templateUrl: './scan-qrcode.component.html',
  styleUrl: './scan-qrcode.component.css'
})
export class ScanQrcodeComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  qrResult: string;

  constructor() {
    this.qrResult = '';
  }

  ngAfterViewInit(): void {
    this.initializeCamera();
  }

  initializeCamera(): void {
    const video = this.videoElement.nativeElement;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error('Error accessing the camera.', err);
      });
  }

  startScanner(): void {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Failed to get 2D context for canvas.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert ImageData to ImageBitmap
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    createImageBitmap(imageData).then(imageBitmap => {
      // Convert ImageBitmap to Blob
      imageBitmapToBlob(imageBitmap).then(blob => {
        // Convert Blob to Blob URL
        const blobUrl = URL.createObjectURL(blob);

        // Decode QR code from Blob URL
        const codeReader = new BrowserQRCodeReader();
        codeReader.decodeFromImageUrl(blobUrl)
          .then(result => {
            this.qrResult = result.getText(); // Get decoded text
          })
          .catch((error: any) => {
            if (error instanceof NotFoundException) {
              console.error('QR code not found.', error);
              this.qrResult = 'QR code not found. Please try again.';
            } else {
              console.error('Error decoding QR code.', error);
              this.qrResult = 'Error decoding QR code. Please try again.';
            }
          })
          .finally(() => {
            URL.revokeObjectURL(blobUrl); // Clean up Blob URL
          });
      });
    }).catch(err => {
      console.error('Error creating ImageBitmap.', err);
    });
  }
}

function imageBitmapToBlob(imageBitmap: ImageBitmap): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      reject('Failed to get 2D context for canvas.');
      return;
    }

    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    context.drawImage(imageBitmap, 0, 0);

    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject('Failed to convert ImageBitmap to Blob.');
      }
    });
  });
}
// {
// urlPath = "/certificate";
// registerMemberLimit = 4;
// certificatePublicKey =  "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnXQalrgztecTpc+INjRQ8s73FSE1kU5QSlwBdICCVJBUKiuQUt7s+Z5epgCvLVAOCbP1mm5lV7bfgV/iYWDio7lzX4MlJwDedWLiufr3Ajq+79CQiqPaIbZTo0i13zijKtX7wgxQ78wT/HkJRLkFpmGeK3za21tEfttytkhmJYlwaDTEc+Kx3RJqVhVh/dfwJGeuV4Xc/e2NH++ht0ENGuTk44KpQ+pwQVqtW7lmbDZQJoOJ7HYmmoKGJ0qt2hrj15uwcD1WEYfY5N7N0ArTzPgctExtZFDmituLGzuAZfv2AZZ9/7Y+igshzfB0reIFdUKw3cdVTzfv5FNrIqN5pwIDAQAB\n-----END PUBLIC KEY-----\n"

// CERTIFICATE_SIGNED_KEY_TYPE = 'RSA';
// certificatePublicKeyBase58 =  "DaipNW4xaH2bh1XGNNdqjnSYyru3hLnUgTBSfSvmZ2hi";
// CERTIFICATE_STATUS_VC = 'true';
// finalData:any
// qrCodeData!: string;
// certificateData: any; // Assuming JSON structure matches your certificate
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
//   fileData:any
//   torchEnabled = false;
//   torchAvailable$ = new BehaviorSubject<boolean>(false);
//   tryHarder = false;
//   private readonly CERTIFICATE_FILE = 'certificate.json';
//   @ViewChild('scanner', { static: false }) scanner: any;
//   constructor(private readonly _dialog: MatDialog,private ngxQrcodeReader: NgxQrcodeReaderService) { }
 
//   scanSuccessHandler(event: any) {
//     this.qrCodeData = event;
//     console.log('QR Code Data:', this.qrCodeData);
//     this.processQRCodeData(this.qrCodeData);
//   }

//   processQRCodeData2(fileList: any){
//     const jsZip = new JSZip();
//     this.qrResultString = fileList;
//     // Assuming fileList[0] contains the zip file
//     console.log('Starting to load zip file...');
//     jsZip.loadAsync(fileList).then((contents) => {
//       return contents.files['certificate.json'].async('text') 
          
//       }).then(function (contents) {
//           // setResult();
//           console.log(contents);
          
//       }).catch(err => {
//               // setResult(data)
//           }
//       )
//     //   console.log('Zip file loaded successfully.');
  
//     //   // Access the file directly
//     //   let certificateFile = contents.file('certificate.json');
      
//     //   // Check if the file exists
//     //   if (certificateFile) {
//     //     console.log('Found certificate.json in zip file.');
  
//     //     // Read the file as a string
//     //     certificateFile.async('string').then((fileData) => {
//     //       console.log('Read certificate.json successfully.');
          
//     //       // Concatenate file data with this.fileData
//     //       this.fileData = this.fileData + '**$$##$$**' + fileData;
          
//     //       console.log('Updated this.fileData:', this.fileData);
//     //     }).catch((err) => {
//     //       console.error('Error reading certificate.json:', err);
//     //     });
//     //   } else {
//     //     console.error('Certificate file not found in zip.');
//     //   }
//     // }).catch((err) => {
//     //    console.error('Error loading zip file:', err);
//     }
//   // );
//   // }
  

//   processQRCodeData(qrCodeData: string) {
//     try {
//       console.log('Processing QR code data...');
//       // Handle UTF-8 characters in base64
//       const decodedData = this.decodeBase64Unicode(qrCodeData);
//       console.log('Decoded Data:', decodedData);
//       // Check if it's a valid base64 string
//       if (!decodedData || decodedData === '') {
//         throw new Error('QR code data is not valid base64 encoded data.');
//       }

//       // Attempt to load the data as a zip file
//       JSZip.loadAsync(decodedData, { base64: true })
//         .then(zip => {
//           console.log('Zip file loaded successfully:', zip);
//           // Check if 'certificate.json' file exists in the zip
//           const certificateFile = zip.file('certificate.json');
//           if (!certificateFile) {
//             throw new Error('certificate.json not found in the zip file.');
//           }
//           return certificateFile.async('string');
//         })
//         .then(jsonData => {
//           console.log('Certificate JSON Data:', jsonData);
//           this.certificateData = JSON.parse(jsonData);
//           console.log('Certificate data:', this.certificateData);
//         })
//         .catch(err => {
//           console.error('Error processing QR code data: ', err);
//           // Handle specific error messages or show user-friendly messages
//         });
//     } catch (error) {
//       console.error('Error decoding QR code data: ', error);
//       // Handle decoding errors, e.g., invalid base64
//     }
//   }

//   // Function to handle base64 decoding with Unicode characters
//   decodeBase64Unicode(input: string): string {
//     const decoded = atob(input);
//     const decodedURIComponent = decodeURIComponent(escape(decoded));
//     return decodedURIComponent;
//   }
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
//     this.processQRCode(resultString);
//   }

//   processQRCode(qrData: string) {
//     try {
//       console.log('Raw QR Code Data:', qrData);
//       let binaryData = this.extractBinaryData(qrData);
//       this.handleZipData(binaryData);
//     } catch (error) {
//       console.error('Error processing QR code:', error);
//     }
//   }

//   extractBinaryData(qrData: string): Uint8Array {
//     // Convert QR code string data directly to Uint8Array
//     let binaryData = new Uint8Array(qrData.length);
//     for (let i = 0; i < qrData.length; i++) {
//       binaryData[i] = qrData.charCodeAt(i);
//     }
//     return binaryData;
//   }

//   handleZipData(binaryData: Uint8Array) {
//     const zip = new JSZip();
//     zip.loadAsync(binaryData).then((contents) => {
//       // Load 'certificate.json' from the zip file
//       return contents.files[this.CERTIFICATE_FILE].async('text');
//     }).then((certificateJson) => {
//       console.log('Certificate JSON:', certificateJson);
//       // Handle the parsed certificate JSON as needed

//     }).catch((err) => {
//       console.error('Error handling zipped data:', err);
//     });
//   }

//   async verifySignature(jsonData: any) {
//     const publicKey = this.certificatePublicKeyBase58 // Implement this method to get the public key
//     const result = await verify(jsonData, {
//       documentLoader: url => {
//         // Implement a custom document loader if necessary
//       },
//       // suite: new RsaSignature2018({
//       //   publicKey: publicKey
//       // })
//     });
  
//     return result.verified;
//   }
//   // verifyRevocation(jsonData: any) {
//   //   const certificateId = jsonData.certificate.id;
//   //   this.certificateService.checkRevocation(certificateId).subscribe(
//   //     (response: any) => {
//   //       if (response.revoked) {
//   //         console.error('Certificate has been revoked');
//   //       } else {
//   //         this.showSuccessScreen(jsonData);
//   //       }
//   //     },
//   //     (error) => {
//   //       console.error('Error checking revocation status', error);
//   //     }
//   //   );
//   // }

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
