const { z } = require("zod");
const mongoose = require("mongoose");

/* ####################
   🔹 COMMON VALIDATORS
   #################### */
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

const topicSchema = z.string().min(3, "Topic must be at least 3 characters");

/* ####################
   🔹 USER SCHEMA
   #################### */
const userSchema = z.object({
  username: z.string().min(3).max(15).trim(),
  password: z.string().min(6),
  firstName: z.string().max(20).optional(),
  lastName: z.string().max(20).optional(),
});

/* ####################
   🔹 AUTH SCHEMAS
   #################### */
const loginSchema = z.object({
  username: z.string().min(3).max(15),
  password: z.string().min(6),
});

/* ####################
   🔹 GROUP SCHEMA
   #################### */
const groupSchema = z.object({
  name: z.string().max(50),
  owner: objectIdSchema.optional(),
  // devices: z.array(objectIdSchema).optional()
});

/* ####################
   🔹 DEVICE SCHEMA
   #################### */
const deviceSchema = z.object({ 
  name: z.string().max(50),
  group: objectIdSchema
});

/* ####################
   🔹 ELEMENT BASE SCHEMA
   #################### */
const baseElementSchema = z.object({
  name: z.string().max(50),
  device: objectIdSchema,
  subscribeTopic: topicSchema,
  type: z.enum(["switch", "sensor"]),
  subType: z.enum([
    "push",
    "toggle",
    "slider",
    "color_picker",
    "gauge",
    "widget",
    "notification",
  ]),
});

/* ####################
   🔹 SWITCH SUBTYPES
   #################### */
const pushButtonSchema = baseElementSchema.extend({
  subType: z.literal("push"),
  payload: z.string(),
});

const toggleSchema = baseElementSchema.extend({
  subType: z.literal("toggle"),
  payloadOn: z.string(),
  payloadOff: z.string(),
});

const sliderSchema = baseElementSchema.extend({
  subType: z.literal("slider"),
  minValue: z.number(),
  maxValue: z.number(),
  value: z.number().default(0),
});

const colorPickerSchema = baseElementSchema.extend({
  subType: z.literal("color_picker"),
  value: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Invalid RGB format").default("#FFFFFF"), // "#RRGGBB"
});

/* ####################
   🔹 SENSOR SUBTYPES
   #################### */
const gaugeSchema = baseElementSchema.extend({
  subType: z.literal("gauge"),
  minValue: z.number(),
  maxValue: z.number(), 
});

const widgetSchema = baseElementSchema.extend({
  subType: z.literal("widget"),
  unit: z.string(),
  icon: z.string()
}); 


const operatorNumberString = z.string()
  .refine(
    (value) => {
      // Matches "> 25", "< 30.5", ">= 15.75", etc.
      const pattern = /^(>=|<=|>|<)\s(\d+\.?\d*)$/; 
      return pattern.test(value);
    },
    {
      message: "Must be an operator (> < >= <=) followed by a space and a number (e.g., '> 25' or '<= 30.5')",
    }
  )
  .refine(
    (value) => {
      const [_, operator, numStr] = value.match(/^(>=|<=|>|<)\s(\d+\.?\d*)$/) || [];
      return !isNaN(parseFloat(numStr)); // Final numeric check
    },
    {
      message: "The value after the operator must be a valid number (e.g., '15' or '12.5')",
    }
  );

const notificationSchema = baseElementSchema.extend({
  subType: z.literal("notification"),
  element: objectIdSchema,
  message: z.string(),
  email: z.string().email(), 
  condition: operatorNumberString
});

/* ####################
   🔹 ELEMENT UNION TYPE
   #################### */
const elementSchema = z.union([
  pushButtonSchema,
  toggleSchema,
  sliderSchema,
  colorPickerSchema,
  gaugeSchema,
  widgetSchema,
  notificationSchema,
]);

module.exports = {
  userSchema,
  loginSchema,
  groupSchema,
  deviceSchema,
  elementSchema,
  pushButtonSchema,
  toggleSchema,
  sliderSchema,
  colorPickerSchema,
  gaugeSchema,
  widgetSchema,
  notificationSchema,
};
