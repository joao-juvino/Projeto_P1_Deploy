import requests
import json
import time
import os
from bs4 import BeautifulSoup

# --- CONSTANTS ---
LIST_API_URL = "https://leetcode.com/api/problems/all/"
GRAPHQL_API_URL = "https://leetcode.com/graphql"
OUTPUT_FILE = "questions.json"

# --- FUNCTION 1: GET THE LIST OF ALL PROBLEMS ---
def get_all_problems():
    """Fetches the initial list of all problems from LeetCode."""
    print("Fetching the list of all problems...")
    try:
        response = requests.get(LIST_API_URL, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()
        data = response.json()
        return data['stat_status_pairs']
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the problem list: {e}")
        return None

# --- FUNCTION 2: GET DETAILS FOR A SPECIFIC PROBLEM ---
def get_problem_details(slug):
    """Fetches the full details for a problem using its slug via GraphQL."""
    query = """
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        content
        difficulty
        stats
        topicTags { name }
      }
    }
    """
    payload = {"query": query, "variables": {"titleSlug": slug}}
    try:
        response = requests.post(GRAPHQL_API_URL, json=payload, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()
        data = response.json()
        return data['data']['question']
    except (requests.exceptions.RequestException, KeyError, TypeError) as e:
        print(f"  -> Failed to fetch details for '{slug}': {e}")
        return None

# --- FUNCTION 3: CONVERT HTML TO LLM-FRIENDLY STRUCTURED TEXT ---
def format_html_para_llm(html_content):
    """Converts HTML content to a clean, structured text format."""
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # <<< CHANGED TO ENGLISH
    formatted_text = "DESCRIPTION:\n"
    
    for element in soup.find_all(['p', 'pre', 'ul', 'ol']):
        if element.name == 'pre':
            # <<< CHANGED TO ENGLISH
            formatted_text += "\nEXAMPLE/CODE:\n"
            formatted_text += element.get_text("\n", strip=True) + "\n"
        elif element.name in ['ul', 'ol']:
            # <<< CHANGED TO ENGLISH
            section_title = "CONSTRAINTS/LIST:"
            prev_sibling = element.find_previous_sibling('p')
            if prev_sibling and 'constrain' in prev_sibling.get_text().lower():
                # <<< CHANGED TO ENGLISH
                section_title = "CONSTRAINTS:"
            elif prev_sibling and 'example' in prev_sibling.get_text().lower():
                section_title = f"\n{prev_sibling.get_text(strip=True)}\n"
            
            formatted_text += f"\n{section_title}\n"
            for li in element.find_all('li'):
                formatted_text += f"- {li.get_text(strip=True)}\n"
        elif element.name == 'p':
            paragraph_text = element.get_text(strip=True)
            if paragraph_text and 'Example' not in paragraph_text and 'Constraint' not in paragraph_text:
                formatted_text += paragraph_text + "\n"
    
    return formatted_text.replace('<sup>', '^').replace('&nbsp;', ' ')

# --- MAIN FUNCTION: ORCHESTRATOR ---
def main():
    processed_problems = []
    
    problem_list = get_all_problems()
    if not problem_list:
        return

    problem_list.sort(key=lambda p: p['stat']['question_id'])
    
    problems_to_process = problem_list[:100]
    
    total_to_process = len(problems_to_process)
    print(f"Processing the first {total_to_process} problems...")

    for i, problem_summary in enumerate(problems_to_process):
        question_id = problem_summary['stat']['question_id']
        slug = problem_summary['stat']['question__title_slug']
        
        print(f"\nProcessing {i+1}/{total_to_process} (ID: {question_id}): {problem_summary['stat']['question__title']}")

        details = get_problem_details(slug)
        if not details:
            time.sleep(1)
            continue

        llm_content = format_html_para_llm(details.get('content'))

        final_problem_data = {
            "questionId": details['questionId'],
            "title": details['title'],
            "difficulty": details['difficulty'],
            "topicTags": [tag['name'] for tag in details.get('topicTags', [])],
            "stats": json.loads(details.get('stats', '{}')),
            "content": llm_content
        }
        processed_problems.append(final_problem_data)
        
        time.sleep(1.1)

    print(f"\nProcessing complete! Saving the {len(processed_problems)} problems to the file...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(processed_problems, f, indent=2, ensure_ascii=False)
    
    print(f"Success! Data has been saved to '{OUTPUT_FILE}'.")

if __name__ == "__main__":
    main()