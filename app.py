from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

# List of verbs
l_verb = [  "i", "I", "we", "You", "you", "We", "am", "is", "are", "was", "did", "were",
    "do", "does", "have", "has", "had", "shall", "will", "can", "could", "may",
    "might", "must", "ought", "should", "would", "need", "dare", "used to","feel","like","and",
    "need", "dare", "used to", "a", "an", "the", "this", "that", "these", "those",
    "my", "your", "his", "her", "its", "our", "their", "few", "little", "much",
    "many", "lot", "lots", "plenty", "a lot of", "some", "any", "enough", "all",
    "both", "half", "either", "neither", "each", "every", "other", "another",
    "such", "what", "rather", "quite", "so", "very", "too", "pretty", "enough",
    "as", "because", "since", "for", "till", "until", "unless", "although",
    "though", "even if", "when", "where", "while", "who", "whose", "which",
    "what", "whatever", "whoever", "whichever", "whomever", "whosever", "how",
    "however", "why", "whatever", "whoever", "whichever", "whomever", "whosever",
    "how", "however", "why", "when", "where", "while", "which", "who", "what",
    "whom", "whose", "whoever", "whatever", "whichever", "whomever", "whosever",
    "how", "however", "why", "a", "an", "the", "my", "your", "his", "her", "its",
    "our", "their", "few", "little", "much", "many", "lot", "lots", "plenty",
    "a lot of", "some", "any", "enough", "all", "both", "half", "either",
    "neither", "each", "every", "other", "another", "such", "what", "rather",
    "quite", "so", "very", "too", "pretty", "enough", "as", "because", "since",
    "for", "till", "until", "unless", "although", "though", "even if", "when",
    
]

csv_file = r"Testdata.csv"
suggestion_csv_file = r"disorder_values.csv"

# Read the CSV files into DataFrames
df = pd.read_csv(csv_file)
suggestion_df = pd.read_csv(suggestion_csv_file)

# Function to filter the DataFrame by 'disorder' value and retrieve suggestions
def get_disorder_and_suggestions(data):
    matching_row = df[df['ngram'].str.contains(data, case=False, regex=False)]

    if not matching_row.empty:
        disorder_value = matching_row['disorder'].values[0]
        filtered_data = suggestion_df[suggestion_df['disorder_value'] == disorder_value]
        suggestions = filtered_data['suggestion'].tolist()
        return disorder_value, suggestions
    else:
        return None, []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('user_input')
    words = user_input.split()
    string_to_find = ' '.join([word for word in words if word.lower() not in l_verb])

    disorder, suggestions = get_disorder_and_suggestions(string_to_find)

    response = ""

    if disorder:
        response += f"You seem to be experiencing '{disorder}'.\n"
        response += "Here are some suggestions:\n"
        for suggestion in suggestions:
            response += f"- {suggestion}\n"
    else:
        response = f"I couldn't find any related disorder and suggestions for '{string_to_find}'."

    # Append the user's input to the response
    response += f"\nYou said: {user_input}"

    return jsonify({'response': response})



if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0')
