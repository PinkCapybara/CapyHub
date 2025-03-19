const mongoose = require("mongoose");
const argon2 = require("argon2");
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 15
  },
  password: {
      type: String,
      required: true,
      minLength: 6
  },
  firstName: {
      type: String,
      required: false,
      trim: true,
      maxLength: 20,
      default: ""
  },
  lastName: {
      type: String,
      required: false,
      trim: true,
      maxLength: 20,
      default: ""
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }]
})

// Automatically Hash Password Before Saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon2.hash(this.password);
  next();
});

// Validate Password 
UserSchema.methods.validatePassword = async function (password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (e) {
    return false;
  }
};

const User = mongoose.model("User", UserSchema);

// Instance implementation ?? Maybe

const GroupSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // devices: [{type: mongoose.Schema.Types.ObjectId, ref: "Device"}]
})

const Group = mongoose.model("Group", GroupSchema);

const DeviceSchema = new mongoose.Schema({
  name: String,
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Element" }],
});

const Device = mongoose.model("Device", DeviceSchema);

const ElementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    device: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
    deviceName: String,
    groupName: String,
    publishTopic: { type: String, required: true },
    subscribeTopic: { type: String, required: true },
    type: { type: String, enum: ["switch", "sensor"], required: true },
    subType: { type: String, enum: ["push", "toggle", "slider", "color_picker", "gauge", "widget", "notification"], required: true }
}, { discriminatorKey: "subType"});

const Element = mongoose.model("Element", ElementSchema);

/*########
  Switches
  #######*/ 

// Push button
const PushButtonSchema = new mongoose.Schema({
  payload: { type: String, required: true }
});
const PushButton = Element.discriminator("push", PushButtonSchema);

// Toggle Button
const ToggleSchema = new mongoose.Schema({
  payloadOn: { type: String, required: true },
  payloadOff: { type: String, required: true },
  value: { 
    type: Number, 
    default: 0, 
    enum: [0, 1] // Restricts values to only 0 or 1
  }
});
const Toggle = Element.discriminator("toggle", ToggleSchema);

// Slider
const SliderSchema = new mongoose.Schema({
  minValue: { type: Number, required: true },
  maxValue: { type: Number, required: true },
  value: { 
    type: Number, 
    default: function() { return this.minValue; } 
  }
});
const Slider = Element.discriminator("slider", SliderSchema);

// Color Picker
const ColorPickerSchema = new mongoose.Schema({
  rgb: {
      type: String,  // Example: "#FF5733"
      required: true,
      default: "#FFFFFF"
  }
});
const ColorPicker = Element.discriminator("color_picker", ColorPickerSchema);

/*########
  Sensors
  #######*/ 

// Gauges
const GaugeSchema = new mongoose.Schema({
  minValue: { type: Number, required: true },
  maxValue: { type: Number, required: true },
  value: { 
    type: Number, 
    default: function() { return this.minValue; } 
  }
});
const Gauge = Element.discriminator("gauge", GaugeSchema);

// Widgets
const WidgetSchema = new mongoose.Schema({
  unit: { type: String, required: true },
  value: { type: Number, default: 0 }
});
const Widget = Element.discriminator("widget", WidgetSchema);

// Notification
const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  email: { type: String, required: true },
  condition: { type: String,  required: true},
  flag: { type: Boolean,  default: false},
});
const Notification = Element.discriminator("notification", NotificationSchema);


module.exports = {
  User,
  Group,
  Device,
  Element,
  PushButton,
  Toggle,
  Slider,
  ColorPicker,
  Gauge,
  Widget,
  Notification
}