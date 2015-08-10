(function(win) {
  $('#rightTwo').hide();
  var w = 900,
      h = 700,
      r = 650,
      x = d3.scale.linear().range([0, r]),
      y = d3.scale.linear().range([0, r]),
      node,
      root;

  var pack = d3.layout.pack()
      .size([r, r])
      .value(function(d) { return d.size; })

  var vis = d3.select("#chatsvg").insert("svg:svg", "h2")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

  d3.json("chat.json", function(data) {
    node = root = data;

    var nodes = pack.nodes(root);

    vis.selectAll("circle")
        .data(nodes)
      .enter().append("svg:circle")
        .attr("class", function(d) { return d.children ? "parent" : "child"; })
        .attr("id",function(d){ return d.name})
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; })
        .on("click", function(d) {
          if(d.children){
            return zoom(node == d ? root : d); 
          }else{
            var newLink = document.createElement('a');
            $(newLink).attr("href","#detailPage").attr('class','portfolio-link').attr('data-toggle','modal').attr('id','newLink');
            $('#rightOne').append(newLink);
            $('#newLink').click();
          }
        })
        .on("mouseover",function(d){
          if(!d.children){
            var g = "Team "+(d.group+1);
            var txt = "<p> Name: "+d.name+"</p><p> Team: "+g+"</p><p> Chat Amount: "+d.size+"</p>";
            $('#detail2').html(txt);
            // var txt2 = "<a href='#"+d.name+"'class='portfolio-link' data-toggle='modal'> Detail About this person </a>";
            var txt2 = "<a href='#detailPage'class='portfolio-link' data-toggle='modal'> Detail About this person </a>";
            $('#detailLink2').html(txt2);
            $("#rightTwo").show();
          }
        });

    vis.selectAll("text")
        .data(nodes)
      .enter().append("svg:text")
        .attr("class", function(d) { return d.children ? "parent" : "child"; })
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("opacity", function(d) { return d.r > 15 ? 1 : 0; })
        .text(function(d) { return d.name; });

    d3.select(window).on("click", function() { zoom(root); });

    $("#chatSearch").click(function(){
      var reset = $("circle.child");
      for (var i = 0; i < reset.length; i++) {
        reset[i].style.cssText = 'fill: #ccc';
      };
      var search  = $("#chatInput")[0].value;
      var query = "circle#" + search;
      var circle = $(query);
      console.log(circle.length);
      for (var i = 0; i < circle.length; i++) {
        circle[i].style.cssText = 'fill: #ca3333';
      };
    })

    $("#chatReset").click(function(){
      var reset = $("circle.child");
      for (var i = 0; i < reset.length; i++) {
        reset[i].style.cssText = 'fill: #ccc';
      };
      $("#chatInput")[0].value = '';
      $("#rightTwo").hide();
    })
    
  });

  function zoom(d, i) {
    var k = r / d.r / 2;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);

    var t = vis.transition()
        .duration(d3.event.altKey ? 7500 : 750);

    t.selectAll("circle")
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .attr("r", function(d) { return k * d.r; });

    t.selectAll("text")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .style("opacity", function(d) { return k * d.r > 15 ? 1 : 0; });

    node = d;
    d3.event.stopPropagation();
  }

  
})(window);