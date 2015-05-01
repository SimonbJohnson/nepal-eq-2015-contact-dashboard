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

var color = "#E57373";

var orgChart = dc.rowChart('#org-chart');
var teamChart = dc.rowChart('#team-chart');
var incountryChart = dc.pieChart('#incountry-chart');

var cf = crossfilter(data);

var orgDimension = cf.dimension(function(d){ return d['Organisation']; });
var teamDimension = cf.dimension(function(d){ return d['Teams']; });
var incountryDimension = cf.dimension(function(d){ return d['In Country']; });

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
                       return d["Name"]; 
                    },
                    function(d){
                       return d["Organisation"]; 
                    },
                    function(d){
                       return d["Teams"]; 
                    },
                    function(d){
                       return d["In Country"]; 
                    },
                    function(d){
                       return d["Email"]; 
                    },
                    function(d){
                       return d["Mobile"]; 
                    }
                ])
                .sortBy(function(d) {
                        return d["Name"];
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