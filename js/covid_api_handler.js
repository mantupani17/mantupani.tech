$(document).ready(function(){
    
    var myStorage = window.localStorage;
    
    function getCovidDataAndSaveInLocal(){
        var covidData = myStorage.getItem('covidData');
        if(covidData){
            myStorage.removeItem('covidData');
            $.ajax({
                type:"GET",
                url:"http://mantupani.tech/covid_api_request.php",
                success: function(data){
                    if(data){
                        data = JSON.parse(data);
                        if(data.statusCode == 200){
                            covidData = data.data.covid19Stats;
                            myStorage.setItem('covidData',JSON.stringify(covidData));
                            renderCovidData('');
                            covidSummary();
                        }
                    }
                }
            });
        }else{
            $.ajax({
                type:"GET",
                url:"http://mantupani.tech/covid_api_request.php",
                success: function(data){
                    if(data){
                        data = JSON.parse(data);
                        if(data.statusCode == 200){
                            covidData = data.data.covid19Stats;
                            myStorage.setItem('covidData',JSON.stringify(covidData));
                            renderCovidData('');
                            covidSummary();
                        }
                    }
                }
            });
        }
        
    }
    
    // render all data
    function renderCovidData(search){
        covidData = myStorage.getItem('covidData');
        covidData = JSON.parse(covidData);
        if(covidData){
            $('#covid_list_table').DataTable({
                "bProcessing": true,
                "aaData": covidData,
                "aoColumns": [
                    { "mData" : "city" },
                    { "mData" : "province" },
                    { "mData" : "country" },
                    { "mData" : 'lastUpdate' },
                    { "mData" : 'confirmed' },
                    { "mData" : 'recovered' },
                    { "mData" : 'deaths' }
                ]
            });
        }
    }
    
    // render country data
    function renderCountryData(){
        var countryData = {};
        covidData = myStorage.getItem('covidData');
        if(covidData){
            covidData = JSON.parse(covidData);
            for(var key in covidData){
                if(countryData.hasOwnProperty(covidData[key].country)){
                    countryData[covidData[key].country].confirmed =  countryData[covidData[key].country].confirmed + covidData[key].confirmed;
                    countryData[covidData[key].country].deaths =  countryData[covidData[key].country].deaths + covidData[key].deaths;
                    countryData[covidData[key].country].recovered =  countryData[covidData[key].country].recovered + covidData[key].recovered;
                }else{
                    var obj = {
                        country:covidData[key].country,
                        confirmed:covidData[key].confirmed,
                        deaths:covidData[key].confirmed,
                        recovered:covidData[key].confirmed
                    }
                    countryData[covidData[key].country] = obj;
                }
            }
            var cData = [] ;
            for(var key1 in countryData){
                if(countryData.hasOwnProperty(key1)){
                    cData.push(countryData[key]);
                }
            }
            console.log(cData);
            $('#covid_list_country_table').DataTable({
                "bProcessing": true,
                "aaData": cData,
                "aoColumns": [
                    { "mData" : "country" },
                    { "mData" : 'confirmed' },
                    { "mData" : 'recovered' },
                    { "mData" : 'deaths' }
                ]
            });
        }
        
        
    }
    
    function covidSummary(){
        var summaryData = {
            confirmed:0,
            deaths:0,
            recovered:0
        };
        covidData = myStorage.getItem('covidData');
        if(covidData){
            covidData = JSON.parse(covidData);
            for(var key in covidData){
                summaryData.confirmed =  summaryData.confirmed + covidData[key].confirmed;
                summaryData.deaths =  summaryData.deaths + covidData[key].deaths;
                summaryData.recovered =  summaryData.recovered + covidData[key].recovered;
            }
        }
        $('confirmed').html(summaryData.confirmed);
        $('recovered').html(summaryData.recovered);
        $('deaths').html(summaryData.deaths);
    }
    
    
    $('button' , '#actions-btn').on('click' , function(e){
        var val = $(this).val();
        if(val == 'All'){
            $('#covid_list_table').css('display' , 'block');
            $('#covid_list_country_table').css('display' , 'none');
            $('#covid_list_table_wrapper').css('display' , 'block');
            $('#covid_list_country_table_wrapper').css('display' , 'none');
        }else if(val == 'Country'){
            renderCountryData();
            $('#covid_list_table').css('display' , 'none');
            $('#covid_list_table_wrapper').css('display' , 'none');
            $('#covid_list_country_table').css('display' , 'block');
            $('#covid_list_country_table_wrapper').css('display' , 'block');
        }else if(val == 'City'){
            renderCovidData();
            $('#covid_list_table').css('display' , 'block');
            $('#covid_list_country_table').css('display' , 'none');
            $('#covid_list_table_wrapper').css('display' , 'block');
            $('#covid_list_country_table_wrapper').css('display' , 'none');
        }
    })
    
    
    // getCovidData('');
    
    getCovidDataAndSaveInLocal();
    // after 1 minute call the method
    // setInterval(getCovidDataAndSaveInLocal, 60*1000);
    
})