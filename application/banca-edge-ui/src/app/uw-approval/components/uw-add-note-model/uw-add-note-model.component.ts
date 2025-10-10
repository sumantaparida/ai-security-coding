import { Component, OnInit } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-uw-add-note-model',
  templateUrl: './uw-add-note-model.component.html',
  styleUrls: ['./uw-add-note-model.component.css']
})
export class UwAddNoteModelComponent implements OnInit {
  noteForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<UwAddNoteModelComponent>) { }

  ngOnInit(): void {
    this.noteForm = new FormGroup({
      note: new FormControl('', Validators.required)
    });
  }
}
