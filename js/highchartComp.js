(function(win) {

  neo4JChart();

  $( "#hichartSubmit" ).click(function() {
    var startDate = $( "#hichartFrom" ).val();
    var endDate = $( "#hichartTo" ).val();
    
    if (startDate == "" || endDate == "") {
      alert("please pick a range of Dates");
    } else {
      startDate = startDate.replace(/-/g, "");
      endDate = endDate.replace(/-/g, "");
      neo4JChart(startDate,endDate);
    }      
  });

})(window);

function neo4JChartRange(range){
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12']
  var d = new Date();
  var endDate = d.getFullYear()+months[d.getMonth()]+d.getDate();
  d.setDate(d.getDate() - range);
  var startDate = d.getFullYear()+months[d.getMonth()]+d.getDate();
  neo4JChart(startDate,endDate);
}

function neo4JChart(startDate,endDate){
  var username = "neo4j";
  var password = "connectwith";
  var ecdPass = window.btoa(username+":"+password);
  var auth = "Basic "+ ecdPass
  var neo4Jurl = "http://52.20.59.19:7474/db/data/transaction/commit";
  var statementChart1="",statementChart2="";
  var mailJSON=[],chatJSON=[];

  if (startDate == null || endDate == null ) {
    statementChart1 = statementChart1 + "match (a)-[r]-(b:employee) ";
    statementChart1 = statementChart1 + "return r.timestamp as date,sum(toInt(r.frequency)) as mail ";
    statementChart1 = statementChart1 + "order by date";

    statementChart2 = statementChart2 + "match (a)-[r]-(b:room) ";
    statementChart2 = statementChart2 + "return r.timestamp as date,sum(toInt(r.frequency)) as chat ";
    statementChart2 = statementChart2 + "order by date";
  } else {
    statementChart1 = statementChart1 + "match (a)-[r]-(b:employee) ";
    statementChart1 = statementChart1 + "where toInt(r.timestamp)>="+startDate+" and toInt(r.timestamp)<="+endDate+" ";
    statementChart1 = statementChart1 + "return r.timestamp as date,sum(toInt(r.frequency)) as mail ";
    statementChart1 = statementChart1 + "order by date";

    statementChart2 = statementChart2 + "match (a)-[r]-(b:room) ";
    statementChart2 = statementChart2 + "where toInt(r.timestamp)>="+startDate+" and toInt(r.timestamp)<="+endDate+" ";
    statementChart2 = statementChart2 + "return r.timestamp as date,sum(toInt(r.frequency)) as chat ";
    statementChart2 = statementChart2 + "order by date";
  } 
  
  var post_data_chart = {"statements":[{"statement":statementChart1,"resultDataContents":["row"]}]}

  $.ajax({
      type:"POST",//headers: {"Authorization": auth},
      async: false,
      accept: "application/json",
      contentType:"application/json; charset=utf-8",
      url: neo4Jurl,
      data: JSON.stringify(post_data_chart),
      success: function(data, textStatus, jqXHR){
                         mailJSON = data;
                        },
      error:function(jqXHR, textStatus, errorThrown){
                        alert(errorThrown);
                        }
    });

  var post_data_chart = {"statements":[{"statement":statementChart2,"resultDataContents":["row"]}]}

    $.ajax({
      type:"POST",//headers: {"Authorization": auth},
      async: false,
      accept: "application/json",
      contentType:"application/json; charset=utf-8",
      url: neo4Jurl,
      data: JSON.stringify(post_data_chart),
      success: function(data, textStatus, jqXHR){
                        chatJSON = data;
                        },
      error:function(jqXHR, textStatus, errorThrown){
                        alert(errorThrown);
                        }
    });
    neo4J_visChart(mailJSON,chatJSON);
}

function neo4J_visChart(mail,chat){
    //Creating graph object
    var chartData=[],dateData=[],mailData=[],chatData=[],counter=0,mailMnt=0;chatMnt=0;
    if (mail.results[0] == null || chat.results[0] == null) {
      alert("we are terribly sorry for not finding the proper information, please click ok to return to initial information");
    } else {
      mail.results[0].data.forEach(function(rowMail){
        dateData.push(rowMail.row[0]);
        mailData.push(rowMail.row[1]);
        chat.results[0].data.forEach(function(rowChat){
          if(rowMail.row[0]==rowChat.row[0]) {
            chatData.push(rowChat.row[1]);
          }
        });
        if(chatData[counter]==null){
          chatData.push(0);
        }
        counter = counter + 1;
      });
    }
    chartData={date:dateData, mail:mailData, chat:chatData}; 
    drawChart(chartData);

    mailData.forEach(function(count){
      mailMnt = mailMnt + count;
    });
    $('#mailMnt').html(mailMnt); 

    chatData.forEach(function(count){
      chatMnt = chatMnt + count;
    });
    $('#chatMnt').html(chatMnt); 
}

function drawChart(chartData){
  $(function () {
      $('#container1').highcharts({
          chart: {
              type: 'area'
          },
          title: {
              text: 'Daily Amount of Email and Chat for eBusiness Consulting'
          },
          xAxis: {
              categories: chartData.date,
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
            data: chartData.chat,
            yAxis: 1
          }, {
            name: 'Email',
            data: chartData.mail,
          }]
      });
  });
}