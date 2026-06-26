const accessKey = 'd7aef4ea-7b76-4ecb-99eb-88a5de1267b0';

async function testWeb3Forms() {
  console.log('Sending direct test to Web3Forms...');
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "Web3Forms Direct Test",
        from_name: "Arnav Infoweb Server",
        name: "Test User",
        email: "test@example.com",
        message: "This is a direct API test to confirm Web3Forms is working."
      })
    });

    const text = await response.text();
    console.log('Raw Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

testWeb3Forms();
