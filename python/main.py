from flair.models import TextClassifier
classifier = TextClassifier.load('en-sentiment')

sentence = Sentence('This film hurts. It is so bad that I am confused.')
classifier.predict(sentence)

print(sentence)
print(sentence.labels)