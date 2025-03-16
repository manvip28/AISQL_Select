from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import re
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

genai.configure(api_key="[API_KEY]")

def generate_gemini_prompt(tables, nl_query):
    schema_json = json.dumps(tables, indent=2)
    return f"""
    You are an AI SQL expert. Your task is to generate **syntactically correct** SQL queries based on a given **database schema** and **natural language query**.

    ### **Instructions:**
    1️⃣ **Ensure correctness**: The generated SQL **must be valid** and should not contain syntax errors.  
    2️⃣ **Use only relevant tables & columns**: Filter out unnecessary schema details.  
    3️⃣ **Follow best practices**: Use proper **JOINs, WHERE clauses, GROUP BY, ORDER BY, and LIMIT** when necessary.  
    4️⃣ **Verify syntax**: If unsure, construct queries in **ANSI SQL** to maximize compatibility. 

    **Schema:**
    ```json
    {schema_json}
    ```

    **User Query:**
    ```
    {nl_query}
    ```

    **Response Format:**
    ```json
    BEGIN_JSON
    {{
      "filtered_schema": {{
        "tables": {{}}
      }},
      "sql_query": "SQL_QUERY_HERE"
    }}
    END_JSON
    ```
    """

def extract_json(response_text):
    match = re.search(r"BEGIN_JSON(.*?)END_JSON", response_text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format from Gemini."}
    return {"error": "No valid JSON found."}

def query_gemini(tables, nl_query):
    prompt = generate_gemini_prompt(tables, nl_query)
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)

    return extract_json(response.text) if response.text else {"error": "Empty response from Gemini API."}

@app.route("/generate_sql", methods=["POST"])
def generate_sql():
    try:
        data = request.json
        tables = data.get("tables", {})
        nl_query = data.get("query", "")

        if not tables or not nl_query:
            return jsonify({"error": "Missing schema or query"}), 400

        gemini_response = query_gemini(tables, nl_query)

        print(gemini_response)
        return jsonify(gemini_response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5002)
