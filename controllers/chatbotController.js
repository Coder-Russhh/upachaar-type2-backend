const axios = require("axios");

const generateRes = (intent, entities) => {
  switch (intent) {
    case "greeting":
      return "Hello there! How can I help you today?";

    case "goodbye":
      return "Goodbye! It was nice chatting with you.";

    default:
      return "I'm not sure I understand. Could you rephrase your question?";
  }
};

const generateResponse = (intent, entities) => {
  switch (intent) {
    case "MedicationInfo":
      // Check if the entity array exists and has at least one element
      const medicationEntity = entities["wit_Medication"];
      if (medicationEntity && medicationEntity.length > 0) {
        const medication = medicationEntity[0].value;
        return `Sure, let me provide information about ${medication}.`;
      } else {
        return "I'm sorry, I couldn't identify the medication.";
      }
    default:
      return "I'm sorry, I didn't understand your question.";
  }
};

exports.chatBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: "Invalid request: message is required" });
      return;
    }

    const response = await axios.get("https://api.wit.ai/message", {
      headers: {
        Authorization: `Bearer ${process.env.CHAT_TOKEN}`,
      },
      params: {
        q: message,
      },
    });

    const data = response.data;

    // Handle errors from Wit.ai API or missing data
    if (!data || !data.intents || data.intents.length === 0) {
      res.status(500).json({
        error: "Failed to process message",
        witError: data.error || null,
      });
      return;
    }

    // Extract intents and entities
    const intent = data.intents[0].name; // Assuming only one intent is considered
    const entities = data.entities || {};
    console.log(intent)

    const answer = generateResponse(intent, entities);

    res.json({ answer });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
