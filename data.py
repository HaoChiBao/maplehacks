import csv

data = ['']*795
n = 0
with open('cleandata.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    #writer = csv.writer(csvfile)

    for row in reader:
        #data = ['']*2
        split = row[0].split(',[')
        row[0:1] = split
        data[n] = row[1]
        n = n+1
        #writer.writerow(row[0])
        # illness = split[0].split(',')
        # row[0:1] = illness

with open('newdata.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)

    for row in data:
        writer.writerow(row)
