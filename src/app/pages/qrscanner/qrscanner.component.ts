import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import { scanImageData } from 'zbar.wasm';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrl: './qrscanner.component.css'
})
export class QRScannerComponent implements OnInit, OnDestroy {
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
}