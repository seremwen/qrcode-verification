import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BarcodeFormat } from '@zxing/library';
import { verify } from 'jsonld-signatures';
import * as pako from 'pako';
@Component({
  selector: 'app-scan-qrcode',
  templateUrl: './scan-qrcode.component.html',
  styleUrl: './scan-qrcode.component.css'
})
export class ScanQrcodeComponent {
urlPath = "/certificate";
registerMemberLimit = 4;
certificatePublicKey =  "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnXQalrgztecTpc+INjRQ8s73FSE1kU5QSlwBdICCVJBUKiuQUt7s+Z5epgCvLVAOCbP1mm5lV7bfgV/iYWDio7lzX4MlJwDedWLiufr3Ajq+79CQiqPaIbZTo0i13zijKtX7wgxQ78wT/HkJRLkFpmGeK3za21tEfttytkhmJYlwaDTEc+Kx3RJqVhVh/dfwJGeuV4Xc/e2NH++ht0ENGuTk44KpQ+pwQVqtW7lmbDZQJoOJ7HYmmoKGJ0qt2hrj15uwcD1WEYfY5N7N0ArTzPgctExtZFDmituLGzuAZfv2AZZ9/7Y+igshzfB0reIFdUKw3cdVTzfv5FNrIqN5pwIDAQAB\n-----END PUBLIC KEY-----\n"

CERTIFICATE_SIGNED_KEY_TYPE = 'RSA';
certificatePublicKeyBase58 =  "DaipNW4xaH2bh1XGNNdqjnSYyru3hLnUgTBSfSvmZ2hi";
CERTIFICATE_STATUS_VC = 'true';
finalData:any
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

  constructor(private readonly _dialog: MatDialog) { }
 
  clearResult(): void {
    this.qrResultString = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    console.log(this.availableDevices);
    
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    const binaryData = atob(resultString); // Decode base64 string
  const compressedData = new Uint8Array([...binaryData].map(char => char.charCodeAt(0)));
  const decompressedData = pako.inflate(compressedData, { to: 'string' });
 
  const jsonData = JSON.parse(decompressedData);
  this.finalData=jsonData
  this.authenticateJson(jsonData);
  }
  
  authenticateJson(jsonData: any) {
    // Use your method to authenticate the JSON data
    const isValid = this.verifySignature(jsonData);
    // if (isValid) {
    //   // this.verifyRevocation(jsonData);
    // } else {
    //   console.error('Invalid signature');
    // }
  }
  async verifySignature(jsonData: any) {
    const publicKey = this.certificatePublicKeyBase58 // Implement this method to get the public key
    const result = await verify(jsonData, {
      documentLoader: url => {
        // Implement a custom document loader if necessary
      },
      // suite: new RsaSignature2018({
      //   publicKey: publicKey
      // })
    });
  
    return result.verified;
  }
  // verifyRevocation(jsonData: any) {
  //   const certificateId = jsonData.certificate.id;
  //   this.certificateService.checkRevocation(certificateId).subscribe(
  //     (response: any) => {
  //       if (response.revoked) {
  //         console.error('Certificate has been revoked');
  //       } else {
  //         this.showSuccessScreen(jsonData);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error checking revocation status', error);
  //     }
  //   );
  // }

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

 
}
