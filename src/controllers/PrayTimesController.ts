import { Router, Request, Response } from "express";
import {PrayTimes} from './../utils/PrayTimes'

type MethodsCount = "MWL" | "ISNA" | "Egypt" | "Makkah" | "Karachi" | "Tehran" | "Jafari"

type AnnualQueryRequest = {
    lat: number,
    lng: number,
    year: number,
    timeZone: number,
    dst: number,
    timeFormat: string,
    method: MethodsCount
}

type MonthlyQueryRequest = {
    lat: number,
    lng: number,
    month: number,
    year: number,
    timeZone: number,
    dst: number,
    timeFormat: string,
    method: MethodsCount
}

type DailyQueryRequest = {
    lat: number,
    lng: number,
    month: number,
    day: number,
    year: number,
    timeZone: number,
    dst: number,
    timeFormat: string,
    method: MethodsCount
}

type DayPrayTimes = {
    date: string,
    imsak: string,
    fajr: string,
    sunrise: string,
    dhuhr: string,
    asr: string,
    sunset: string,
    maghrib: string,
    isha: string,
    midnight: string
}



export class PrayTimesController {
    path: string;
    router: Router
    constructor(path:string){
        this.path = path
        this.router = Router()
        this.router.get('/daily', this.getDaily)
        this.router.get('/monthly', this.getMonthly)
        this.router.get('/annual', this.getAnnual)
    }
    getAnnual(req: Request<{},{},{}, AnnualQueryRequest>, res: Response) {
        try{
            const {lat, lng, year, timeZone, dst, timeFormat, method} = req.query
            const p = PrayTimes(method)
            const date = new Date(year, 0, 1);
            const endDate = new Date(1*year + 1, 0, 1);
            const responseData : DayPrayTimes[] = []
            while(date<endDate){
                responseData.push({...p.getTimes(date,[lat,lng],timeZone,dst,timeFormat), date:date.toDateString()})
                date.setDate(date.getDate()+1)
            }
            return res.status(200).send(responseData)
        } catch(err) {
            return res.status(500).send(err)
        }
        
    }
    getMonthly(req: Request<{},{},{}, MonthlyQueryRequest>, res: Response) {
        try{
            const {lat, lng, month, year, timeZone, dst, timeFormat, method} = req.query
            const p = PrayTimes(method)
            const date = new Date(1*year, month, 1);
            const endDate = new Date(1*year, 1*month+1, 1);
            const responseData : DayPrayTimes[] = []
            while(date<endDate){
                responseData.push({...p.getTimes(date,[lat,lng],timeZone,dst,timeFormat), date:date.toDateString()})
                date.setDate(date.getDate()+1)
            }
            return res.status(200).send(responseData)
        } catch(err) {
            return res.status(500).send(err)
        }
        
    }
    getDaily(req: Request<{},{},{}, DailyQueryRequest>, res: Response) {
        try {
            const {lat, lng, month,day, year, timeZone, dst, timeFormat, method} = req.query
            const p = PrayTimes(method)
            return res.send(p.getTimes(new Date(year, day, month),[lat,lng],timeZone,dst,timeFormat))
        }catch(err) {
            return res.status(500).send(err)
        }
        
    }
}