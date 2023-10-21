import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';

const pageStyle = {
  background: 'lightblue',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const chatbotStyle = {
  maxWidth: '100%',
  width: '500px',
  margin: '0 auto',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  backgroundColor: '#0276b1',
};

const messageStyle = {
  backgroundColor: '#f2f2f2',
  padding: '10px',
  margin: '5px',
  borderRadius: '5px',
  textAlign: 'left',
  fontSize:'20px'
};

const userMessageStyle = {
  ...messageStyle,
  backgroundColor: 'red',
  color: 'white',
  textAlign: 'center',
};

const logoStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '500px', // Adjust the width as needed
  height: 'auto',
};

function App() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([{ text: "Hello I am Budget Bot. I am an all in one Capital One bot here to assist you with managing your finance.", isUser: false }]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const data = `Capital one offers 2 credit cards. The Credit builder card:
    Credit builder
    Classic credit card

    Over 4 million people have already been approved for a Classic card.

    For people with bad credit or building credit
    £200 - £1,500 credit limit
    Up to two optional credit increases per year, subject to eligibility

    and also the 0% on balance transfers card:

    Balance Transfer card

    Save money by transferring your higher interest credit card balances to Capital One.

    For people with an excellent credit rating
    Credit limit up to £8,000
    0% on balance transfers for up to 24 months
    Up to 3% transfer fee
    You may be eligible for 0% interest on purchases for 3 months

    This is a link to Capital One's guide to help with the cost of living: https://www.capitalone.co.uk/support/cost-of-living-support
  `;

  const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true,
  });

  const getApiResponse = async () => {
    try {
      const systemPrompt = `You are a helpful assistant called Budget Bot who works for Capital One. You are to help users budget during the cost of living. If a question is asked that is not related to Capital One or budgeting, please tell the user to ask questions only related to budgeting and Capital One. The person using budgetBot doesnt want to read to much and has a low iq. If a user asks for a budget guide please format it like this : income: # , expenses:# , emergency fund:# I have provided some data please use it: ` + data;
      setIsLoading(true);

      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput },
        ],
        model: 'gpt-3.5-turbo',
      });

      const botResponse = chatCompletion.choices[0].message.content;

      return botResponse;
    } catch (error) {
      console.error('Error fetching API response:', error);
      return 'An error occurred while fetching the response.';
    }
  };

  const handleUserMessage = async () => {
    if (userInput.trim() !== '') {
      const userMessage = userInput;
      setIsBotTyping(true);

      try {
        const botResponse = await getApiResponse();
        setIsBotTyping(false);
        setMessages([
          ...messages,
          { text: userMessage, isUser: true },
          { text: botResponse, isUser: false },
        ]);
        setUserInput('');
      } catch (error) {
        console.error('Error fetching API response:', error);
      }
    }
  };

  return (
    <div style={pageStyle}>
      <div style={chatbotStyle}>
        <img
          src="https://moduleit.co.uk/assets/Uploads/64f30e238c/Capitalone.jpg"
          alt="Logo"
          style={logoStyle}
        />
        <div>
          {messages.map((message, index) => (
            <div
              key={index}
              style={message.isUser ? userMessageStyle : messageStyle}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          {isBotTyping && <div style={messageStyle}>Bot is typing...</div>}
          <input
            type="text"
            placeholder="Type a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={{ width: '80%', padding: '5px' }}
          />
          <button onClick={handleUserMessage} style={{ width: '20%' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
