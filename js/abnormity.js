(function(win) {
    
    neo4JAFK();
    neo4JMailInac();
    neo4JChatInac();

    $( "#abnSubmit" ).click(function() {
    var startDate = $( "#abnFrom" ).val();
    var endDate = $( "#abnTo" ).val();
    
    if (startDate == "" || endDate == "") {
      alert("please pick a range of Dates");
    } else {
      startDate = startDate.replace(/-/g, "");
      endDate = endDate.replace(/-/g, "");
      neo4JAFK(startDate,endDate);
      neo4JMailInac(startDate,endDate);
      neo4JChatInac(startDate,endDate);
    }      
  });

})(window);

function neo4JAbnRange(range){
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12']
  var d = new Date();
  var endDate = d.getFullYear()+months[d.getMonth()]+d.getDate();
  d.setDate(d.getDate() - range);
  var startDate = d.getFullYear()+months[d.getMonth()]+d.getDate();
  neo4JAFK(startDate,endDate);
  neo4JMailInac(startDate,endDate);
  neo4JChatInac(startDate,endDate);
}

function neo4JAFK(startDate,endDate){
  var username = "neo4j";
  var password = "connectwith";
  var ecdPass = window.btoa(username+":"+password);
  var auth = "Basic "+ ecdPass
  var neo4Jurl = "http://52.20.59.19:7474/db/data/transaction/commit";
  var statementAFK;

  if (startDate == null || endDate == null ) {
    statementAFK = "match (a)-[r:MAIL_TO]-(b) return a.name,max(toInt(r.timestamp)) as max order by max";
  } else {
    statementAFK = "match (a)-[r:MAIL_TO]-(b) where toInt(r.timestamp)>="+startDate+" and toInt(r.timestamp)<="+endDate+" return a.name,max(toInt(r.timestamp)) as max order by max";
  } 
  
  var post_data_AFK = {"statements":[{"statement":statementAFK,"resultDataContents":["row"]}]}

  $.ajax({
      type:"POST",//headers: {"Authorization": auth},
      async: false,
      accept: "application/json",
      contentType:"application/json; charset=utf-8",
      url: neo4Jurl,
      data: JSON.stringify(post_data_AFK),
      success: function(data, textStatus, jqXHR){
                        neo4J_visAFK(data);
                        },
      error:function(jqXHR, textStatus, errorThrown){
                        alert(errorThrown);
                        }
    });
}

function neo4JMailInac(startDate,endDate){
  var username = "neo4j";
  var password = "connectwith";
  var ecdPass = window.btoa(username+":"+password);
  var auth = "Basic "+ ecdPass
  var neo4Jurl = "http://52.20.59.19:7474/db/data/transaction/commit";
  var statementMailInac="";

  if (startDate == null || endDate == null ) {
    statementMailInac = statementMailInac + "match (a:employee)-[r:MAIL_TO]-(b) ";
    statementMailInac = statementMailInac + "with a.name as name,avg(toInt(r.frequency)) as avg,max(toInt(r.timestamp)) as max ";
    statementMailInac = statementMailInac + "match (c:employee)-[s:MAIL_TO]-(d) where c.name=name and toInt(s.timestamp)=max ";
    statementMailInac = statementMailInac + "return name,avg,sum(toInt(s.frequency)) as mnt ";
    statementMailInac = statementMailInac + "order by avg desc";
  } else {
    statementMailInac = statementMailInac + "match (a:employee)-[r:MAIL_TO]-(b) ";
    statementMailInac = statementMailInac + "where toInt(r.timestamp)>="+startDate+" and toInt(r.timestamp)<="+endDate+" ";
    statementMailInac = statementMailInac + "with a.name as name,avg(toInt(r.frequency)) as avg,max(toInt(r.timestamp)) as max ";
    statementMailInac = statementMailInac + "match (c:employee)-[s:MAIL_TO]-(d) where c.name=name and toInt(s.timestamp)=max ";
    statementMailInac = statementMailInac + "return name,avg,sum(toInt(s.frequency)) as mnt";
    statementMailInac = statementMailInac + "order by avg desc";
  } 
  
  var post_data_MailInac = {"statements":[{"statement":statementMailInac,"resultDataContents":["row"]}]}

  $.ajax({
      type:"POST",//headers: {"Authorization": auth},
      async: false,
      accept: "application/json",
      contentType:"application/json; charset=utf-8",
      url: neo4Jurl,
      data: JSON.stringify(post_data_MailInac),
      success: function(data, textStatus, jqXHR){
                        neo4J_visMailInac(data);
                        },
      error:function(jqXHR, textStatus, errorThrown){
                        alert(errorThrown);
                        }
    });
}

function neo4JChatInac(startDate,endDate){
  var username = "neo4j";
  var password = "connectwith";
  var ecdPass = window.btoa(username+":"+password);
  var auth = "Basic "+ ecdPass
  var neo4Jurl = "http://52.20.59.19:7474/db/data/transaction/commit";
  var statementChatInac="";

  if (startDate == null || endDate == null ) {
    statementChatInac = statementChatInac + "match (a:employee)-[r:CHAT_IN]-(b) ";
    statementChatInac = statementChatInac + "with a.name as name,avg(toInt(r.frequency)) as avg,max(toInt(r.timestamp)) as max ";
    statementChatInac = statementChatInac + "match (c:employee)-[s:CHAT_IN]-(d) where c.name=name and toInt(s.timestamp)=max ";
    statementChatInac = statementChatInac + "return name,avg,sum(toInt(s.frequency)) as mnt ";
    statementChatInac = statementChatInac + "order by avg desc";
  } else {
    statementChatInac = statementChatInac + "match (a:employee)-[r:CHAT_IN]-(b) ";
    statementChatInac = statementChatInac + "where toInt(r.timestamp)>="+startDate+" and toInt(r.timestamp)<="+endDate+" ";
    statementChatInac = statementChatInac + "with a.name as name,avg(toInt(r.frequency)) as avg,max(toInt(r.timestamp)) as max ";
    statementChatInac = statementChatInac + "match (c:employee)-[s:CHAT_IN]-(d) where c.name=name and toInt(s.timestamp)=max ";
    statementChatInac = statementChatInac + "return name,avg,sum(toInt(s.frequency)) as mnt ";
    statementChatInac = statementChatInac + "order by avg desc";
  }  
  
  var post_data_ChatInac = {"statements":[{"statement":statementChatInac,"resultDataContents":["row"]}]}

  $.ajax({
      type:"POST",//headers: {"Authorization": auth},
      async: false,
      accept: "application/json",
      contentType:"application/json; charset=utf-8",
      url: neo4Jurl,
      data: JSON.stringify(post_data_ChatInac),
      success: function(data, textStatus, jqXHR){
                        neo4J_visChatInac(data);
                        },
      error:function(jqXHR, textStatus, errorThrown){
                        alert(errorThrown);
                        }
    });
}

function neo4J_visAFK(data){
  var abnAFK=[];
  var now = new Date();
  var dateCount,days,rowDate,classFlag=0,rowCount=1,htmlText="";

  data.results[0].data.forEach(function (row) {
    
    rowDate = String(row.row[1]);
    rowDate = rowDate.substr(0, 4)+"-"+rowDate.substr(4, 2)+"-"+rowDate.substr(6, 2);
    dateCount = new Date(rowDate);
    days=Math.round((now - dateCount) / (1000 * 60 * 60 * 24));
    
    if (days>=5) {
      abnAFK.push({name:row.row[0],date:row.row[1],days:days});
    }
  });


  abnAFK.forEach(function(row){
    htmlText = htmlText + "<tr"
    if (classFlag==0) {
      htmlText = htmlText + " class='danger'>";
      classFlag = 1;
    } else {
      htmlText = htmlText + " >";
      classFlag = 0;
    }
    htmlText = htmlText + "<td>"+rowCount+"</td>";
    htmlText = htmlText + "<td>"+row.name+"</td>";
    htmlText = htmlText + "<td>"+row.days+"</td>";
    rowCount = rowCount + 1;
  });

  $('#abnAFK').html(htmlText);
  $('#abnoMnt').html(rowCount-1);
}

function neo4J_visMailInac(data){
  var mailInac=[];
  var classFlag=0,rowCount=1,htmlText="",numFormat;

  data.results[0].data.forEach(function (row) {
    if(row.row[2]<=(row.row[1]/3)){
      mailInac.push({name:row.row[0],avg:row.row[1],days:row.row[2]});
    }    
  });

  mailInac.forEach(function(row){
    htmlText = htmlText + "<tr"
    if (classFlag==0) {
      htmlText = htmlText + " class='info'>";
      classFlag = 1;
    } else {
      htmlText = htmlText + " >";
      classFlag = 0;
    }
    htmlText = htmlText + "<td>"+rowCount+"</td>";
    htmlText = htmlText + "<td>"+row.name+"</td>";
    numFormat = row.avg;
    htmlText = htmlText + "<td>"+numFormat.toFixed(2)+"</td>";
    htmlText = htmlText + "<td>"+row.days+"</td>";
    rowCount = rowCount + 1;
  });

  $('#mailInac').html(htmlText);
  var abnoMnt = parseInt($('#abnoMnt').text());
  $('#abnoMnt').html(abnoMnt+rowCount-1);
}

function neo4J_visChatInac(data){
  var chatInac=[];
  var classFlag=0,rowCount=1,htmlText="";

  data.results[0].data.forEach(function (row) {
    if(row.row[2]<=(row.row[1]/3)){
      chatInac.push({name:row.row[0],avg:row.row[1],days:row.row[2]});
    }    
  });

  chatInac.forEach(function(row){
    htmlText = htmlText + "<tr"
    if (classFlag==0) {
      htmlText = htmlText + " class='success'>";
      classFlag = 1;
    } else {
      htmlText = htmlText + " >";
      classFlag = 0;
    }
    htmlText = htmlText + "<td>"+rowCount+"</td>";
    htmlText = htmlText + "<td>"+row.name+"</td>";
    numFormat = row.avg;
    htmlText = htmlText + "<td>"+numFormat.toFixed(2)+"</td>";
    htmlText = htmlText + "<td>"+row.days+"</td>";
    rowCount = rowCount + 1;
  });

  $('#chatInac').html(htmlText);
  var abnoMnt = parseInt($('#abnoMnt').text());
  $('#abnoMnt').html(abnoMnt+rowCount-1);
}