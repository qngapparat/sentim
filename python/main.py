import csv

from textblob import TextBlob
from flair.data import Sentence
from flair.models import TextClassifier

classifier = TextClassifier.load('en-sentiment')

# Write CSV header
# Overwrite old file
with open('qmout500.csv', 'w', newline='') as csvfileout:
  fields = ['title', 'category', 'year', 'flairscore', 'textblobscore', 'meanscore', 'month', 'day', 'millis']
  writer = csv.DictWriter(csvfileout, fieldnames=fields)
  writer.writeheader()

# for each line in csv, predict sentiment, save sentiment in another csv
with open('qmarketin500.csv') as csvfile:
  reader = csv.DictReader(csvfile)
  for row in reader:
    str = row['title']
    print(str)
    flairscore = textblobscore = meanscore = 0

    # Flair prediction
    try:
      sentence = Sentence(str)
      classifier.predict(sentence)
      res = sentence.to_dict()
      # => mapping sentiment to [-1, 1]
      # POSITIVE * confidence(0.3) => 0.3
      # NEGATIVE * confidence(0.8) => -0.8
      # not the nicest way
      score = (1 if res['labels'][0]['value'] == 'POSITIVE' else -1) * res['labels'][0]['confidence']
      flairscore = score
    except Exception as e:
      print("Exception when flair processing ", str)
      print(e)
      flairscore = 0

    try:
      score = TextBlob(str).sentiment.polarity
      textblobscore = score
      meanscore = (textblobscore + flairscore) / 2.0
    except Exception as e:
      print("Exception when textblob processing ", str)
      print(e)
      textblobscore = 0

    print(str)
    print(flairscore)
    print(textblobscore)
    print("Mean " , meanscore)
    print("================")

    analysis = {
      'title': row['title'],
      'category': row['category'],
      'year': row['year'],
      'flairscore': flairscore,
      'textblobscore': textblobscore,
      'meanscore': meanscore,
      'month': row['month'],
      'day': row['day'],
      'millis': row['millis']
    }
    
    with open('qmout500.csv', 'a', newline='') as csvfileout:
      fields = ['title', 'category', 'year', 'flairscore', 'textblobscore', 'meanscore', 'month', 'day', 'millis']
      writer = csv.DictWriter(csvfileout, fieldnames=fields)
      writer.writerow(analysis)

