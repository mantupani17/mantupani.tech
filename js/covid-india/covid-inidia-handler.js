$(document).ready(function(e){
    // confirmed recovered deaths
    $('confirmed').html(covid_india.StateInformation.getTotalActiveCases());
    $('recovered').html(covid_india.StateInformation.getTotalRecoveredCases());
    $('deaths').html(covid_india.StateInformation.getTotalDeaths());
    $('cases').html(covid_india.StateInformation.getTotalCases());
    $('tests').html(covid_india.StateInformation.totalTests());
    

    var CovidTask = {
        renderData: function(state){
            var allStates = covid_india.StateInformation.getAllStates();
            var $el = $('#state-template').text();
            state = state || '';
            if(state){
                allStates = covid_india.StateInformation.getAllStates(state);
            }else{
                $('#table-container').html($el);
            }
            $('tbody', '#covid_list_table_india').html('');
            var html = '';
            for(var i=0; i<allStates.length;i++){
                var index = i+1;
                var stateData = allStates[i]
                if(state){
                    index = allStates[i].index;
                    stateData = allStates[i].state;
                }
                var covidData = covid_india.StateInformation.getStateInformation( index , stateData.toLowerCase());
                html = '<tr>';
                html += '<td>'+(i+1)+'</td>';
                html += '<td><a href="javascript:void(0);" class="view-district-data" data-state="'+covidData.state+'">'+covidData.state+'</a></td>';
                html += '<td>'+covidData.confirmed+'</td>';
                html += '<td id="td-act-'+i+'">'+covidData.active+'</td>';
                html += '<td id="td-rec-'+i+'">'+covidData.recovered+'</td>';
                html += '<td class="make-red" id="td-'+i+'">'+covidData.deaths+'</td>';
                html += '</tr>';
                $('tbody', '#covid_list_table_india').append(html);
                covid_events.CustomEvents.initializeCustomEvent('td-'+i , 'changeColor' ,{backgroundColor:"red", color:'white'}); 
                covid_events.CustomEvents.initializeCustomEvent('td-rec-'+i , 'changeColor' ,{backgroundColor:"green"});                             
                covid_events.CustomEvents.initializeCustomEvent('td-act-'+i , 'changeColor' ,{backgroundColor:"blue"});                             
            }
            this.getAllDistrictData();

            // search
            $('#search_state').on('keyup', function(){
                var state = $(this).val();
                if(state){
                    CovidTask.renderData(state.toString().trim());
                }else{
                    CovidTask.renderData();
                }
            })

            // reload the section
            $('#refresh-data').on('click' , function(e){
                covid_jobs.reloadDataApi();
            })
            
        },

        getAllDistrictData: function(){
            $('.view-district-data').unbind('click').on('click' , function(){
                var state = $(this).data('state');
                var allDistrictData = covid_india['DistrictInformation'].getDistrictInformationByState(state);
                CovidTask.renderAllDistrictData(allDistrictData, state);
            })
        },

        renderAllDistrictData: function(allDistrictData, state, district){
            var $el = $('#district-template').text();
            if(!district){
                $('#table-container').html($el);
            }
            
            $('tbody', '#covid_list_table_india').html('');
            var html = '';
            var i = 1;
            var totalCases = 0;
            for (const key in allDistrictData.districtData) {
                if (allDistrictData.districtData.hasOwnProperty(key)) {
                    const element = allDistrictData.districtData[key];
                    if(element){
                        var confirmed = element.confirmed || 0;
                        html = '<tr>';
                        html += '<td>'+(i++)+'</td>';
                        html += '<td>'+key+'</td>';
                        html += '<td>'+confirmed+'</td>';
                        html += '</tr>';
                        $('tbody', '#covid_list_table_india').append(html);
                        totalCases += parseInt(confirmed);
                    }
                }
            }
            $('tbody', '#covid_list_table_india').append('<tr><td colspan="2" style="text-align: right;">Total Cases:</td><td>'+totalCases+'</td></tr>');
            
            $('#go-back-state').on('click', function(e){
                allStates = covid_india.StateInformation.getAllStates();
                CovidTask.renderData();
                CovidChartTask.loadStateChart();
            });

            $('#search_district').on('keyup', function(){
                var district = $(this).val();
                if(district){
                    var upDistrict = covid_utils.toUcFirst(district);
                    var obj = {};
                    obj[upDistrict] = covid_india['DistrictInformation'].getStateDistrictInformation(state , district);
                    var allDistrictData = {
                        "districtData" : obj
                    }
                    CovidTask.renderAllDistrictData(allDistrictData, state , district)
                }else{
                    var allDistrictData = covid_india['DistrictInformation'].getDistrictInformationByState(state);
                    CovidTask.renderAllDistrictData(allDistrictData, state)
                }
            })
        }
    }

    var CovidChartTask = {
        loadStateChart: function(){
            var mostCases = $('#most-cases').val();
            var data = covid_india.PrepareChartData.prepareBarChartData(mostCases);
            var ctx = $("#bar-chartcanvas-states");
            //  create Chart class object
            var chart = new Chart(ctx, data);
            $('#most-cases').on('change', function(e){
                mostCases = $(this).val();
                data = covid_india.PrepareChartData.prepareBarChartData(mostCases);
                chart = new Chart(ctx, data);
            })

            // handle the select month component
            this.disableAllMothFromCurrent('#month-cases');
            var mCases = $('#month-cases').val();
            var type = $('#type-cases').val();
            var monthdata = covid_india.PrepareChartData.prepreLineChartData(mCases, type);
            var ctxLine = $("#bar-linechart-states");
            var linechart = new Chart(ctxLine, monthdata);
            $('.filter-month').on('change', function(e){
                mCases = $('#month-cases').val();
                type = $('#type-cases').val();
                monthdata = covid_india.PrepareChartData.prepreLineChartData(mCases, type);
                linechart = new Chart(ctxLine, monthdata);
            })

            // tested cases analysis
            this.disableAllMothFromCurrent('#month-tests-cases');
            var mTCases = $('#month-tests-cases').val();
            var monthtestdata = covid_india.PrepareChartData.prepareTestedCasesChartData(mTCases);
            var testCtx = $('#bar-linechart-test-analysis');
            var testLinechart = new Chart(testCtx, monthtestdata);
            $('#month-tests-cases').on('change', function(e){
                mTCases = $(this).val();
                monthtestdata = covid_india.PrepareChartData.prepareTestedCasesChartData(mTCases);
                testLinechart = new Chart(testCtx, monthtestdata);
            })
        },
        
        disableAllMothFromCurrent: function(element){
            var months = $('option',element);
            var currentMonth = new Date().getMonth()+1;
            for (let index = 0; index < months.length; index++) {
                const element = months[index];
                if(index > currentMonth){
                    $(element).attr('disabled' ,true);
                }
            }
        }
    } 


    // Event deligaion
    // document.addEventListener('click', function (event) {

    //     if (event.target.matches('.modal-open')) {
    //         // Run your code to open a modal
    //     }
    
    //     if (event.target.matches('.close')) {
    //         // Run your code to close a modal
    //     }
    
    // }, false);

    var map1 = Immutable.Map({ a: 1, b: 2, c: 3 });
    map1 = map1.set('b', 50);

    console.log(map1.get('b'))
    
    CovidTask.renderData();
    CovidChartTask.loadStateChart();
})