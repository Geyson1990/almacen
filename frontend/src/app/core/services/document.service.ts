import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documentsSubject = new BehaviorSubject<string[]>([]);
  documents$ = this.documentsSubject.asObservable();

  constructor() {}

  addDocument(document: string) {
    const currentDocuments = this.documentsSubject.value;
    currentDocuments.push(document);
    this.documentsSubject.next(currentDocuments);
  }
}