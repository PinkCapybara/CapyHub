const { Element } = require("../models/db");
const { sendEmailAlert } = require("./emailService");

const checkNotificationConditions = async (element) => {
  try{
  const rules = await Element.find({subType: "notification", element: element._id}).lean();
  
  rules.forEach((rule) => {
    const [operator, threshold] = rules.condition.split(" ");
    const thresholdValue = Number(threshold);
    let conditionMet = false;

    if (operator === ">" && element.value > thresholdValue) conditionMet = true;
    else if (operator === "<" && element.value < thresholdValue) conditionMet = true;

    if (conditionMet) {
      sendEmailAlert(rule.element, rule.condtion, rule.message, rule.email);
      console.log(`Alert sent for ${deviceId}: ${rule.condition}`);
    }
  });
}catch (error) {
    console.error("Error in checkNotificationConditions:", error);
  }
};

module.exports = { checkNotificationConditions };