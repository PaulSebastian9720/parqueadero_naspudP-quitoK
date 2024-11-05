import { FormGroup} from "@angular/forms";

export const isRequired = (fiel : "name" | "password"  | "last_name" | "correo" | "confirmPassword", form : FormGroup) => {
    const control = form.get(fiel)
    return control && control.touched && control.hasError("required") 
}

export const hasEmailError = (form : FormGroup) => {
    const control = form.get("correo")
    return control && control.touched  && control.hasError("email")
}

export const isNotSamePassword = (form : FormGroup) => {
    const controlP = form.get("password")
    const controlCP = form.get("confirmPassword")
    return controlP && controlCP && controlCP.touched && controlP.touched && controlCP.value != controlP.value 
}

export const isShortParameter= (fiel : "password" | "name" | "last_name" | "number" ,form : FormGroup, minLength : number = 3) => {
    const control = form.get(fiel)
    return control &&  control.touched &&  control.value.length < minLength
}

export const isNumberPhone =(form: FormGroup, length : number = 10)=> {
    const control = form.get("phone")
    return control &&  control.touched &&  control.value.length != length 
}
