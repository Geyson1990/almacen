import { UntypedFormGroup } from '@angular/forms';

export function roundTo(n: number, digits = 0): number {
    let negative = false;

    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    const multiplicator = Math.pow(10, digits);
    n = Number(parseFloat((n * multiplicator).toFixed(11)));
    n = Number((Math.round(n) / multiplicator).toFixed(digits));
    if (negative) {
        n = Number((n * -1).toFixed(digits));
    }
    return n;
}

export function MustMatch(controlName: string, matchingControlName: string): any {
    return (formGroup: UntypedFormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustmatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustmatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

export function truncateString(text: string, length: number = 20): string {
    if (!text) {
        return '';
    }
    if (text.length > length) {
        return text.slice(0, length).trim() + '...';
    } else {
        return text;
    }
}

export function formatBytes(bytes, decimals = 2): string {
    if (bytes === 0) { return '0 Bytes'; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function stringToDate(fecha:string):any{
    const dateString = fecha; // formato dd/mm/YYYY
    var dateParts = dateString.split("/");
    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject: Date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
    return dateObject;
}