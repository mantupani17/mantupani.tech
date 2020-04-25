(function(window , covid_apis, $){

    // run evry minute
    setInterval(runDataAPI , 60000);
    
    var covid_jobs = {
        allData: [],
        allDistrictData:[]
    }

    // run all data api
    function runDataAPI(){
        $.ajax({
            url:covid_apis.dataApi,
            type:'GET',
            success: function(data){
                setInLocal('allData', data);
            },
            async: false
        });
        runDisstrictDataAPI();
    }

    // run all districts data
    function runDisstrictDataAPI(){
        $.ajax({
            url:covid_apis.state_district_api,
            type:'GET',
            success: function(data){
                setInLocal('allDistrictData', data);
            },
            async: false
        });
    }


    function setInLocal(item, data){
        if(localStorage.getItem(item)){
            localStorage.removeItem(item);
            localStorage.setItem(item , JSON.stringify(data));
            covid_jobs[item] = JSON.parse(localStorage.getItem(item));
        }else{
            localStorage.setItem(item , JSON.stringify(data));
            covid_jobs[item] = JSON.parse(localStorage.getItem(item));
        }
    }


    if(!localStorage.getItem('allData') || !localStorage.getItem('allDistrictData')){
        runDataAPI();
        runDisstrictDataAPI();
    }else{
        covid_jobs.allData = JSON.parse(localStorage.getItem('allData'));
        covid_jobs.allDistrictData = JSON.parse(localStorage.getItem('allDistrictData'));
    }
    
    covid_jobs['reloadDataApi'] = runDataAPI;
    // console.log(covid_jobs)
    window['covid_jobs'] = covid_jobs;
})(window , covid_apis, $);