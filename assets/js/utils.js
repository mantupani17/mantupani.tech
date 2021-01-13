(function (){
    var utils = {
        calculateAge: function (){
            var d = '11-05-1991';
            var dateInString = '11th may 1991';
            var currentDate = new Date();
            var dob = new Date(d);
            // To calculate the time difference of two dates
            var Difference_In_Time = currentDate.getTime() - dob.getTime(); 
            // To calculate the no. of days between two dates
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            var age = Difference_In_Days / 365;
            var myDob = document.getElementsByTagName('my-dob')[0];
            var myAge = document.getElementsByTagName('my-age')[0];
            myDob.innerHTML = dateInString;
            myAge.innerHTML = Math.round(age);
        }
    }
    window.utils = utils;
})(document, window);