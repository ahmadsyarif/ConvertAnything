const TLV_BUTTON = 'tlv_dertlv_button';
const TLV_INPUT = 'tlv_dertlv_input';
const TLV_OUTPUT = 'tlv_dertlv_output';
const PRIMITIVE = '0';
const CONSTRUCTED = '1';

const TAG = 'TAG';
const LENGTH = 'LENGTH';
const VALUE = 'VALUE';
const TYPE = 'TYPE';
const NEXT = 'NEXT';

const TAB = "    ";

function tlv_convert(button_id){
    if(button_id==TLV_BUTTON){
        var input = tlv_check_dertlv(document.getElementById(TLV_INPUT).value);
        if(input!=""){
            document.getElementById(TLV_OUTPUT).value = tlv_decode_dertlv(input);
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
    else{
        tlv = tlv_decode_dertlv_constructed(rootTag,input);
    }

    return tlv_printTLV(tlv,0);
}

function tlv_printTLV(tlv,depth){
    //build the tab
    var output;
    var space = "";
    for(var i =0;i<depth;i++){
        space = space + depth;
    }
    
    //add the tag
    output = space + tlv.TAG;
    
    //add tje length
    output = output + ' ' + tlv.LENGTH;

    //add the value
    if(tlv.TYPE == PRIMITIVE){
        output = output + ' ' + tlv.VALUE;
    }
    else{
        output = output + '\n' + tlv_printTLV(tlv.VALUE,depth+1);
        
    }
    while(tlv.NEXT!=null){
        tlv = tlv.NEXT;
        output = output +'\n' + tlv_printTLV(tlv,depth);
    }

    return output;
    
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
    tagInBin = "00000000".substr(0,8-tagInBin.length) + tagInBin;

    //check byte b5-b1
    if(tagInBin.substr(3)=='11111'){
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
    tagInBin = "00000000".substr(0,8-tagInBin.length) + tagInBin;
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
        default  :  lenInInt = parseInt(length,16);
                    break;
    }
    return lenInInt;
}

