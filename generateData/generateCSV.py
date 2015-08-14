import random
import time
numOfMail=500
teamChatNumber=50
teamName=["AppDirect","BNYM", "Branding Brand","Capco", "Community Elf", "Connect With", "Legal Analytics", "Nebulus", "Nectr", "Neighborhood Allies", "PNC", "Raymond James", "XFactr"]

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
    return strTimeProp(start, end, '%Y-%m-%d', prop)



# To get all names of employees
with open("SourceData") as f:
    content = f.readlines()
# To delete the \n in the end of each line
content =[x.strip('\n') for x in content]
length=len(content)
nodes=[{} for i in range(length)]
for i in range(length):
    nodes[i]["Name"]=content[i]
    nodes[i]["EmailAdress"]=content[i].split(" ")[0]+"@andrew.cmu.edu"
    nodes[i]["Group"]=str(random.randrange(5))
    nodes[i]["numsOfEmails"]=0
    nodes[i]["numsOfChats"]=str(random.randrange(100))
links=[{} for i in range(numOfMail)]
for i in range(numOfMail):
    from_ =random.randrange(length) 
    to_ = random.randrange(length)
    timestamp=randomDate("2015-07-11", "2015-08-10", random.random())
    links[i]["source"]=nodes[from_]["Name"]
    nodes[from_]["numsOfEmails"]+=1
    links[i]["target"]=nodes[to_]["Name"]
    links[i]["timestamp"]=timestamp
    links[i]["frequency"]=str(random.randrange(7)+1)
    # print str(from_)+','+str(to_)+','+timestamp#for id#json
# Json Format
# data={}
# data["nodes"]=nodes
# data["links"]=links
# print data

# CSV Format
with open("nodes.csv","w") as f:
    f.write("name,emailAddress,numOfChats,group,numOfEmails\n")
    for i in range(length):
        line=nodes[i]["Name"]+','+nodes[i]["EmailAdress"]+','+nodes[i]["numsOfChats"]+','+nodes[i]["Group"]+','+str(nodes[i]["numsOfEmails"])+'\n'
        f.write(line)

with open("relations.csv","w") as f:
    f.write("from,to,timestamp,frequency\n")
    for i in range(len(links)):
        line=links[i]["source"]+','+links[i]["target"]+','+links[i]["timestamp"]+','+links[i]["frequency"]+'\n'
        f.write(line)


#Write the cypher script
team=""
with open("neo4j_script","w") as f:
    f.write('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r;\n')
    f.write('LOAD CSV WITH HEADERS FROM'
            ' "file:///Users/Scarlett/Desktop/eBusiness/Practicum/generateData/nodes.csv" AS line '
            'CREATE (e:employee { name: line.name, emailAddress: line.emailAddress, '
            'numOfChats: line.numOfChats, group: line.group, numOfEmails: line.numOfEmails});\n')
    f.write('LOAD CSV WITH HEADERS FROM '
        '"file:///Users/Scarlett/Desktop/eBusiness/Practicum/generateData/relations.csv" AS line '
        'MATCH (from:employee { name:line.from }) MATCH (to:employee { name:line.to }) '
        'CREATE (from)-[:MAIL_TO { timestamp: line.timestamp, frequency: line.frequency}]->(to);\n')
    with open("groupinfo") as g:
        content = g.readlines()
    content =[x.strip('\n') for x in content]
    for i in range(len(content)):
        if not content[i]:
            continue
        if content[i].startswith("Team:"):
            team=content[i][5:]
        else:
            num=random.randrange(teamChatNumber)
            f.write("MATCH (n { name: '%s' }) SET n :%s, n.%s=%d RETURN n;\n" % (content[i], team,team, num))




