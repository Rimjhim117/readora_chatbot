# readora_chatbot
Readora: AI Book Recommendation Chatbot

This project, Readora, is a smart, AI-powered book recommendation chatbot developed as part of an IBM PBEL Internship. It serves as a proof of concept for a natural language processing system that helps users discover new books based on their mood and genre preferences.

The core logic of the chatbot is designed to mimic the intent and entity detection capabilities of IBM Watson Studio, allowing for intelligent, conversational recommendations without a live service. This demonstrates a clear understanding of how to build and structure an AI-driven assistant from the ground up.

✨ Key Features

    IBM Watson-style Logic: The chatbot's backend processes user messages to detect moods (e.g., "sad", "happy") and genres ("fantasy", "thriller"), and then provides relevant recommendations.

    Dynamic & Responsive UI: A clean, modern web interface built with HTML, CSS, and JavaScript provides a seamless chat experience with interactive book cards.

    Simple & Scalable Backend: The server, built with Node.js and Express, efficiently handles API calls and serves the front-end, making it easy to test and extend.

    Robust Book Database: The main version of the project includes a curated database of 50 books across five popular genres, ensuring a wide range of recommendations.

🚀 Getting Started

To get a local copy of this project up and running, follow these simple steps.

Prerequisites

You need to have Node.js installed on your machine.

    Node.js

Installation

    Clone the repository:
    Bash

git clone https://github.com/your-username/readora.git

Navigate to the project directory:
Bash

cd readora

Install the required Node.js packages:
Bash

    npm install express

Running the Server

You can run one of two server versions. The readora-complete.js file is the primary, feature-rich version.

Using the main server (readora-complete.js):
Bash

node readora-complete.js

After running the command, open your web browser and go to http://localhost:3000 to start chatting with Readora.

💡 Future Enhancements

This project is a strong foundation and can be significantly improved upon. My future plans for this project include:

    Full Integration with IBM Watson Assistant: Integrate with a live IBM Watson Assistant service to leverage its advanced natural language processing capabilities, providing more accurate and dynamic conversations.

    Expanded Content: Integrate with a real-time book API (e.g., Google Books) to dramatically expand the book database and provide the latest titles.

    User Personalization: Implement user authentication and a profile system to remember past interactions and provide more personalized, long-term recommendations.

    Improved UI/UX: Refine the user interface with more advanced styling and animations to create an even more engaging experience.

🤝 Contributing

Contributions are welcome! If you'd like to help improve this project, feel free to open an issue or submit a pull request.

📄 License

Distributed under the MIT License. See the LICENSE file for more information.

🙋‍♂️ Author

Rimjhim Srivastava 

