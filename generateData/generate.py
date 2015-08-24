import random
import time
numOfMail=60
teamChatNumber=50
teamMailNumber=20

teamName=["AppDirect","BNYM", "Branding Brand","Capco", "Community Elf", "Connect With", "Legal Analytics", "Nebulus", "Nectr", "Neighborhood Allies", "PNC", "Raymond James", "XFactr"]
from time import gmtime, strftime
from datetime import datetime,timedelta
today="20150828"
onemonthago="20150728"
def strTimeProp(start, end, format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formated in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """

    stime = time.mktime(time.strptime(start, format))
    etime = time.mktime(time.strptime(end, format))

    ptime = stime + prop * (etime - stime)

    return time.strftime(format, time.localtime(ptime))


def randomDate(start, end, prop):
    #Specify the date format we need
    #return strTimeProp(start, end, '%m/%d/%Y %I:%M %p', prop)
    return strTimeProp(start, end, '%Y%m%d', prop)

def chatsInroom(team, formal):
    # generate random chats for teammembers
    name_fre={}
    for i in range(1, len(team)):
        name_fre[team[i]]=0
    with open("neo4j_script","a") as f:
        f.write("CREATE (n:room {name: '%s'});\n" % team[0])
        for i in range(teamChatNumber):
            member=team[random.randrange(len(team)-1)+1]
            timestamp=randomDate(onemonthago, today, random.random())
            frequency =random.randrange(14)+1
            totalCom[member][1]+=frequency
            name_fre[member]+=frequency
            
            f.write("match (from:employee{name:'%s'}) match (in:room{name:'%s'}) create (from)-[:CHAT_IN {timestamp: '%s', frequency: %d}]->(in);\n" % (member,team[0],timestamp,frequency))
        
        # -----8,27---- This part is specially design for Aug 27th.
        # All teams will have more communications on Aug 27th
        for i in range(5):
            member=team[random.randrange(len(team)-1)+1]
            timestamp="20150827"
            frequency =random.randrange(3)+1
            totalCom[member][1]+=frequency
            name_fre[member]+=frequency
            
            f.write("match (from:employee{name:'%s'}) match (in:room{name:'%s'}) create (from)-[:CHAT_IN {timestamp: '%s', frequency: %d}]->(in);\n" % (member,team[0],timestamp,frequency))
        #----done for Aug 27th--------- 


        global groupcount
        groupcount+=1

        for i in range(1, len(team)):
            if formal:
                f.write("MATCH (n { name: '%s' }) SET n :%s, n.Group=%d, n.%s=%d; \n" % (team[i], team[0],groupcount,team[0], name_fre[team[i]]))
            else:
                f.write("MATCH (n { name: '%s' }) SET n :%s,  n.%s=%d; \n" % (team[i], team[0],team[0], name_fre[team[i]]))



def mailsInroom(team):
    name_fre={}
    with open("neo4j_script","a") as f:
        for i in range(teamMailNumber):
            member1=team[random.randrange(len(team)-1)+1]
            member2=team[random.randrange(len(team)-1)+1]
            if member2==member1:
                continue
            timestamp=randomDate(onemonthago, today, random.random())
            frequency =random.randrange(5)+1
            totalCom[member1][0]+=frequency
 
            f.write("match (from:employee{name:'%s'}) match (to:employee {name:'%s'}) create (from)-[:MAIL_TO {timestamp: '%s', frequency: %d}]->(to);\n" % (member1,member2,timestamp,frequency))

def loadTeamCommunication(groupinfo, formal):
    global groupcount
    groupcount=0
    with open(groupinfo) as g:
        content = g.readlines()
    content =[x.strip('\n') for x in content]
    content.append("Team:")#Just for ending
    team=[]
    for i in range(len(content)):
        if not content[i]:
            continue
        if content[i].startswith("Team:"):
            if team:
                chatsInroom(team,formal);
                if formal:
                    mailsInroom(team);
                team=[]
            team.append(content[i][5:])
            
        else:
            team.append(content[i])
           


def SetNumOfMailChats(totalCom):
    with open("neo4j_script","a") as f:
        for k,v in totalCom.items():
            f.write("match (a{name:'%s'}) set a.numOfEmails=%d, a.numOfChats=%d;\n" %(k,v[0],v[1]))



def loadnodesAndRel(sourcedata):
    # To get all names of employees
    with open("SourceData.txt") as f:
        content = f.readlines()
    # To delete the \n in the end of each line
    content =[x.strip('\n') for x in content]
    length=len(content)
    nodes=[{} for i in range(length)]
    global totalCom
    totalCom = {}
    for i in range(length):
        totalCom[content[i]]=[0,0]
        nodes[i]["Name"]=content[i]
        nodes[i]["EmailAdress"]=content[i].split(" ")[0]+"@andrew.cmu.edu"
        nodes[i]["Group"]=str(random.randrange(5))
    links=[{} for i in range(numOfMail)]
    for i in range(numOfMail):
        from_ =random.randrange(length) 
        to_ = random.randrange(length)
        timestamp=randomDate(onemonthago, today, random.random())
        links[i]["source"]=nodes[from_]["Name"]
        frequency =random.randrange(7)+1
        totalCom[nodes[from_]["Name"]][0]+=frequency
        links[i]["target"]=nodes[to_]["Name"]
        links[i]["timestamp"]=timestamp
        links[i]["frequency"]=str(frequency)


    # CSV Format
    with open("nodes.csv","w") as f:
        f.write("name,emailAddress\n")
        for i in range(length):
            line=nodes[i]["Name"]+','+nodes[i]["EmailAdress"]+'\n'
            f.write(line)

    with open("relations.csv","w") as f:
        f.write("from,to,timestamp,frequency\n")
        for i in range(len(links)):
            line=links[i]["source"]+','+links[i]["target"]+','+links[i]["timestamp"]+','+links[i]["frequency"]+'\n'
            f.write(line)

loadnodesAndRel("SourceData")
#Write the cypher script
team=""
with open("neo4j_script","w") as f:
    f.write('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r;\n')
    f.write('LOAD CSV WITH HEADERS FROM'
            ' "file:///home/ubuntu/Data_Visualization/generateData/nodes.csv" AS line '
            'CREATE (e:employee { name: line.name, emailAddress: line.emailAddress});\n')
    f.write('LOAD CSV WITH HEADERS FROM '
        '"file:///home/ubuntu/Data_Visualization/generateData/relations.csv" AS line '
        'MATCH (from:employee { name:line.from }) MATCH (to:employee { name:line.to }) '
        'CREATE (from)-[:MAIL_TO { timestamp: line.timestamp, frequency: line.frequency}]->(to);\n')

loadTeamCommunication("formalTeam.txt",True)
loadTeamCommunication("informalTeam.txt", False)
SetNumOfMailChats(totalCom)


