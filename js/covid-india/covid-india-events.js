(function(document ,window, $){
    
    var covid_events = {};
    function CustomEvents(){
        this.customElement = '';
        this.customEvent = '';
        
        this.initializeCustomEvent = function(element, eventName , properties){
            this.customElement = element;
            this.customEvent = eventName;
            this.setCustomEvent();
            this.dispatchCustomEvent(properties);
        }

        this.setCustomEvent = function(){
            this.customElement = document.getElementById(this.customElement);
            this.customElement.addEventListener(this.customEvent , this.triggerHandler)
        }

        this.triggerHandler = function(e){
            switch(e.type){
                case 'changeColor':
                    changeColorHandler(e);
                    break;
            }
        }

        this.dispatchCustomEvent = function(properties){
            const event = new CustomEvent(this.customEvent, {
                detail:properties
            });
            this.customElement.dispatchEvent(event)
        }

        function changeColorHandler(e){
            this.covid_events.CustomEvents.customElement.style.backgroundColor = e.detail.backgroundColor;
            this.covid_events.CustomEvents.customElement.style.color = e.detail.color;
        }
        
    }

    covid_events['CustomEvents'] = new CustomEvents();
    window['covid_events'] = covid_events;
})(document , window, $)