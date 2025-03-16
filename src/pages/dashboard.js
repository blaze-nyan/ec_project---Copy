"use client";

// import Image from "next/image";
// import logo from "../public/images/logo.jpg";
import { useRouter } from "next/navigation";
import AutoAIReportGenerator from "@/app/components/AutoAIReportGenerator";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaBan,
  // FaCalendarCheck,
  // FaCalendarDays,
  FaPlaneArrival,
} from "react-icons/fa6";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  // Pie,
  // PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  // Scatter,
  // ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  // ZAxis,
} from "recharts";
import "../app/globals.css";
import moment from "moment";
import { BsAirplaneEnginesFill, BsPersonHearts } from "react-icons/bs";
import { FaBirthdayCake } from "react-icons/fa";
import { MdBookmarkAdded, MdCardMembership } from "react-icons/md";
import { AiFillSafetyCertificate, AiFillSignal } from "react-icons/ai";
import { HiCurrencyDollar } from "react-icons/hi";

export default function Dashboard() {
  const router = useRouter();

  const [bookingData, setBookingData] = useState([]);

  const [guestData, setGuestData] = useState([]);

  const [currentMonthBData, setCurrentMonthBData] = useState([]);

  const [currentYearBData, setCurrentYearBData] = useState([]);

  const [cardData, setCardData] = useState({
    currentMonthArrival: 0,
    currentMonthArrivalPercentage: 0,
    currentYearArrival: 0,
    currentYearArrivalPercentage: 0,
    todayArrival: 0,
    todayDeparture: 0,
    bookingCancel: 0,
    bookingCancelPercentage: 0,
  });

  const startOfMonth = moment().startOf("month").startOf("day");

  const startOfYear = moment().startOf("year").startOf("day");

  const currentMonth = moment().month();

  const [monthlyIncome, setMonthlyIncome] = useState([]);

  const [yearlyIncome, setYearlyIncome] = useState([]);

  const [bookedUnit, setBookedUnit] = useState([]);

  const [memberVsGuest, setMemberVsGuest] = useState([]);

  const [occupyRateData, setOccupyRate] = useState([]);

  const [dataADR, setDataADR] = useState([]);

  const [ageSegmentation, setAgeSegmentation] = useState([]);

  const getBookingData = async () => {
    const response = await axios
      .get("/api/booking/getBookingsRequest")
      .then((res) => {
        console.log(res);
        const currentMonthData = res.data.bookingList.filter((booking) => {
          return (
            startOfMonth.format("MM/DD/YYYY") < booking["Booking Date"] &&
            moment().format("MM/DD/YYYY") >= booking["Booking Date"]
          );
        });

        const currentYearData = res.data.bookingList.filter((booking) => {
          return (
            startOfYear.format("MM/DD/YYYY") < booking["Booking Date"] &&
            moment().format("MM/DD/YYYY") >= booking["Booking Date"]
          );
        });

        const currentMonthArrival = res.data.bookingList.filter((booking) => {
          return (
            startOfMonth.format("MM/DD/YYYY") < booking["Arrival Day"] &&
            moment().format("MM/DD/YYYY") >= booking["Arrival Day"]
          );
        }).length;

        const currentYearArrival = res.data.bookingList.filter((booking) => {
          return (
            startOfYear.format("MM/DD/YYYY") < booking["Arrival Day"] &&
            moment().format("MM/DD/YYYY") >= booking["Arrival Day"]
          );
        }).length;

        const todayArrival = res.data.bookingList.filter((booking) => {
          return moment().format("MM/DD/YYYY") == booking["Arrival Day"];
        }).length;

        const todayDeparture = res.data.bookingList.filter((booking) => {
          return moment().format("MM/DD/YYYY") == booking["Departure Day"];
        }).length;

        const bookingCancel = currentMonthData.filter((booking) => {
          return booking["Is Cancel"] === true;
        }).length;

        let monthlyIncome = [];

        currentMonthData.forEach((booking) => {
          if (booking["Is Cancel"] === false) {
            const index = monthlyIncome.findIndex(
              (income) => income.name === booking["Booking Date"]
            );
            if (index === -1) {
              monthlyIncome.push({
                name: booking["Booking Date"],
                amount: booking["Amount"],
              });
            } else {
              monthlyIncome[index].amount += booking["Amount"];
            }
          }
        });

        let sortingArrayMonthlyIncome = monthlyIncome.sort(
          (a, b) => new Date(a["name"]) - new Date(b["name"])
        );

        let yearlyIncome = [];

        currentYearData.forEach((booking) => {
          if (booking["Is Cancel"] === false) {
            const index = yearlyIncome.findIndex(
              (income) =>
                income.name === moment(booking["Booking Date"]).format("MMMM")
            );
            if (index === -1) {
              yearlyIncome.push({
                name: moment(booking["Booking Date"]).format("MMMM"),
                month: moment(booking["Booking Date"]).month(),
                amount: Math.round(booking["Amount"]),
              });
            } else {
              yearlyIncome[index].amount += booking["Amount"];
            }
          }
        });

        let sortingArrayYearlyIncome = yearlyIncome.sort(
          (a, b) => a["month"] - b["month"]
        );

        let bookedUnit = [
          {
            name: "Single Room",
            value: 0,
          },
          {
            name: "Double Room",
            value: 0,
          },
          {
            name: "Deluxe Room",
            value: 0,
          },
          {
            name: "Suite Room",
            value: 0,
          },
          {
            name: "Superior Room",
            value: 0,
          },
        ];

        currentMonthData.forEach((booking) => {
          if (booking["Is Cancel"] === false) {
            const index = bookedUnit.findIndex(
              (income) => income.name === booking["Booking Unit"]
            );
            if (index === -1) {
              bookedUnit.push({
                name: booking["Booking Unit"],
                value: 0,
              });
            } else {
              bookedUnit[index].value += 1;
            }
          }
        });

        let memberVsGuest = [];

        currentMonthData.forEach((booking) => {
          if (booking["Is Cancel"] === false) {
            if (booking["Guest ID"] === null) {
              const index = memberVsGuest.findIndex(
                (income) => income.name === booking["Booking Date"]
              );
              if (index === -1) {
                memberVsGuest.push({
                  name: booking["Booking Date"],
                  member: 1,
                  guest: 0,
                });
              } else {
                memberVsGuest[index].member += 1;
              }
            } else {
              const index = memberVsGuest.findIndex(
                (income) => income.name === booking["Booking Date"]
              );
              if (index === -1) {
                memberVsGuest.push({
                  name: booking["Booking Date"],
                  member: 0,
                  guest: 1,
                });
              } else {
                memberVsGuest[index].guest += 1;
              }
            }
          }
        });

        let sortingMemberVsGuest = memberVsGuest.sort(
          (a, b) => new Date(a["name"]) - new Date(b["name"])
        );

        let occupyRateData = [];
        let avaliableRoom = 30;

        currentMonthData.forEach((booking) => {
          if (booking["Is Cancel"] === false) {
            const index = occupyRateData.findIndex(
              (income) => income.name === booking["Booking Date"]
            );
            if (index === -1) {
              occupyRateData.push({
                name: booking["Booking Date"],
                value: booking["Room Qty"],
                amount: booking["Amount"],
              });
            } else {
              occupyRateData[index].amount += booking["Room Qty"];
              occupyRateData[index].amount += booking["Amount"];
            }
          }
        });

        let sortingArrayOccupyRateData = occupyRateData.sort(
          (a, b) => new Date(a["name"]) - new Date(b["name"])
        );

        setOccupyRate(
          sortingArrayOccupyRateData.map((el) => {
            return {
              date: el["name"],
              value: Math.round((el["value"] / avaliableRoom) * 100),
            };
          })
        );

        setDataADR(
          sortingArrayOccupyRateData.map((el) => {
            return {
              date: el["name"],
              value: Math.round(el["amount"] / el["value"]),
            };
          })
        );

        const ageGroups = {
          "0-17": 0,
          "18-25": 0,
          "26-35": 0,
          "36-50": 0,
          "50+": 0,
        };

        currentMonthData.forEach((booking) => {
          if (booking["Is Cancel"] === false) {
            booking["Age Group"].forEach((age) => {
              if (age <= 17) ageGroups["0-17"]++;
              else if (age <= 25) ageGroups["18-25"]++;
              else if (age <= 35) ageGroups["26-35"]++;
              else if (age <= 50) ageGroups["36-50"]++;
              else ageGroups["50+"]++;
            });
          }
        });

        console.log(ageGroups);

        setAgeSegmentation([
          { name: "0-17", person: ageGroups["0-17"], fill: "#8884d8" },
          { name: "18-25", person: ageGroups["18-25"], fill: "#83a6ed" },
          { name: "26-35", person: ageGroups["26-35"], fill: "#8dd1e1" },
          { name: "36-50", person: ageGroups["36-50"], fill: "#82ca9d" },
          { name: "50+", person: ageGroups["50+"], fill: "#d0ed57" },
        ]);

        setCardData({
          ...cardData,
          currentMonthArrival: currentMonthArrival,
          currentMonthArrivalPercentage:
            (currentMonthArrival / currentMonthData.length) * 100,
          currentYearArrival: currentYearArrival,
          currentYearArrivalPercentage:
            (currentYearArrival / currentYearData.length) * 100,
          todayArrival: todayArrival,
          todayDeparture: todayDeparture,
          bookingCancel: bookingCancel,
          bookingCancelPercentage:
            (bookingCancel / currentMonthData.length) * 100,
        });

        setCurrentMonthBData(currentMonthData);
        setCurrentYearBData(currentYearData);
        setBookingData(res.data.bookingList);
        setMonthlyIncome(sortingArrayMonthlyIncome);
        setYearlyIncome(sortingArrayYearlyIncome);
        setBookedUnit(bookedUnit);
        setMemberVsGuest(sortingMemberVsGuest);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // console.log(currentMonthBData);
  // console.log(currentYearBData);

  const getGuestData = async () => {
    const response = await axios
      .get("/api/guest/getClientRequest")
      .then((res) => {
        // console.log(res);
        const currentBirthdayGuestList = res.data.guestList.filter((guest) => {
          const guestBirthdayMonth = moment(
            guest["Date of Birth"],
            "MM-DD-YYYY"
          ).month();
          return guestBirthdayMonth === currentMonth;
        });
        setGuestData(currentBirthdayGuestList);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(response);
  };

  useEffect(() => {
    getBookingData();
    getGuestData();
  }, []);

  return (
    <div className="p-4">
      <header className="header">
        <div className="logo">
          <p className="text-2xl text-green-500">CIMSO</p>
        </div>
        <nav className="nav">
          <a
            href="#"
            onClick={() => {
              router.push("/welcome");
            }}
          >
            HOME
          </a>
          <a
            href="#"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            DASHBOARD
          </a>
        </nav>
        <div className="hamburger">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-3 mb-5 lg:grid-cols-3">
        <div className="col-span-3">
          <p className="text-3xl font-bold text-center">
            Hotel Booking Performance Dashboard
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="card border-b-4 border-b-slate-500">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <FaPlaneArrival className="text-3xl text-black " />
              <p className="card-title">Arrival</p>
            </div>
          </div>
          <div className="flex items-center gap-x-2 mt-3 mb-2 px-6">
            <p className="text-lg">
              Number of Arrival :{" "}
              <span className="font-bold">{cardData.currentMonthArrival}</span>
            </p>
          </div>
          <div className="flex items-center gap-x-2 mb-2 px-6">
            <p className="text-lg">
              Percentage of Arrival :{" "}
              <span className="font-bold">{`${cardData.currentMonthArrivalPercentage}%`}</span>
            </p>
          </div>
        </div>
        <div className="card border-b-4 border-b-cyan-500">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <FaPlaneArrival className="text-3xl text-black " />
              <p className="card-title">Arrival (Year)</p>
            </div>
          </div>
          <div className="flex items-center gap-x-2 mt-3 mb-2 px-6">
            <p className="text-lg">
              Number of Arrival :{" "}
              <span className="font-bold">{cardData.currentYearArrival}</span>
            </p>
          </div>
          <div className="flex items-center gap-x-2 mb-2 px-6">
            <p className="text-lg">
              Percentage of Arrival :{" "}
              <span className="font-bold">{`${cardData.currentYearArrivalPercentage}%`}</span>
            </p>
          </div>
        </div>
        <div className="card border-b-4 border-b-blue-500">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <BsAirplaneEnginesFill className="text-3xl text-black" />
              <p className="card-title">{`Today's Arrivals & Departures`} </p>
            </div>
          </div>
          <div className="flex items-center gap-x-2 mt-3 mb-2 px-6">
            <p className="text-lg">
              Number of Arrival :{" "}
              <span className="font-bold">{cardData.todayArrival}</span>
            </p>
          </div>
          <div className="flex items-center gap-x-2 mb-2 px-6">
            <p className="text-lg">
              Number of Departure :{" "}
              <span className="font-bold">{cardData.todayDeparture}</span>
            </p>
          </div>
        </div>
        <div className="card border-b-4 border-b-violet-500">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <FaBan className="text-3xl text-black" />
              <p className="card-title">{`Booking Cancel`} </p>
            </div>
          </div>
          <div className="flex items-center gap-x-2 mt-3 mb-2 px-6">
            <p className="text-lg">
              Number of Cancel :{" "}
              <span className="font-bold">{cardData.bookingCancel}</span>
            </p>
          </div>
          <div className="flex items-center gap-x-2 mb-2 px-6">
            <p className="text-lg">
              Percentage of Cancel :{" "}
              <span className="font-bold">{`${Math.round(
                cardData.bookingCancelPercentage
              )}%`}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-3">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <BsPersonHearts className="text-3xl text-black" />
              <p className="card-title">
                Age Group Segmentation of Arrival Guests
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                width={730}
                height={250}
                innerRadius="10%"
                outerRadius="80%"
                data={ageSegmentation}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  label={{ fill: "#666", position: "insideStart" }}
                  background
                  clockWise={true}
                  dataKey="person"
                />
                <Legend
                  iconSize={10}
                  width={120}
                  height={140}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <FaBirthdayCake className="text-3xl text-black" />
              <p className="card-title">List of Guest Birthdays</p>
            </div>
          </div>
          <div className="mt-5 min-h-[300px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-200">
                  <th className="font-bold p-2">Full Name</th>
                  <th className="font-bold p-2">Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {guestData.map((el) => {
                  return (
                    <tr
                      className="border-b border-gray-400"
                      key={el["Guest ID"]}
                    >
                      <td className="font-bold text-center p-2">
                        {el["Full Name"]}
                      </td>
                      <td className="font-bold text-center p-2">
                        {el["Date of Birth"]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-3">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <MdCardMembership className="text-3xl text-black" />
              <p className="card-title">
                Member vs. General Guest Arrival Bookings
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="mt-5">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart width={730} height={250} data={memberVsGuest}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, "dataMax"]} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="member" fill="#8884d8" />
                  <Bar dataKey="guest" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <MdBookmarkAdded className="text-3xl text-black" />
              <p className="card-title">Most Frequently Booked Units</p>
            </div>
          </div>
          <div className="mt-5">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={bookedUnit}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, "dataMax"]} allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  barSize={30}
                  fill="darkblue"
                  name="Quantity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-3">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <AiFillSafetyCertificate className="text-3xl text-black" />
              <p className="card-title">Occupy Rate</p>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="mt-5">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={occupyRateData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line dataKey="value" type="monotone" name="Occupy Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <AiFillSignal className="text-3xl text-black" />
              <p className="card-title">Average Daily Rate (ADR)</p>
            </div>
          </div>
          <div className="mt-5">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dataADR}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar
                  dataKey="value"
                  barSize={30}
                  fill="lightblue"
                  name="Amount"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid mt-5 gap-3">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <HiCurrencyDollar className="text-3xl text-black" />
              <p className="card-title">Total Income</p>
            </div>
          </div>
          <div className="mt-5">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                width={730}
                height={250}
                data={monthlyIncome}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 px-4">
            <AutoAIReportGenerator
              data={monthlyIncome}
              title="Monthly Income"
              type="monthly"
            />
          </div>
        </div>
      </div>
      <div className="grid mt-5 gap-3">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-x-2">
              <HiCurrencyDollar className="text-3xl text-black" />
              <p className="card-title">Yearly Total Income</p>
            </div>
          </div>
          <div className="mt-5">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                width={730}
                height={250}
                data={yearlyIncome}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 px-4">
            <AutoAIReportGenerator
              data={yearlyIncome}
              title="Yearly Income"
              type="yearly"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
