import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    print("ERRO: GOOGLE_API_KEY não encontrada no arquivo .env")
    exit()


REPORT_GENERATION_PROMPT = """
You are a Staff Software Engineer creating interview materials.
Based on the following LeetCode problem, generate a comprehensive report for an interviewer in Markdown.
The report must include these sections:
1.  **Problem Summary:** A brief, one-paragraph summary.
2.  **Brute-Force Approach:** Explanation, pseudocode, and time/space complexity.
3.  **Optimal Approach:** Explanation, logic, data structures, pseudocode, and time/space complexity.
4.  **Key Concepts:** List 3-4 key technical concepts.
5.  **Follow-up Questions:** Suggest 2-3 follow-up questions for the interviewer.

Problem Data:
Title: {title}
Difficulty: {difficulty}
Content:
{content}
"""

async def generate_analysis_report(question_data: dict) -> str:
    """
    Receives a question's data, sends it to a Gemini model to generate
    a detailed report, and returns the report.
    This function is the core of the Analyst Agent.
    """
    print(f"INFO: [Analyst Agent] Generating report for '{question_data['title']}'...")
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = REPORT_GENERATION_PROMPT.format(
        title=question_data['title'],
        difficulty=question_data['difficulty'],
        content=question_data['content']
    )
    
    try:
        response = await model.generate_content_async(prompt)
        print("INFO: [Analyst Agent] Report generated successfully.")
        return response.text
    except Exception as e:
        print(f"ERROR: [Analyst Agent] Failed to generate report: {e}")
        return "Error: I was unable to generate the analysis report."