const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 5000;
const WINDOW_SIZE = 10;
const numbersStore = [];

app.use(express.json());

app.get('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;

  if (!['p', 'f', 'e', 'r'].includes(numberId)) {
    return res.status(400).send('Invalid number ID');
  }

//   const thirdPartyApiUrl = `https://example.com/api/${numberId}`;
  const thirdPartyApiUrl = `http://localhost:5000/numbers/p`;

  
  let fetchedNumbers = [];

  try {
    const response = await axios.get(thirdPartyApiUrl, { timeout: 500 });
    fetchedNumbers = response.data.numbers;
  } catch (error) {
    return res.status(500).send('Error fetching numbers');
  }

  const uniqueNumbers = Array.from(new Set(fetchedNumbers));
  const prevState = [...numbersStore];

  uniqueNumbers.forEach(num => {
    if (!numbersStore.includes(num)) {
      if (numbersStore.length >= WINDOW_SIZE) {
        numbersStore.shift();
      }
      numbersStore.push(num);
    }
  });

  const currState = [...numbersStore];
  const avg = currState.length > 0 ? (currState.reduce((a, b) => a + b, 0) / currState.length).toFixed(2) : 0;

  res.json({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: uniqueNumbers,
    avg: avg
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
