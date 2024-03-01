import { FormControl, FormGroup } from "@angular/forms";

// A class that contains a static method to validate all form fields
export default class ValidateForm {

    // Method to validate all form fields
    static validateAllFormFields(formGroup: FormGroup) { 

        // Loop through all form controls
        Object.keys(formGroup.controls).forEach(field => {  
            const control = formGroup.get(field);            
            if (control instanceof FormControl) {   
              control.markAsDirty({ onlySelf: true });
            } else if (control instanceof FormGroup) {      
                this.validateAllFormFields(control);           
            }
        });
      }
}
