// Function to validate payload based on subtype
const isValidPayload = (element, payload) => {
    if (element.type !== "switch") return { valid: false, error: "Element is not a switch" };

    switch (element.subtype) {
        case "push":
            if (payload !== element.pushPayload) return { valid: false, error: "Invalid push button payload" };
            break;
        case "toggle":
            if (payload !== element.onPayload && payload !== element.offPayload) {
                return { valid: false, error: "Invalid toggle payload" };
            }
            break;
        case "slider":
            if (isNaN(payload)) return { valid: false, error: "Slider payload must be a number" };
            if(payload < element.minValue || payload < element.minValue)  return { valid: false, error: " payload must be in slider range" };
            break;
        case "colorPicker":
            const colorRegex = /^#[0-9A-Fa-f]{6}$/; // Hex color validation
            if (!colorRegex.test(payload)) return { valid: false, error: "Invalid color format" };
            break;
        default:
            return { valid: false, error: "Unknown switch subtype" };
    }

    return { valid: true };
};

module.exports = isValidPayload;