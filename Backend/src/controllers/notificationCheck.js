const { Element } = require("../models/db");
const { sendEmailAlert } = require("./emailService");

const checkNotificationConditions = async (element) => {
  try{
  const rules = await Element.find({subType: "notification", element: element._id}).lean();
  
  if(rules){
  // console.log(rules);//debug
  
  rules.forEach((rule) => {
    const [operator, threshold] = rule.condition.split(" ");
    const thresholdValue = Number(threshold);
    let conditionMet = false;

    if (operator === ">" && element.value > thresholdValue) conditionMet = true;
    else if (operator === "<" && element.value < thresholdValue) conditionMet = true;

    if (conditionMet) {
      sendEmailAlert(rule.element, rule.condition, rule.message, rule.email);
      console.log(`Alert sent for ${rule.element}: ${rule.condition}`);
    }
    
  })
  };
}catch (error) {
    console.error("Error in checkNotificationConditions:", error);
  }
};

module.exports = { checkNotificationConditions };