const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json({limit: '5mb'}))

const DB_PATH = path.join(__dirname, 'data', 'db.json')

function readDB(){
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function writeDB(obj){
  try {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true })
    fs.writeFileSync(DB_PATH, JSON.stringify(obj, null, 2), 'utf8')
    return true
  } catch (e){
    console.error('Failed to write DB', e)
    return false
  }
}

app.get('/api/ping', (req,res)=> res.json({ok:true}))

app.get('/api/db', (req,res)=>{
  const db = readDB()
  if (!db) return res.status(404).json({error:'db not found'})
  res.json(db)
})

app.post('/api/db', (req,res)=>{
  const body = req.body
  if (!body) return res.status(400).json({error:'no body'})
  const ok = writeDB(body)
  if (!ok) return res.status(500).json({error:'failed to save'})
  res.json({ok:true})
})

const port = process.env.PORT || 4000
app.listen(port, ()=> console.log(`Campus360 DB server running at http://localhost:${port}`))
