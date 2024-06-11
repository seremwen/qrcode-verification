import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { BarcodeFormat } from '@zxing/library';
@Component({
  selector: 'app-formats-dialog',
  templateUrl: './formats-dialog.component.html',
  styleUrl: './formats-dialog.component.css'
})
export class FormatsDialogComponent {
  formatsAvailable:any;

  formatsEnabled: BarcodeFormat[];

  readonly formatNames:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: any,
    private readonly _dialogRef: MatDialogRef<FormatsDialogComponent>) {
    this.formatsEnabled = data.formatsEnabled || [];
  }

  close() {
    this._dialogRef.close(this.formatsEnabled);
  }

  isEnabled(format: BarcodeFormat) {
    return this.formatsEnabled.find(x => x === format);
  }

  onSelectionChange(event: MatSelectionListChange) {
    this.formatsEnabled = event.source.selectedOptions.selected.map(selected => selected.value);
  }
}