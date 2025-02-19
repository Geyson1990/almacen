import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vista-pdf',
  templateUrl: './vista-pdf.component.html',
  styleUrls: ['./vista-pdf.component.css']
})
export class VistaPdfComponent implements OnInit {

  @Input() public pdfUrl;
  @Input() public titleModal:string = 'Vista Previa';

  constructor(public activeModal: NgbActiveModal,private sanitizer: DomSanitizer) {
  }
  
  ngOnInit(): void {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
  }

}
