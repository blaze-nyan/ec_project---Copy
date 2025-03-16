import { NextResponse } from "next/server";
import axios from "axios";
import { bookingList} from "../../../app/const";

const BASE_URL = "https://ixschool.cimso.xyz";

const headers = {
  Authorization: JSON.stringify({
    "Client Login ID": "CiMSO.dev",
    "Client Password": "CiMSO.dev",
    hg_pass: "nGXUF1i^57I^ao^o",
  }),
  "Content-Type": "application/json",
};

export const config = {
    runtime: "edge",
};

export default async function GET() {
        
    try {
        // const response = await axios.post(`${BASE_URL}/get_bookings_request`, {"hg_code": "ixschool",
        // "payload": {},}, {headers});
        // console.log(response.data);
        // const bookingData = response.data.payload["Booking IDs"];
        // console.log(bookingData);
        return NextResponse.json(
            {
            "isSuccess": true,
            bookingList,
            },
            {status: 200},
        );

    } catch (err) {
        console.log(err.response ? err.response.data : err.message);
        return NextResponse.json({error: "Failed to get booking"}, {status: 500});

    }


}