// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Store conversation history
const conversationHistory = [
  // System message for the assistant
  { role: 'system', content: `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination. 
  
  If a user's query is unrelated to budget travel, respond by stating that you do not know.` }
];

// Add event listener for form submission
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the page from refreshing
  responseContainer.textContent = 'Loading...'; // Show a loading message

  // Get the user's input
  const userMessage = userInput.value;

  // Add user message to conversation history
  conversationHistory.push({ role: 'user', content: userMessage });

  // Clear the input field
  userInput.value = '';

  // Use try/catch to handle errors (for beginners, this is the simplest way)
  try {
    // Send a POST request to the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', // We are POST-ing data to the API
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
      },
      // Send model details and entire conversation history
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: conversationHistory, // Send all previous messages
        max_completion_tokens: 800, // Limit the response length to avoid excessive output
        temperature: 0.5, // Set the temperature for response variability
        frequency_penalty: 0.8, // Apply a frequency penalty to reduce repetition
      })
    });

    // Parse and store the response data
    const result = await response.json();

    // Check if the API returned an error
    if (result.error) {
      // Show a friendly error message to the user
      responseContainer.textContent = 'Sorry, something went wrong. Please try again.';
      // Log the error for debugging
      console.error(result.error);
      return;
    }

    // Get the AI's response
    const aiResponse = result.choices[0].message.content;

    // Add AI response to conversation history
    conversationHistory.push({ role: 'assistant', content: aiResponse });

    // Display the AI's response on the page
    responseContainer.textContent = aiResponse;
  } catch (error) {
    // Show a friendly error message to the user
    responseContainer.textContent = 'Sorry, something went wrong. Please try again.';
    // Log the error for debugging
    console.error(error);
  }
});