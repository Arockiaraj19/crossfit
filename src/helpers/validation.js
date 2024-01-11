export  function validateUserName(text){
    return /^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(text);
}
export function validatePhone(number) {
    var re = /^\d{10}$/;
    return re.test(number);
}
