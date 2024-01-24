const data = {
    'año': /^(19[0-9]{2}|2[0-9]{3})$/,
    'soloTexto': /^['A-zÀ-ú-. ]{1,100}$/,
    'curp': /[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/,
    'rfc': /[A-ZÑ&]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]/,
}

export default data;
  