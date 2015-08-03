(function(win) {
  $('#rightTwo').hide();
  var width = 800,
      height = 500;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(60)
      .size([width, height]);

  var svg = d3.select("#chatsvg").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.json("miserables.json", function(error, graph) {
    if (error) throw error;

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return d.chat/2; })
        .style("fill", function(d) { return color(d.group); })
        .on("mouseover", function(d,i){
          d3.select(this).style("fill", "black");
          var g = "Team "+(d.group+1);
          var txt = "<p> Name: "+d.name+"</p><p> Team: "+g+"</p><p> Chat Amount: "+d.chat+"</p>";
          $('#detail2').html(txt);
          // var txt2 = "<a href='#"+d.name+"'class='portfolio-link' data-toggle='modal'> Detail About this person </a>";
          var txt2 = "<a href='#detailPage'class='portfolio-link' data-toggle='modal'> Detail About this person </a>";
          $('#detailLink2').html(txt2);
          $("#rightTwo").show();
        })
        .on("mouseout", function(d,i){
          d3.select(this)
          .style("fill", function(d) { return color(d.group); })
        })
        .on("mousedown", function(d,i){
          d3.select(this)
          .style("fill", "red");
        })
        .on("mouseup", function(d,i){
          d3.select(this)
          .style("fill", "black");
        })
        .on("click", function(d,i){
          d3.select(this)
          .style("fill", "black");
          var newLink = document.createElement('a');
          $(newLink).attr("href","#detailPage").attr('class','portfolio-link').attr('data-toggle','modal').attr('id','newLink2');
          $('#rightTwo').append(newLink);
          $('#newLink2').click();
        })
        .call(force.drag);

    node.append("title")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });
  });
  $(".node").bind("click", function(){
    console.log("click the node");
  });
  $(function () {
      $('#container1').highcharts({
          chart: {
              type: 'area'
          },
          title: {
              text: 'Daily Amount of Email and Chat for Company 1'
          },
          xAxis: {
              categories: ['7.22', '7.23', '7.24', '7.25', '7.26', '7.27', '7.28', '7.29', '7.30', '7.31'],
              tickmarkPlacement: 'on',
              title: {
                  enabled: false
              }
          },
          yAxis: [{
            title: {
              text: 'Email Units'
            }
          },{
            title:{
              text: 'Chat Units'
            },
            opposite: true
          }],
          tooltip: {
              shared: true,
          },
          plotOptions: {
              area: {
                  stacking: 'normal',
                  lineColor: '#666666',
                  lineWidth: 1,
                  marker: {
                      lineWidth: 1,
                      lineColor: '#666666'
                  }
              }
          },
          series: [{
            name: 'Chat',
            data: [888, 920, 810, 760, 850, 820, 750, 768, 830, 796],
            yAxis: 1
          }, {
            name: 'Email',
            data: [370, 410, 388, 407, 305, 450, 433, 412, 403, 360],
          }]
      });
  });
})(window);