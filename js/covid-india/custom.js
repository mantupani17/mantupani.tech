(function(window , document, $){
    var customs = {
        toUcFirst : function(string){
            if(string){
                return string.replace(string.substring(0,1),string.charAt(0).toUpperCase())
            }
        }
    }
    window['covid_utils'] = customs;
})(window , document, $)