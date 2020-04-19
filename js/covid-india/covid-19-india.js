(function(window , covid_apis, covid_jobs, covid_utils, $){
    var totalRecoverd = 0;
    var totalDeath = 0 ;
    var totalActiveCases = 0;
    var totalCases = 0;
    var allStates = [];

    var covid_india = {
        totalCountData: [],
        data:[],
    }

    // State all information
    function StateInformation(){
        this.allStateInfo = [];

        this.init = function(){
            covid_india.data = covid_jobs.allData;
            this.allStateInfo = covid_jobs.allData;
            covid_india.totalCountData = covid_jobs.allData.statewise;
            this.getTotalCounts('Total');
        }

        this.getTotalActiveCases = function(){
            return totalActiveCases;
        }

        this.getTotalCounts = function(state){
            if(covid_india.totalCountData[0].state == state){
                if(covid_india.totalCountData[0].confirmed){
                    totalCases = covid_india.totalCountData[0].confirmed;
                }
                if(covid_india.totalCountData[0].recovered){
                    totalRecoverd = covid_india.totalCountData[0].recovered;
                }
                if(covid_india.totalCountData[0].active){
                    totalActiveCases = covid_india.totalCountData[0].active;
                }
                if(covid_india.totalCountData[0].deaths){
                    totalDeath = covid_india.totalCountData[0].deaths;
                }
            }
        }

        this.getTotalRecoveredCases = function(){
            return totalRecoverd;
        }

        this.getTotalDeaths = function(){
            return totalDeath;
        }

        this.getTotalCases = function(){
            return totalCases;
        }

        this.getAllStates = function(state){
            state = state || "";
            allStates = [];
            if(state){
                var myRe = new RegExp(state, 'g');
                for (let index =  1; index < covid_india.totalCountData.length; index++) {
                    if(myRe.exec(covid_india.totalCountData[index].state.toLowerCase())){
                        var obj = {
                            state:covid_india.totalCountData[index].state,
                            index: index
                        }
                        allStates.push(obj);
                    }
                }
            }else{
                for (let index =  1; index < covid_india.totalCountData.length; index++) {
                    allStates.push(covid_india.totalCountData[index].state);
                }
            }
            return allStates;
        }

        this.getStateInformation = function(index , state){
            var stateInfo = {};
            if(index && covid_india.totalCountData[index] &&  covid_india.totalCountData[index].state && covid_india.totalCountData[index].state.toLowerCase() == state ){
                stateInfo = covid_india.totalCountData[index]
            }
            return stateInfo;
        }

    }

    


    // district information data
    function DistrictInformation(){
        this.allDistrictInfo = {};
        this.init = function(){
            var that = this;
            that.allDistrictInfo = covid_jobs.allDistrictData;
        }

        this.getAllDistrictData = function(){
            return this.allDistrictInfo;
        }

        this.getDistrictInformationByState = function(state){
            state = state || "";
            return this.allDistrictInfo[state];
        }

        this.getStateDistrictInformation = function(state, district){
            if(this.allDistrictInfo[state].districtData[covid_utils.toUcFirst(district)]){
                return this.allDistrictInfo[state].districtData[covid_utils.toUcFirst(district)];
            }
        }

    }

    function PrepareChartData(){
        this.chartData = [];
        this.lineChartData = [];
        this.init = function(){
            this.chartData = covid_india.totalCountData;
            this.lineChartData = covid_india.data.cases_time_series;
        }

        this.prepareBarChartData = function(mostCases){
            var labels = [];
            var datasets = [
                {
                    label:"Confirmed Cases",
                    data:[],
                    borderWidth: 1,
                    backgroundColor:"blue"
                },
                {
                    label:"Active Cases",
                    data:[],
                    borderWidth: 1,
                    backgroundColor:"yellow"
                },
                {
                    label:"Recovered",
                    data:[],
                    borderWidth: 1,
                    backgroundColor:"green"
                },
                {
                    label:"Deaths",
                    data:[],
                    borderWidth: 1,
                    backgroundColor:"red"
                }
            ];
            for (const key in this.chartData ) {
                if (this.chartData.hasOwnProperty(key)) {
                    if(this.chartData[key].state != 'Total'){
                        const element = this.chartData[key];
                        if(parseInt(element.confirmed) > mostCases)
                            labels.push(element.state);
                            for (const key1 in element) {
                                if (element.hasOwnProperty(key1)) {
                                    const element1 = element[key1];
                                    switch(key1){
                                        case "confirmed" : 
                                            datasets[0].data.push(element1);
                                            break;
                                        case "active" :
                                            datasets[1].data.push(element1);
                                            break;
                                        case "recovered" : 
                                            datasets[2].data.push(element1)
                                            break;
                                        case "deaths" : 
                                            datasets[3].data.push(element1)
                                            break;
                                    }
                                }
                            }
                    }
                }
            }
            var data = {
                labels: labels,
                datasets:datasets
            };
            
              //options
              var options = {
                responsive: true,
                title: {
                  display: true,
                  position: "top",
                  text: "Most cities above "+mostCases+" confirmed cases",
                  fontSize: 18,
                  fontColor: "#111"
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      min: 10
                    }
                  }]
                }
              };

              return {type:"bar" ,data:data, options:options};
               
        }

        this.prepreLineChartData = function(month , type){
            var labels = [];
            var datasets = [
                {
                    label: month+" All "+type,
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                }
            ];

            for (const key in this.lineChartData) {
                if (this.lineChartData.hasOwnProperty(key)) {
                    const element = this.lineChartData[key];
                    const date = element.date.split(" ")
                    if(date[1].toLowerCase() == month.toLowerCase() ){
                        labels.push(element.date);
                        datasets[0].data.push(parseInt(element[type]));
                    }
                    
                }
            }

            var data = {
                labels: labels,
                datasets:datasets
            };
            
              //options
              var options = {
                responsive: true,
                title: {
                  display: true,
                  position: "top",
                  text: "cases in the month "+month,
                  fontSize: 18,
                  fontColor: "#111"
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      min: 10
                    }
                  }]
                }
              };

              return {type:"line" ,data:data, options:options};

            console.log(labels)
        } 
        
    }


    covid_india['StateInformation'] = new StateInformation(); 
    covid_india['StateInformation'].init();
    covid_india['DistrictInformation'] = new DistrictInformation();
    covid_india['DistrictInformation'].init();
    covid_india['PrepareChartData'] = new PrepareChartData();
    covid_india['PrepareChartData'].init();
    console.log(covid_india)
    window['covid_india'] = covid_india;
})(window , covid_apis, covid_jobs, covid_utils, $)