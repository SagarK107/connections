import express from "express";
import dotenv from "dotenv";
import pg from "pg";
const app = express();
const port = 3001;
const port_string = `http://localhost:3000`

import 'dotenv/config'



//connect to postgres
const { Client } = pg;
const client = new Client();
await client.connect();

async function readPatternData(id)
{

  try
  {
    const result = await client.query(`SELECT * from pattern where id=${id}`);
    const o = {}
    
      
    for (const [idx,row] of Object.entries(result.rows[0]))
    {
      o[idx] = row;
    }
  
    console.log(o);
    return o;
    
  }
  catch (err) {
    console.error('Error reading data:', err.stack);
    return {}
  } 
}

async function readQuestionData(id,res) {
  // Connect to the database
  

  try {
    // Execute a query to read data from the table
    const result = await client.query(`SELECT * from question where id=${id}`);

    // Log the retrieved rows
    if (result.rows.length > 0)
    {
      console.log('Data retrieved from the database:');
      console.table(result.rows);
      console.log(result.rows);
      var question = {}
      for (const [key,element] of Object.entries(result.rows[0]))
      {
        console.log(key,element);
        if ( key != 'id')
        {
          var o = await readPatternData(element);
          
          question[key] = o;
        }
      }
      res.json(question);
    }
    else
    {
      res.sendStatus(404);
    }
    
  } catch (err) {
    console.error('Error reading data:', err.stack);
    
  } 

  
  
}

app.use(express.json());

// Basic GET route
app.get('/', (req, res) => {
  res.set('Access-Control-Allow-Origin', port_string);
  res.send('Hello, World!');
});


app.get('/api/:id', (req, res) => {
    res.set('Access-Control-Allow-Origin', port_string);
    const itemId = parseInt(req.params.id, 10);
    readQuestionData(itemId,res);
    
  });



  
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

