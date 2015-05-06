function downloadData(data){
    var csvContent = 'data:text/csv;charset=utf-8,';
    for (var key in data[0]){
        csvContent += key+",";
    }
    csvContent += '\n';
    data.forEach(function(e, index){
        for (var key in e){
            csvContent += e[key]+",";
        }
        csvContent += '\n';
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute("id","data-download-csv");
    $('#header').append(link);
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Contact_list.csv");
    link.click();
    link.parentNode.removeChild(link);
}

function sheetLoaded(sheetData){
    console.log(sheetData);
    initDashboard(sheetData.feed.entry.slice(1,sheetData.feed.entry.length));
}

function initDashboard(data){
    console.log(data);
    var color = "#E57373";

    var orgChart = dc.rowChart('#org-chart');
    var teamChart = dc.rowChart('#team-chart');
    var incountryChart = dc.pieChart('#incountry-chart');

    var cf = crossfilter(data);

    var orgDimension = cf.dimension(function(d){
        if(typeof d['gsx$keyfields']!=='undefined'){
            return d['gsx$keyfields'].$t;
        } else {
            return "No Data";
        }
    });
    var teamDimension = cf.dimension(function(d){
        console.log(d['gsx$_clrrx']);
        if(typeof d['gsx$_clrrx']!=='undefined'){
            return d['gsx$_clrrx'].$t;
        } else {
            return "No Data";
        }
    });
    var incountryDimension = cf.dimension(function(d){
        if(typeof d['gsx$_cre1l']!=='undefined'){
            return d['gsx$_cre1l'].$t;
        } else {
            return "No Data";
        }
    });

    var orgGroup = orgDimension.group();
    var teamGroup = teamDimension.group();
    var incountryGroup = incountryDimension.group();

    var all = cf.groupAll();

    orgChart.width($('#org-chart').width()).height(400)
                .dimension(orgDimension)
                .group(orgGroup)
                .elasticX(true)
                .data(function(group) {
                    return group.top(20);
                })
                .labelOffsetY(10)
                .colors([color])
                .colorAccessor(function(d, i){return 0;})
                .xAxis().ticks(5);

    teamChart.width($('#team-chart').width()).height(400)
                .dimension(teamDimension)
                .group(teamGroup)
                .elasticX(true)
                .data(function(group) {
                    return group.top(20);
                })
                .labelOffsetY(13)
                .colors([color])
                .colorAccessor(function(d, i){return 0;})
                .xAxis().ticks(5);

    incountryChart.width($('#incountry-chart').width()).height(400)
                .dimension(incountryDimension)
                .group(incountryGroup)
                .colors(['#FFD600','#4CAF50'])
                .colorDomain([0,1])
                .colorAccessor(function(d, i){return i;}); 

    dc.dataCount('#count-info')
                .dimension(cf)
                .group(all);

    dc.dataTable("#data-table")
                    .dimension(orgDimension)                
                    .group(function (d) {
                       return 0;
                    })
                    .size(650)
                    .columns([
                        function(d){
                            if(typeof d["gsx$_ciyn3"]!=='undefined'){
                                return d["gsx$_ciyn3"].$t;
                            } else {
                                return "No Data";
                            }
                        },
                        function(d){
                            if(typeof d["gsx$keyfields"]!=='undefined'){
                                return d["gsx$keyfields"].$t;
                            } else {
                                return "No Data";
                            }
                        },
                        function(d){
                            if(typeof d["gsx$_clrrx"]!=='undefined'){
                                return d["gsx$_clrrx"].$t;
                            } else {
                                return "No Data";
                            }
                        },
                        function(d){
                            if(typeof d["gsx$_cre1l"]!=='undefined'){
                                return d["gsx$_cre1l"].$t;
                            } else {
                                return "No Data";
                            }
                        },
                        function(d){
                            if(typeof d["gsx$_cztg3"]!=='undefined'){
                                return d["gsx$_cztg3"].$t;
                            } else {
                                return "No Data";
                            }
                        },
                        function(d){
                            if(typeof d["gsx$_d180g"]!=='undefined'){
                                return d["gsx$_d180g"].$t;
                            } else {
                                return "No Data";
                            }
                        }                        
                    ])
                    .sortBy(function(d) {
                            return d["gsx$_ciyn3"];
                        })                
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });            

        dc.renderAll();

        var g = d3.selectAll('#org-chart').select('svg').append('g');

        g.append('text')
            .attr('class', 'x-axis-label')
            .attr('text-anchor', 'middle')
            .attr('x', $('#org-chart').width()/2-15)
            .attr('y', 397)
            .text('People');

        var g = d3.selectAll('#team-chart').select('svg').append('g');

        g.append('text')
            .attr('class', 'x-axis-label')
            .attr('text-anchor', 'middle')
            .attr('x', $('#team-chart').width()/2-15)
            .attr('y', 397)
            .text('People');

    $('#download').off().on().click(function(){
        downloadData(orgDimension.top(1000));
    });
}