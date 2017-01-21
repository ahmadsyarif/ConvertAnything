



function convert_number(button_id){
    var output;
    var input;
    if(button_id=='button_number_dec'){
        input = document.getElementById('input_number_dec').value;
        input = number_checkDec(input);
        if(input!=""){
            document.getElementById('input_number_hex').value = number_Dec2Hex(input);
            document.getElementById('input_number_oct').value = number_Dec2Oct(input);
            document.getElementById('input_number_bin').value = number_Dec2Bin(input);
        }
    }
    else if(button_id=='button_number_hex'){
        input = document.getElementById('input_number_hex').value;
        input = number_checkHex(input); 
        if(input!=""){
            document.getElementById('input_number_dec').value = number_Hex2Dec(input);
            document.getElementById('input_number_oct').value = number_Hex2Oct(input);
            document.getElementById('input_number_bin').value = number_Hex2Bin(input);
        }
    }
    else if(button_id=='button_number_oct'){
        input = document.getElementById('input_number_oct').value;
        input = number_checkOct(input); 
        if(input!=""){
            document.getElementById('input_number_dec').value = number_Oct2Dec(input);
            document.getElementById('input_number_hex').value = number_Oct2Hex(input);
            document.getElementById('input_number_bin').value = number_Oct2Bin(input);
        }
    }
    else if(button_id=='button_number_bin'){
        input = document.getElementById('input_number_bin').value;
        input = number_checkBin(input); 
        if(input!=""){
            document.getElementById('input_number_dec').value = number_Bin2Dec(input);
            document.getElementById('input_number_hex').value = number_Bin2Hex(input);
            document.getElementById('input_number_oct').value = number_Bin2Oct(input);
        }
    }
   
}

//remove space
function number_removeSpace(button_id){

}


//check function
function number_checkDec(input){
    for(var i=0;i<input.length;i++){
        if(input[i]<'0' || input[i]>'9'){
            alert('Decimal value only 0-9');
            return "";
        }
    }
    return input;
}
function number_checkHex(input){
    var temp = input.replace(/\s/g,'');
    temp = temp.toUpperCase();
    for(var i =0;i<temp.length;i++){
        if(! ((temp[i] >= '0' && temp[i]<='9') || (temp[i]>='A' && temp[i]<='F') )){
            alert('Hexadecimal Value must be 0-9 or A-F')
            return false;
        }
    }
    return temp;

}
function number_checkOct(input){
    for(var i=0;i<input.length;i++){
        if(input[i]<'0' || input[i]>'7'){
            alert('Octadecimal value only 0-7');
            return "";
        }
    }
    return input;
}
function number_checkBin(input){
     for(var i=0;i<input.length;i++){
        if(input[i]!='0' && input[i]!='1'){
            alert('Binary value only 0-1');
            return "";
        }
    }
    return input;
}


//DECIMAL TO 
function number_Dec2Hex(input){
    var output = parseInt(input,10).toString(16).toUpperCase();
    var final = '';
    if(output.length%2==1){
        output = '0' + output;
    }
  
    for(var i=0;i<output.length;i+=2){
        final = final + ' ' + output.substr(i,2);
    }

    return final.substr(1);

}

function number_Dec2Oct(input){
    var output = parseInt(input,10).toString(8);   
    var final = '';
    if(output.length%2==1){
        output = '0' + output;
    }
    for(var i=0;i<output.length;i+=2){
        final = final + ' ' + output.substr(i,2);
    }

    return final.substr(1);
}

function number_Dec2Bin(input){
    var output = parseInt(input,10).toString(2);
    var final = '';
    var padding = '0000';

    output = padding.substr(0,4-output.length%4) + output;
    
    for(var i=0;i<output.length;i+=4){
        final = final + ' ' + output.substr(i,4);
    }
    return final.substr(1);

}

//HEXADECIMAL TO
function number_Hex2Dec(input){
    return parseInt(input,16).toString(10);
}
function number_Hex2Oct(input){
    return number_Dec2Oct(number_Hex2Dec(input));
}
function number_Hex2Bin(input){
    return number_Dec2Bin(number_Hex2Dec(input));
}

//OCTADECIMAL TO

function number_Oct2Dec(input){
    return parseInt(input,8).toString(10);
}
function number_Oct2Hex(input){
    return number_Dec2Hex(number_Oct2Dec(input));
}

function number_Oct2Bin(input){
    return number_Dec2Bin(number_Oct2Dec(input));
}

//BINARY TO
function number_Bin2Dec(input){
    return parseInt(input,2).toString(10);
}
function number_Bin2Hex(input){
    return number_Dec2Hex(number_Bin2Dec(input));
}

function number_Bin2Oct(input){
    return number_Dec2Oct(number_Bin2Dec(input));
}
