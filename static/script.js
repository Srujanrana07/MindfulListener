let userName = "";
let chatbotName = "MindfulListener";
let selectedMood = "";

// Function to simulate chatbot messages
function simulateChatbotMessage(message) {
    const chatDisplay = document.getElementById('chat-display');
    chatDisplay.innerHTML += `<p><strong>${chatbotName}:</strong> ${message}</p>`;
}

// Function to start the conversation by asking for the user's name
function startConversation() {
    simulateChatbotMessage("Hello! I'm here to listen and provide support.");
    setTimeout(askUserName, 1000); // Delay asking for the name for a better user experience
}

// Function to ask for the user's name
function askUserName() {
    simulateChatbotMessage("May I know your name?");
    document.getElementById('user-input').style.display = 'block'; // Display the text input
    document.getElementById('send-button').style.display = 'block'; // Display the send button
    document.getElementById('user-input').focus(); // Focus on the input field
}

// Function to add a message to the chat display
function addMessage(sender, message) {
    const chatDisplay = document.getElementById('chat-display');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatDisplay.appendChild(messageElement);
}

// Function to handle user input
function handleUserInput() {
    const userInput = document.getElementById('user-input').value;
    document.getElementById('user-input').value = ''; // Clear the input field

    if (userName === "") {
        userName = userInput;
        addMessage(chatbotName, `Nice to meet you, ${userName}! How are you feeling today?`);
        setTimeout(askUserMood, 1000); // Delay asking for mood for a better user experience
    } else if (selectedMood === "") {
        selectedMood = userInput;
        addMessage(chatbotName, `Why do you feel ${selectedMood}?`);
        document.getElementById('user-input').style.display = 'block'; // Display the text input
        document.getElementById('user-input').focus(); // Focus on the input field
    } else {
        // Handle user input as needed, e.g., by providing responses or assistance

        // Send the user's input to the server for processing
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: userInput }),
        })
        .then((response) => response.json())
        .then((data) => {
            // Display the chatbot's response with disorder and suggestions, if any
            addMessage(chatbotName, data.response);
        });
    }
}


// Function to ask for the user's mood
function askUserMood() {
    simulateChatbotMessage(`How is your mood today, ${userName}? Please select one:`);
    document.getElementById('user-input').style.display = 'none'; // Hide the text input
    document.getElementById('send-button').style.display = 'none'; // Hide the send button
    document.getElementById('mood-buttons').style.display = 'block'; // Display the mood buttons
}

// Function to handle mood selection
function selectMood(mood) {
    selectedMood = mood;
    simulateChatbotMessage(`You selected your mood as: ${mood}`);
    document.getElementById('mood-buttons').style.display = 'none'; // Hide the mood buttons
    askWhyMood(); // Ask why the user feels this way
}

// Function to ask why the user feels the selected mood
function askWhyMood() {
    simulateChatbotMessage(`Why do you feel ${selectedMood}?`);
    document.getElementById('user-input').style.display = 'block'; // Display the text input
    document.getElementById('send-button').style.display = 'block'; // Display the send button
    document.getElementById('user-input').focus(); // Focus on the input field
}

// Event listener for the send button
document.getElementById('send-button').addEventListener('click', handleUserInput);

// Event listener for pressing Enter key
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Start the conversation
startConversation();