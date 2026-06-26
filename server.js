require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoint to submit contact form
app.post('/api/contact', (req, res) => {
  const { name, email, phone, company, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
  }

  // 1. Save to Database
  const sql = `INSERT INTO messages (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [name, email, phone || '', company || '', subject, message], async function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to save message to database.' });
    }

    const messageId = this.lastID;

    // 2. Send Email via Web3Forms API
    try {
      const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
      
      if (!accessKey || accessKey === 'your-web3forms-access-key') {
        console.warn('Web3Forms Access Key is missing. Skipping email notification.');
        return res.status(201).json({ message: 'Message saved to database, but email skipped (No Web3Forms key).', id: messageId });
      }

      const emailPayload = {
        access_key: accessKey,
        subject: `New Contact Form Submission: ${subject}`,
        from_name: "Arnav Infoweb Website",
        name: name,
        email: email,
        phone: phone || 'Not provided',
        company: company || 'Not provided',
        message: message
      };

      // Node 18+ has built-in fetch
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      const result = await response.json();

      if (result.success) {
        console.log('Web3Forms email sent successfully');
        res.status(201).json({ message: 'Message saved and email sent successfully!', id: messageId });
      } else {
        console.error('Web3Forms failed to send email:', result.message);
        res.status(201).json({ message: 'Message saved, but email notification failed.', id: messageId });
      }

    } catch (emailError) {
      console.error('Network error while contacting Web3Forms:', emailError);
      res.status(201).json({ message: 'Message saved, but email notification encountered an error.', id: messageId });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
