require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 4000;
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("No here");
});

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

app.post("/send-opt", (req, res) => {
  const { countryCode, phoneNumber } = req.body;
  console.log(`+${countryCode}${phoneNumber}`);
  try {
    const otpResponse = client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+${countryCode}${phoneNumber}`,
        channel: "sms",
      });
    res
      .status(200)
      .send(`Otp send successfully!: ${JSON.stringify(otpResponse)}`);
  } catch (e) {
    res.status(e?.status || 400).send(e?.message || "Something went wrong");
  }
});

app.post("verify-otp", (req, res) => {
  const { countryCode, phoneNumber, otp } = req.body;
  try {
    const verifyResponse = client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });
  } catch (e) {
    res.status(e?.status || 400).send(e?.message || "Something went wrong");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
