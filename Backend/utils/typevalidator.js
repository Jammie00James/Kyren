function validateType(value, type) {
    if(typeof value != type){
        return 1;
    }
}


module.exports = validateType