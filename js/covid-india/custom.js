(function(window , document, $){
    var customs = {
        toUcFirst : function(string){
            if(string){
                return string.replace(string.substring(0,1),string.charAt(0).toUpperCase())
            }
        },

    }

    console.logPersonalDetails = function(data){
        if(data && typeof data == 'object'){
            this.log(data);
        }else {
            this.error('The entered data is not an object.')
        }
    }
    // testing call back

    function checkLogin(name, callbackFn){
        if(name){
            if(name == "Alice"){
                callbackFn(null , [{ name:name , age:25, status:"SUCCESS"}, { name:name , age:26, status:"SUCCESS"},{ name:name , age:27, status:"SUCCESS"}]);
            }
            else {
                callbackFn(null , { name:'' , age:'', status:"FAILED"});
            }
        }else{
            callbackFn(new Error("No name is there"));
        }
    }

    checkLogin("Alice", function(err, ...data){
        if(err){
            console.log(err)
        }
        console.logPersonalDetails(data)
        if(data.status === 'SUCCESS'){
            console.log('Logged in successfuly...')
        }else{
            console.log('Unauthorised access...')
        }
    });
      

    // function callBack(){
    //     return function x(){
    //         var x = {data:"x"}
    //         console.log(x);
    //     }
    // } 4267 33745     

    // var x = callBack()();
    // x();
    window['covid_utils'] = customs;
})(window , document, $)