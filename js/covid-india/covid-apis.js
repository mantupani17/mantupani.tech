(function(window , document, $){
    var api = {
        dataApi: 'https://api.covid19india.org/data.json',
        state_district_api:'https://api.covid19india.org/state_district_wise.json',
        state_daily:'https://api.covid19india.org/states_daily.json',
        state_test:'https://api.covid19india.org/state_test_data.json',
        logs_api:'https://api.covid19india.org/updatelog/log.json'
    }
    window['covid_apis'] = api;
})(window , document, $)