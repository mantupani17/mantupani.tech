(function(window, covid_events, $){
    var elem = document.querySelector('.make-red');
    var event = new CustomEvent('make-bg-red');
    // Listen for the event.
    elem.addEventListener('make-bg-red', function (e) { 
        e.target.style.background = "red";
        // for()
    }, false);

    // Dispatch the event.
    elem.dispatchEvent(event);
})(window, covid_events, $)