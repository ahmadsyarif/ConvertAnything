const tlv_dertlv_button = 'tlv_dertlv_button';
const tlv_dertlv_input = 'tlv_dertlv_input';
const tlv_dertlv_output = 'tlv_dertlv_output';
const PRIMITIVE = '1';
const CONSTRUCTED = '2';

const TAG = 'tag';
const LENGTH = 'length';
const VALUE = 'value';
const TYPE = 'type';
const NEXT = 'next';

function tlv_convert(button_id){
    if(button_id==tlv_dertlv_button){
        var input = tlv_check_dertlv(document.getElementById(tlv_dertlv_input).value);
        if(input!=""){
            document.getElementById(tlv_dertlv_output).value = tlv_decode_dertlv(input);
        }
    }
}

//check function
function tlv_check_dertlv(input){
    var output = input.replace(/\s/g,'');
    output = output.toUpperCase();    
    for(var i =0;i<output.length;i++){
        if(! ((output[i] >= '0' && output[i]<='9') || (output[i]>='A' && output[i]<='F') )){
            alert('TLV Value must hexadecimal')
            return "";
        }
    }
    return output;
} 

function tlv_decode_dertlv(input){
    
    var tlv;

    //get root tag
    var rootTag = tlv_getTag(input);
    
    
    //check tag type
    if(tlv_getTagType(rootTag)==PRIMITIVE){
        tlv = tlv_decode_dertlv_primitive(rootTag,input);
    }
}

function tlv_decode_dertlv_constructed(tag,input){

}

function tlv_decode_dertlv_primitive(tag,input){
    
    var lenInHex = tlv_getLength(tag,input);
    var valInHex = tlv_getValue(tag,lenInHex,input);
    return {TAG:tag,LENGTH:lenInHex,VALUE:valInHex,TYPE:PRIMITIVE,NEXT:null};
}

function tlv_getTag(input){

    var tagInHex = input.substr(0,2);
    var tagInBin = parseInt(tagInHex,16).toString(2);

    //check byte b5-b1
    if(tagInBin.substr(3)='11111'){
        //two byte tag
        tagInHex = input.substr(0,4);
    }

    return tagInHex;

}


function tlv_getLength(tag,input){
    var buffer = input.substr(tag.length);

    //get first byte
    var lenInHex;
    var tempLenInHex = buffer.substr(0,2);
    switch(tempLenInHex){
        case '82':  lenInHex = buffer.substr(0,6);
                    break;
        case '81':  lenInHex = buffer.substr(0,4);
                    break;    
        default :   lenInHex = tempLenInHex;
                    break;
    }
    return lenInHex;
}

function tlv_getValue(tag,length,input){
    var buffer = input.substr(tag.length + length.length);
    var lenInInt = tlv_getLengthInt(length);
    if(buffer.length/2 != lenInInt){
        throw "Invalid data length";
    }
    return buffer;
    
}


function tlv_getTagType(tag){
    var tagInBin = parseInt(tag,16).toString(2);
    return tagInBin[2];
}

function tlv_getLengthInt(length){
    var firstByte = length.substr(0,2);
    var lenInInt;
    switch(firstByte){
        case '82':  lenInInt = parseInt(length.substr(2),16);
                    break;
        case '81':  lenInInt = parseInt(length.substr(2),16);
                    break;
        default  :  length = parseInt(length,16);
                    break;
    }
    return lenInInt;
}