(function(win) {
      $('#container').highcharts({
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'Email & Chat Overview'
              },
              xAxis: {
                  categories: [
                      'Company 1',
                      'Company 2',
                      'Company 3',
                      'Company 4'
                  ]
              },
              yAxis: [{
                  min: 0,
                  title: {
                      text: 'Email Units'
                  }
              }, {
                  title: {
                      text: 'Chat Units'
                  },
                  opposite: true
              }],
              legend: {
                  shadow: false
              },
              tooltip: {
                  shared: true
              },
              plotOptions: {
                  column: {
                      grouping: false,
                      shadow: false,
                      borderWidth: 0
                  }
              },
              series: [{
                  name: 'Average Email (Daily)',
                  color: 'rgba(165,170,217,1)',
                  data: [400, 830, 1220, 630],
                  pointPadding: 0.3,
                  pointPlacement: -0.2
              }, {
                  name: 'Email Today',
                  color: 'rgba(126,86,134,.9)',
                  data: [360, 950, 770, 450],
                  pointPadding: 0.4,
                  pointPlacement: -0.2
              }, {
                  name: 'Average Chat (Daily)',
                  color: 'rgba(248,161,63,1)',
                  data: [850, 1788, 1985, 1300],
                  pointPadding: 0.3,
                  pointPlacement: 0.2,
                  yAxis: 1
              }, {
                  name: 'Chats Today',
                  color: 'rgba(186,60,61,.9)',
                  data: [796, 1888, 1685, 1450],
                  pointPadding: 0.4,
                  pointPlacement: 0.2,
                  yAxis: 1
              }]
          });
})(window);