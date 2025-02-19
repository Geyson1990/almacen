import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { roundTo } from "./functions";

export function ValidateFileSize_Formulario(file: File, appendMaxSizeMessage = '', appendMinSizeMessage = ''): string {
    const MAX_FILE_SIZE_BYTES = 3145728;
    const MIN_FILE_SIZE_BYTES = 0;

    const fileSize = file.size;

    if (fileSize <= MIN_FILE_SIZE_BYTES) {
        return (`El tamaño del arhivo debe ser mayor a ${fileSize} bytes. ${appendMinSizeMessage}`).trim();
    }
    if (fileSize > MAX_FILE_SIZE_BYTES) {
        const maxFileSizeMb = roundTo((MAX_FILE_SIZE_BYTES / 1048576), 2);
        return (`El tamaño máximo permitido es ${maxFileSizeMb} MB. ${appendMaxSizeMessage}`).trim();
    }
    return 'ok';
}

export function requiredFileType(types: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value as File;
        if (file) {
            const extension = file.type.split('/')[1]?.toLowerCase();
            if (extension) {
                for (const type of types) {
                    if (type.toLowerCase() === extension) {
                        return null;
                    }
                }
            }
            return {
                requiredFileType: file.type
            };
        }
        return null;
    };
}

// En su lugar usar: fileMinSizeValidator y/o fileMaxSizeValidator
export function fileSizeValidator(minSize: number, maxSize: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value as File;
        if (file) {
            const size = file.size;
            if (size > minSize && size <= maxSize) {
                return null;
            }
            return {
                filesize: file.size
            };
        }
        return null;
    };
}
