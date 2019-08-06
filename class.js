

function Class() {

    var privateField = "private"

    function privateFunction() {

        return privateField;
    }

    this.publicField = "public";

    this.publicFunction = function (){

        return privateFunction();
    }
}


var instance = new Class();

// console.log(instance.publicField);
// console.log(instance.publicFunction());

