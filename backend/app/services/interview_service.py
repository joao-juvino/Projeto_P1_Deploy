import json
import random



def select_question():
  with open("data/questions.json", "r", encoding="utf-8") as f:
      questions = json.load(f)
      selected_question = random.choice(questions)
  return selected_question

def get_question():
   