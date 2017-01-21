function convert_string(button_id){
    if(button_id == 'button_string'){
        var input = document.getElementById('input_string').value;
        document.getElementById('input_hex').value = string_Str2Hex(input);
        document.getElementById('input_bin').value = string_Str2Bin(input);
    }
    else if(button_id == 'button_hex'){
        var input = document.getElementById('input_hex').value;
        input = string_checkHex(input);
        if(input!=""){
            document.getElementById('input_string').value = string_Hex2Str(input);
            document.getElementById('input_bin').value = string_Hex2Bin(input);
        }
        
    }
    else if(button_id == 'button_bin'){
        var input = document.getElementById('input_bin').value;
        input = string_checkBin(input)
        if(input!=""){
            document.getElementById('input_hex').value = string_Bin2Hex(input);
            document.getElementById('input_string').value = string_Bin2Str(input);
        }
    }
    string_calculateLength();
}

function string_removeSpace(button_id){
     if(button_id == 'button_clean_hex'){
        var input = document.getElementById('input_hex').value;
        var output = input.replace(/\s/g,'');
        document.getElementById('input_hex').value = output;
        
    }
    else if(button_id == 'button_clean_bin'){
        var input = document.getElementById('input_bin').value;
        var output = input.replace(/\s/g,'');
        document.getElementById('input_bin').value = output;
        
    }
}

function string_Str2Hex(input){
    var output = '';
    for(var i = 0;i<input.length;i++){
        output = output+' '+input[i].charCodeAt(0).toString(16);
    }
    return output.substr(1);
}

function string_Str2Bin(input){
    var output = '';
    var bin;
    for(var i = 0;i<input.length;i++){
        bin = input[i].charCodeAt(0).toString(2);
        output = output+' '+ "00000000".substr(bin.length) + bin;
    }
    return output.substr(1);
}


function string_Hex2Str(input){    
    var output = '';
    var charCode;    
    for(var i =0;i<input.length;i+=2){
        charCode = parseInt(input.substr(i,2),16);
        if(charCode<0 && charCode>127){
            alert('should contain only ascii value');
            return '';
        }
        output += String.fromCharCode(charCode);
    }
    return output;
    
}

function string_Hex2Bin(input){
    return string_Str2Bin(string_Hex2Str(input));
    
}

function string_Bin2Str(input){
   
    var output = '';
    var charCode;
    for(var i =0;i<input.length;i+=8){      
        charCode = parseInt(input.substr(i,8),2);
        if(charCode<0 && charCode>127){
            alert('should contain only ascii value');
            return '';
        }
        output += String.fromCharCode(charCode);
    }
    return output;
    
}
function string_Bin2Hex(input){
   return string_Str2Hex(string_Bin2Str(input));
}



function string_checkHex(input){
    input = input.replace(/\s/g,'');
    input = input.toUpperCase();
    if(input.length%2!=0){
        alert('Hex String Lenght should be multiple of 2');
        return "";
    }
    for(var i=0;i<input.length;i++){
        if(! ((input[i] >= '0' && input[i]<='9') || (input[i]>='A' && input[i]<='F') )){
            alert('Hex Value must be 0-9 or A-F')
            return "";
        }

    }
    return input;
}

function string_checkBin(input){
    input = input.replace(/\s/g,'');
    if(input.length%8!=0){
        alert('Hex String Lenght should be multiple of 8');
        return "";
    }

    for(var i=0;i<input.length;i++){
        if(input[i]!= '1' && input[i]!='0'){
            alert('Binary Value must be 0 or 1');
            return "";
        }
    }
   
    return input;
}

function string_calculateLength(){
     document.getElementById('input_bin_length').innerHTML = 'Length : '+document.getElementById('input_bin').value.replace(/\s/g,'').length;
     document.getElementById('input_hex_length').innerHTML = 'Length : '+document.getElementById('input_hex').value.replace(/\s/g,'').length;
     document.getElementById('input_string_length').innerHTML = 'Length : '+document.getElementById('input_string').value.replace(/\s/g,'').length;
}