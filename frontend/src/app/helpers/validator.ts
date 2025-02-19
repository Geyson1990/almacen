import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredFileType(types: string[]): ValidatorFn {
    return (control: UntypedFormControl): ValidationErrors | null => {
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

export function emailValidator(email: string): boolean {
    if (!email) {
        return false;
    }
    const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
    return regex.test(email);
}

export function numberValidator(value: string): boolean {
    if (!value) {
        return false;
    }
    const regex = /(^\d*$)/g;
    return regex.test(value);
}

export const PasswordStrengthValidator = (
    control: AbstractControl,
    minLengthCharacters = 0,
    maxLengthCharacters = 64,
    valUpperCase = false,
    valLowerCase = false,
    valNumberChars = false,
    valSpecialChars = false,
): ValidationErrors | null => {
    const value: string = control.value || '';

    if (!value) {
        return null;
    }

    // const minLengthCharacters = 10;
    if (minLengthCharacters > value.length) {
        return { passwordStrength: `La contraseña debe tener al menos <strong>${minLengthCharacters}</strong> caracteres.` };
    }

    // const maxLengthCharacters = 64;
    if (maxLengthCharacters <= value.length) {
        return { passwordStrength: `La contraseña no puede exceder los <strong>${maxLengthCharacters}</strong> caracteres.` };
    }

    if (valUpperCase) {
        const upperCaseCharacters = /[A-Z]+/g;
        if (upperCaseCharacters.test(value) === false) {
            return { passwordStrength: `Al menos un caracter en <strong>mayúscula</strong>` };
        }
    }

    if (valLowerCase) {
        const lowerCaseCharacters = /[a-z]+/g;
        if (lowerCaseCharacters.test(value) === false) {
            return { passwordStrength: `Al menos un caracter en <strong>minúscula</strong>` };
        }
    }

    if (valNumberChars) {
        const numberCharacters = /[0-9]+/g;
        if (numberCharacters.test(value) === false) {
            return { passwordStrength: `Al menos un <strong>número</strong>` };
        }
    }

    if (valSpecialChars) {
        const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (specialCharacters.test(value) === false) {
            return { passwordStrength: `Al menos un <strong>caracter especial "!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?"</strong>` };
        }
    }
    return null;

};

export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value) {
            const isValid = value.length === value.trim().length;
            return isValid ? null : { whitespace: value };
        }
        return null;
    };
}

export function exactLengthValidator(lengths: number[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value && lengths) {
            let lengthsString = '';
            for (const length of lengths) {
                lengthsString += length + ', ';
                if (length === value.length) {
                    return null;
                }
            }
            lengthsString = lengthsString.substring(0, lengthsString.length - 2);
            return { exactlength: { requiredLength: lengthsString, actualLength: value.length } };
        }
        return null;
    };
}

export function requireCheckboxesToBeCheckedValidator(minRequired: number = 1, maxRequired: number = -1): ValidatorFn {
    return (formGroup: UntypedFormGroup): ValidationErrors | null => {
        // let checked = 0;
        // Object.keys(formGroup.controls).forEach(key => {
        //     const control = formGroup.controls[key];
        //     if (control.value === true || control.value === 'true') {
        //         checked++;
        //     }
        // });
        const checked = countCheckboxesChecked(formGroup);
        if (checked < minRequired || (checked > maxRequired && maxRequired !== -1)) {
            return {
                requireCheckboxesToBeChecked: { minRequired, maxRequired, actual: checked },
            };
        }
        return null;
    };
}

export function countCheckboxesChecked(abstractControl: UntypedFormGroup | UntypedFormControl): number {
    let checked = 0;
    try {
        Object.keys((abstractControl as UntypedFormGroup).controls).forEach(key => {
            const control = ((abstractControl as UntypedFormGroup).controls[key] as UntypedFormGroup | UntypedFormControl);
            checked += countCheckboxesChecked(control);
            if (!(control as UntypedFormGroup).controls) {
                if (control.value === true || control.value === 'true') {
                    checked++;
                }
            }
        });
    }
    catch (error) { }

    return checked;
}

export function fileMinSizeValidator(minSize: number): ValidatorFn {
    return (control: UntypedFormControl): ValidationErrors | null => {
        const file = control.value as File;
        if (file && minSize) {
            const size = file.size;
            if (size > minSize) {
                return null;
            }
            return { fileMinSize: { requiredSize: minSize, actualSize: size } };
        }
        return null;
    };
}

export function fileMaxSizeValidator(maxSize: number): ValidatorFn {
    return (control: UntypedFormControl): ValidationErrors | null => {
        const file = control.value as File;
        if (file && maxSize) {
            const size = file.size;
            if (size <= maxSize) {
                return null;
            }
            return { fileMaxSize: { requiredSize: maxSize, actualSize: size } };
        }
        return null;
    };
}

export function requiredFileTypeValidator(types: string[]): ValidatorFn {
    return (control: UntypedFormControl): ValidationErrors | null => {
        const file = control.value as File;
        if (file && types) {
            const extension = file.type.split('/')[1]?.toLowerCase();
            let extensionsString = '';
            if (extension) {
                for (const type of types) {
                    extensionsString += type.toLowerCase() + ', ';
                    if (type.toLowerCase() === extension) {
                        return null;
                    }
                }
                extensionsString = extensionsString.substring(0, extensionsString.length - 2);
            }
            return { requiredFileType: { requiredType: extensionsString, actualType: extension } };
        }
        return null;
    };
}

export function customValidateArrayGroup() {
  return function validate(formArr: AbstractControl): ValidationErrors | null {
    const filtered = (formArr as UntypedFormArray).value.filter(chk => chk.seleccionado);
    return filtered.length ? null : { hasError: true }
  };
}

export function percentageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined) {
        return null;
      }
  
      const numericValue = parseFloat(value);
      const valid = !isNaN(numericValue) && numericValue >= 0 && numericValue <= 100;
      return valid ? null : { percentageInvalid: { value } };
    };
  }