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
                      'eBiz Consultants',
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
                  data: [57, 63, 35, 24],
                  pointPadding: 0.3,
                  pointPlacement: -0.2
              }, {
                  name: 'Latest Email Amount',
                  color: 'rgba(126,86,134,.9)',
                  data: [226, 70, 29, 37],
                  pointPadding: 0.4,
                  pointPlacement: -0.2
              }, {
                  name: 'Average Chat (Daily)',
                  color: 'rgba(248,161,63,1)',
                  data: [105, 88, 106, 120],
                  pointPadding: 0.3,
                  pointPlacement: 0.2,
                  yAxis: 1
              }, {
                  name: 'Latest Chats Amount',
                  color: 'rgba(186,60,61,.9)',
                  data: [301, 102, 98, 102],
                  pointPadding: 0.4,
                  pointPlacement: 0.2,
                  yAxis: 1
              }]
          });
})(window);