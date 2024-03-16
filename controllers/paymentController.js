const stripe = require('stripe')('sk_test_51OiHCoSE17PdorGk2Lirmcz7coyV3RB5axlrxe4vt0IIy0SwYmr9slc6TEhoxHlAC0E7L8i7sY9RpoWmfLKg0zny00cgk3Dmr0');

exports.createCheckoutSession = async (req, res) => {
  console.log(process.env.STRIPE_SECRET_KEY);
  const { doctorId, selectedDate, selectedTimeSlot, amount } = req.body;
  try {

    const amountInCents = amount * 100; // Example assuming INR

    // Create a checkout session with detailed error handling
    const session = await stripe.checkout.sessions
      .create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr", // Change currency to INR
              product_data: {
                name: "Appointment Fee",
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: 'http://localhost:5173/success',
        cancel_url: 'http://localhost:5173/cancel', 
      })
      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Error creating Checkout session:', error);
      res.status(500).json({ error: 'Failed to create Checkout session' });
    }
};
