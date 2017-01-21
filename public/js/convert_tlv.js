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

function tlv_handler(event,button){
    if(event.keyCode === 13){
         event.preventDefault();
         tlv_convert(button.id);
    }
}

function tlv_convert(button_id){
    if(button_id==TLV_BUTTON){
        var input = tlv_check_dertlv(document.getElementById(TLV_INPUT).value);
        if(input!=""){
            document.getElementById(TLV_OUTPUT).value = tlv_printTLV(tlv_decode_dertlv(input),0,true);
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

/*
 *will decode the hex string into tlv object
 *input : string hex contain tag, length and value
 */
function tlv_decode_dertlv(input){
    if(input==""){
        return null;
    }
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
    return tlv;

}

/**
 *will decode constructed type of tlv
 *tag : the tag of the tlv
 *input : the hex string contains tag, length, and value 
 */
function tlv_decode_dertlv_constructed(tag,input){
    var lenInHex = tlv_getLength(tag,input);
    var bufferNext = tlv_getNext(tag,lenInHex,input);
    return {TAG:tag,LENGTH:lenInHex,VALUE:tlv_decode_dertlv(bufferNext),TYPE:PRIMITIVE,NEXT:tlv_decode_dertlv(bufferNext)};
}

/**
 *will decode primitive type of tlv
 *tag : the tag of the tlv
 *input : the hex string contains tag, length, and value 
 */
function tlv_decode_dertlv_primitive(tag,input){
    
    var lenInHex = tlv_getLength(tag,input);
    var bufferNext = tlv_getNext(tag,lenInHex,input);
    var valInHex = tlv_getValue(tag,lenInHex,input,bufferNext);

    return {TAG:tag,LENGTH:lenInHex,VALUE:valInHex,TYPE:PRIMITIVE,NEXT:tlv_decode_dertlv(bufferNext)};
}

function tlv_printTLV(tlv,depth,isRoot){
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
        output = output + '\n' + tlv_printTLV(tlv.VALUE,depth+1,true);
        
    }
    if(isRoot){
        while(tlv.NEXT!=null){
            tlv = tlv.NEXT;
            output = output +'\n' + tlv_printTLV(tlv,depth,false);
        }
    }
    

    return output;  
    
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

function tlv_getValue(tag,length,input,next){
    var buffer = input.substr(tag.length + length.length);
    var lenInInt = tlv_getLengthInt(length);
    if(next==""){
        if(buffer.length/2 != lenInInt){
            throw "Invalid data length";
        }
    }
    else{
        return buffer.substr(0,length*2);
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

function tlv_getNext(tag,length,input){
    var buffer = input.substr(tag.length + length.length);
    var lenInInt = tlv_getLengthInt(length);
    if(buffer.length/2 > lenInInt+2){
        return buffer.substr(lenInInt*2);
    }
    return "";
}


