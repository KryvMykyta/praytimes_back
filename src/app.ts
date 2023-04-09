import express from 'express'
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors'
import { PrayTimesController } from './controllers/PrayTimesController';


const app = express()

const PORT = 3000

app.use(express.json())
app.use(cors())

const prayTimesController = new PrayTimesController('/praytimes')

const controllers = [prayTimesController]

controllers.forEach((controller)=>{
    app.use(controller.path, controller.router)
})

app.listen(PORT, () => {
    console.log("started")
})