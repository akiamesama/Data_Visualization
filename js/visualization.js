(function(win) {

  neo4JNetwork();

  $( "#mailSubmit" ).click(function() {
    var startDate = $( "#networkStart" ).val();
    var endDate = $( "#networkEnd" ).val();
    
    if (startDate == "" || endDate == "") {
      alert("please pick a range of Dates");
    } else {
      startDate = startDate.replace(/-/g, "");
      endDate = endDate.replace(/-/g, "");
      neo4JNetwork(startDate,endDate);
    }      
  });

})(window);

function neo4JNetRange(range){
  alert("ok");
}

function neo4JNetwork(startDate,endDate){
  var username = "neo4j";
  var password = "connectwith";
  var ecdPass = window.btoa(username+":"+password);
  var auth = "Basic "+ ecdPass
  var neo4Jurl = "http://52.20.59.19:7474/db/data/transaction/commit";
  var statementNet;
  if (startDate == null || endDate == null ) {
    statementNet = "match path = (a)-[r]-(b) return path";
  } else {
    statementNet = "match path = (a)-[r]-(b) where toInt(r.timestamp)>="+startDate+" and toInt(r.timestamp)<="+endDate+" return path";
  } 
  
  var post_data_Net = {"statements":[{"statement":statementNet,"resultDataContents":["graph"]}]}

  $.ajax({
      type:"POST",//headers: {"Authorization": auth},
      accept: "application/json",
      contentType:"application/json; charset=utf-8",
      url: neo4Jurl,
      data: JSON.stringify(post_data_Net),
      success: function(data, textStatus, jqXHR){
                        drawNetwork(neo4J_visNetwork(data));
                        },
      error:function(jqXHR, textStatus, errorThrown){
                        alert(errorThrown);
                        }
    });
}

function neo4JTopContacts(name){
  var username = "neo4j";
  var password = "connectwith";
  var ecdPass = window.btoa(username+":"+password);
  var auth = "Basic "+ ecdPass
  var neo4Jurl = "http://52.20.59.19:7474/db/data/transaction/commit";
  var statementNet="match (a)-[r]-(b)where a.name='"+name+"' return b.name as name,sum(toInt(r.frequency))as mail_mnt order by mail_mnt desc limit 3";
  
  var post_data_Net = {"statements":[{"statement":statementNet,"resultDataContents":["row"]}]}

  $.ajax({
      type:"POST",//headers: {"Authorization": auth},
      accept: "application/json",
      contentType:"application/json; charset=utf-8",
      url: neo4Jurl,
      data: JSON.stringify(post_data_Net),
      success: function(data, textStatus, jqXHR){
                        neo4J_visContact(data);
                        },
      error:function(jqXHR, textStatus, errorThrown){
                        alert(errorThrown);
                        }
    });
}

function idIndex(a,id) {
    for (var i=0;i<a.length;i++) 
    {if (a[i].id == id) return i;}
      return null;
}

function neo4J_visNetwork(data){
    //Creating graph object
    var nodes=[], links=[];
    if (data.results[0] == null) {
      alert("we are terribly sorry for not finding the proper information, please click ok to return to initial information");
    } else {
      data.results[0].data.forEach(function (row) {
        row.graph.nodes.forEach(function (n) 
        {
          if (idIndex(nodes,n.id) == null)
              nodes.push({id:n.id,name:n.properties.name,group:n.properties.group,email:n.properties.numOfEmails
                      ,chat:n.properties.numOfChats});
        });
        links = links.concat( row.graph.relationships.map(function(r) {
        return {source:idIndex(nodes,r.startNode),target:idIndex(nodes,r.endNode),value:r.properties.frequency};
        }));
      });
      graph = {nodes:nodes, links:links};
      return graph;
    }    
}

function neo4J_visContact(data){
    //Creating graph object
    var outer_data=[],inner_data={},rowNum=0;
    data.results[0].data.forEach(function (row) {
      col = 0; 
      data.results[0].columns.forEach(function (column){
          inner_data[column]=(row.row[col]);
          col = col+1;  
      });
      outer_data = outer_data.concat(inner_data);
      inner_data ={};
    });
    //return outer_data;
    var listTxt="";
    outer_data.forEach(function (list){
      listTxt = listTxt + "<li>"+list.name+"</li>";
    });
    $('#topContact').html(listTxt);
}

function drawNetwork(graph){
  $('#svgplugin').empty();
  $('#rightOne').hide();
  var width = 900,
      height = 700;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(240)
      .size([width, height]);

  var svg = d3.select("#svgplugin").append("svg")
      .attr("width", width)
      .attr("height", height);

  //d3.json(result, function(error, graph) { //"miserables.json"
    //if (error) throw error;

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
        .attr("r", 8)
        .style("fill", function(d) { return color(d.group); })
        .on("mouseover", function(d,i){
          d3.select(this).style("fill", "black");
          d3.select(this)
          .transition()
          .duration(200)
          .attr("r",10);
          var g = "Team "+(d.group+1);
          var txt = "<p> Name: "+d.name+"</p><p> Team: "+g+"</p><p> Email Amount: "+d.email+"</p><p> Chat Amount: "+d.chat+"</p>";
          $('#detail').html(txt);
          $('#detailName').html("Name: "+d.name);
          $('#detailTeam').html("Team: "+g);
          $('#detailEmail').html("Email Amount: "+d.email);
          $('#detailChat').html("Chat Amount: "+d.chat);
          neo4JTopContacts(d.name);
          // var txt2 = "<a href='#"+d.name+"'class='portfolio-link' data-toggle='modal'> Detail About this person </a>";
          var txt2 = "<a href='#detailPage'class='portfolio-link' data-toggle='modal'> Detail About this person </a>";
          $('#detailLink').html(txt2);
          $("#rightOne").show();
        })
        .on("mouseout", function(d,i){
          d3.select(this)
          .style("fill", function(d) { return color(d.group); })
          d3.select(this)
          .transition()
          .duration(200)
          .attr("r",8);
        })
        .on("mousedown", function(d,i){
          d3.select(this)
          .style("fill", "red");
          d3.select(this)
          .transition()
          .duration(100)
          .attr("r",8);
        })
        .on("mouseup", function(d,i){
          d3.select(this)
          .style("fill", "black");
          d3.select(this)
          .transition()
          .duration(100)
          .attr("r",10);
        })
        .on("click", function(d,i){
          console.log("hi");
          d3.select(this)
          .style("fill", "black");
          d3.select(this)
          .transition()
          .duration(100)
          .attr("r",10);
          var newLink = document.createElement('a');
          $(newLink).attr("href","#detailPage").attr('class','portfolio-link').attr('data-toggle','modal').attr('id','newLink');
          $('#rightOne').append(newLink);
          $('#newLink').click();
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
  //});
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

  $("#hichartSubmit").click(function(){
    console.log("From: "+$("#hichartFrom")[0].value);
    console.log("To: "+$("#hichartTo")[0].value);
  })
 }