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
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12']
  var d = new Date();
  var endDate = d.getFullYear()+months[d.getMonth()]+d.getDate();
  d.setDate(d.getDate() - range);
  var startDate = d.getFullYear()+months[d.getMonth()]+d.getDate();
  neo4JNetwork(startDate,endDate);
}

function neo4JNetwork(startDate,endDate){
  var username = "neo4j";
  var password = "connectwith";
  var ecdPass = window.btoa(username+":"+password);
  var auth = "Basic "+ ecdPass
  var neo4Jurl = "http://52.20.59.19:7474/db/data/transaction/commit";
  var statementNet="";
  if (startDate == null || endDate == null ) {
    statementNet = "match path = (a:employee)-[r]-(b:employee) return path";
  } else {
    statementNet = statementNet +"match path = (a:employee)-[r]-(b:employee) ";
    statementNet = statementNet +"where toInt(r.timestamp)>="+startDate+" and toInt(r.timestamp)<="+endDate+" ";
    statementNet = statementNet +"return path";
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

function neo4JMailContacts(name){
  var username = "neo4j";
  var password = "connectwith";
  var ecdPass = window.btoa(username+":"+password);
  var auth = "Basic "+ ecdPass
  var neo4Jurl = "http://52.20.59.19:7474/db/data/transaction/commit";
  var statementNet="match (a:employee)-[r]-(b:employee) where a.name='"+name+"' return b.name as name,sum(toInt(r.frequency))as mail_mnt order by mail_mnt desc limit 3";
  
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
    var nodes=[], links=[], scores=[];
    if (data.results[0] == null) {
      alert("we are terribly sorry for not finding the proper information, please click ok to return to initial information");
    } else {
      data.results[0].data.forEach(function (row) {
        row.graph.nodes.forEach(function (n) 
        {
          if (idIndex(nodes,n.id) == null)
              nodes.push({id:parseInt(n.id),name:n.properties.name,group:parseInt(n.properties.Group)
                          ,email:parseInt(n.properties.numOfEmails),chat:parseInt(n.properties.numOfChats)});
        });
        links = links.concat( row.graph.relationships.map(function(r) {
        return {source:parseInt(idIndex(nodes,r.startNode)),target:parseInt(idIndex(nodes,r.endNode))
                ,value:parseInt(r.properties.frequency)};
        }));
      });
      var n = nodes.length;
    var path = new Array(n);
    for(var i = 0; i < n; i++) {
    	path[i] = new Array(n);
    	for(var j = 0; j < n; j++) {
    		path[i][j] = new Number(0);
    	}
    }
    links.forEach(function (l){
    	path[l.source][l.target] = 1;
    	path[l.target][l.source] = 1;
    })

    var dist = new Array(n);
    var count = new Array(n);

    for(var i = 0; i < n; i++) {
    	dist[i] = new Array(n);
    	count[i] = new Array(n);
    	for(var j = 0; j < n; j++) {
    		dist[i][j] = new Number(Number.MAX_SAFE_INTEGER);
    		count[i][j] = new Number(0);
    	}
    }

    for(var i = 0; i < n; i++) {
    	var visited = new Array(n);
    	for(var t = 0; t < n; t++) {
    		visited[t] = new Number(0);
    	}
    	visited[i] = 1;
    	dist[i][i] = 0;
    	count[i][i] = 1;
    	var queue = [];
    	queue.push(i);
    	while(queue.length > 0) {
    		var size = queue.length;
    		for(var j = 0; j < size; j++) {
    			var cur_city = queue.shift();
    			visited[cur_city] = 1;
    			for(var k = 0; k < n; k++) {
    				if(cur_city != k && path[cur_city][k] == 1) {
    					if(visited[k] == 0) {
								dist[i][k] = dist[i][cur_city] + 1;
								count[i][k] = count[i][cur_city];
								visited[k] = 1;
								queue.push(k);
							} else {
								if(dist[i][k] == dist[i][cur_city] + 1) {
									count[i][k] += count[i][cur_city];
								} else if(dist[i][k] >  dist[i][cur_city] + 1) {
									dist[i][k] = dist[i][cur_city] + 1;
									count[i][k] = count[i][cur_city];
								}
							}
    				}
    			}
    		}
    	}
    }

    var min = new Number(Number.MAX_SAFE_INTEGER);
    var max = new Number(Number.MIN_SAFE_INTEGER);
    for(var i = 0; i < n; i++) {
    	var cur_bc = 0;
    	for(var j = 0; j < n; j++) {
    		if(i == j) {
    			continue;
    		}
    		for(var k = 0; k < n; k++) {
    			if(i == k) {
    				continue;
    			}

    			if(dist[j][k] == dist[j][i] + dist[i][k]) {
    				var all_paths = count[j][k];
    				var paths_throughCur = count[j][i] * count[i][k];
    				cur_bc += paths_throughCur / all_paths;
    			}
    		}
    	}

    	scores[i] = cur_bc;
    	if(min > cur_bc) {
    		min = cur_bc;
    	}
    	if(max < cur_bc) {
    		max = cur_bc;
    	}
    }

    var sizes = [];
    for(var i = 0; i < n; i++) {
    	sizes[i] = (scores[i] - min) / (max - min) * 15 + 5;
    }
    graph = {nodes:nodes, links:links, sizes:sizes};
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
      height = 800;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-500)
      .linkDistance(function(l){
        if(l.source.group == l.target.group) {
          return 50;
        } else {
          return 160;
        }
      })
      // .gravity(0.05)
      // .friction(0.45)
      // .linkStrength(0.6)
      .size([width, height]);


  var svg = d3.select("#svgplugin").append("svg")
      .attr("width", width)
      .attr("height", height);

  //d3.json("miserables.json", function(error, graph) { //"miserables.json"
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
        .attr("r", function(d) {
        	var index = -1;
        	for(var i = 0; i < graph.nodes.length; i++) {
        		if(graph.nodes[i].id == d.id) {
        			index = i;
        			break;
        		}
        	}
        	return graph.sizes[index]; })
        .style("fill", function(d) { return color(d.group); })
        .on("mouseover", function(d,i){
          d3.select(this).style("fill", "black");
          d3.select(this)
          .transition()
          .duration(200)
          .attr("r",function(d) {
        	var index = -1;
        	for(var i = 0; i < graph.nodes.length; i++) {
        		if(graph.nodes[i].id == d.id) {
        			index = i;
        			break;
        		}
        	}
        	return graph.sizes[index]; });
          if (isNaN(d.group)==true){
            var g = "No Team";
          } else {
            var g = (d.group+1);
          }
          
          var txt = "<p> Name: "+d.name+"</p><p> Team: "+g+"</p><p> Email Amount: "+d.email+"</p><p> Chat Amount: "+d.chat+"</p>";
          $('#detail').html(txt);
          $('#detailName').html("Name: "+d.name);
          $('#detailTeam').html("Team: "+g);
          $('#detailEmail').html("Email Amount: "+d.email);
          $('#detailChat').html("Chat Amount: "+d.chat);
          neo4JMailContacts(d.name);
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
          .attr("r",function(d) {
        	var index = -1;
        	for(var i = 0; i < graph.nodes.length; i++) {
        		if(graph.nodes[i].id == d.id) {
        			index = i;
        			break;
        		}
        	}
        	return graph.sizes[index]; });
        })
        .on("mousedown", function(d,i){
          d3.select(this)
          .style("fill", "red");
          d3.select(this)
          .transition()
          .duration(100)
          .attr("r",function(d) {
        	var index = -1;
        	for(var i = 0; i < graph.nodes.length; i++) {
        		if(graph.nodes[i].id == d.id) {
        			index = i;
        			break;
        		}
        	}
        	return graph.sizes[index]; });
        })
        .on("mouseup", function(d,i){
          d3.select(this)
          .style("fill", "black");
          d3.select(this)
          .transition()
          .duration(100)
          .attr("r",function(d) {
        	var index = -1;
        	for(var i = 0; i < graph.nodes.length; i++) {
        		if(graph.nodes[i].id == d.id) {
        			index = i;
        			break;
        		}
        	}
        	return graph.sizes[index]; });
        })
        .on("dblclick", function(d,i){
          console.log("hi");
          d3.select(this)
          .style("fill", "black");
          d3.select(this)
          .transition()
          .duration(100)
          .attr("r",function(d) {
        	var index = -1;
        	for(var i = 0; i < graph.nodes.length; i++) {
        		if(graph.nodes[i].id == d.id) {
        			index = i;
        			break;
        		}
        	}
        	return graph.sizes[index]; });
          var newLink = document.createElement('a');
          $(newLink).attr("href","#detailPage").attr('class','portfolio-link').attr('data-toggle','modal').attr('id','newLink');
          $('#rightOne').append(newLink);
          $('#newLink').click();
        })
        .on('click', connectedNodes) //Added code
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

  //Toggle stores whether the highlighting is on
  var toggle = 0;
  //Create an array logging what is connected to what
  var linkedByIndex = {};
  for (i = 0; i < graph.nodes.length; i++) {
      linkedByIndex[i + "," + i] = 1;
  };
  graph.links.forEach(function (d) {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });
  //This function looks up whether a pair are neighbours
  function neighboring(a, b) {
      return linkedByIndex[a.index + "," + b.index];
  }
  function connectedNodes() {
      if (toggle == 0) {
          //Reduce the opacity of all but the neighbouring nodes
          d = d3.select(this).node().__data__;
          node.style("opacity", function (o) {
              return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
          });
          link.style("opacity", function (o) {
              return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
          });
          //Reduce the op
          toggle = 1;
      } else {
          //Put them back to opacity=1
          node.style("opacity", 1);
          link.style("opacity", 1);
          toggle = 0;
      }
  }

  var optArray = [];
  for (var i = 0; i < graph.nodes.length - 1; i++) {
      optArray.push(graph.nodes[i].name);
  }
  optArray = optArray.sort();
  $(function () {
      $("#chatInput").autocomplete({
          source: optArray
      });
  });

  var optArray = [];
  for (var i = 0; i < graph.nodes.length - 1; i++) {
      optArray.push(graph.nodes[i].name);
  }
  optArray = optArray.sort();
  $(function () {
      $("#emailInput").autocomplete({
          source: optArray
      });
  });

  $("#emailSearch").click(function searchNode() {
      //find the node
      var selectedVal = document.getElementById('emailInput').value;
      var node = svg.selectAll(".node");
      if (selectedVal == "none") {
          node.style("stroke", "white").style("stroke-width", "1");
      } else {
          var selected = node.filter(function (d, i) {
              return d.name != selectedVal;
          });
          selected.style("opacity", "0");
          var link = svg.selectAll(".link")
          link.style("opacity", "0");
          d3.selectAll(".node, .link").transition()
              .duration(5000)
              .style("opacity", 1);
      }
  })

 }
