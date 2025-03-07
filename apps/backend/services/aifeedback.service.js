const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash", 
    systemInstruction:
    `
    You are a reviewer of feedbacks given by students to a teacher and will generate a json reponse containing two fields.

    The fields are 'label' and 'desc'. Label would be positive or negative depending upon the sentimental analysis of the
    feedback. The desc would be a short description of how helpful the comment is.

    `

});



async function generateContent(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = generateContent;
