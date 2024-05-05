import express, {Request, Response} from "express";
import axios from "axios";
import redis from "ioredis";

const app = express();
const redisClient = new redis()

app.get("/", (req: Request, res: Response) => {
  res.send("Bwang")
})

app.get("/photo", async (req: Request, res: Response) => {
  try {
    redisClient.get("threads", async (error: any, result: any) => {
      if(error) return res.status(500).json({ message: "Adakah uang seratus ?" })

      if(result != null) {
        const data = JSON.parse(result)
        return res.status(200).json(data)
      } else {
        const response = await axios.get("https://jsonplaceholder.typicode.com/photos")
        const data = JSON.stringify(response?.data)
        redisClient.setex("threads", 60, data)
        return res.status(200).json(response.data)
      }
    })
  } catch (err) {
    return res.status(500).json({ message: "Adakah uang seratus ?" })
  }
})

app.get("/photo/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://jsonplaceholder.typicode.com/photos/${id}`)

    return res.status(200).json(response.data)
  } catch (err) {
    return res.status(500).json({ message: "Adakah uang seratus ?" })
  }
})




app.listen(5000, () => console.log("START"))


// set property => SET
// set property with experied => SETEX
// get property => GET