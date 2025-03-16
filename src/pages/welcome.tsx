'use client'

import { useRouter } from "next/navigation";

import "../app/globals.css";

export default function Welcome() {

    const router = useRouter();

    return (
        <div className="bg-[#d7cfcd] min-h-[100%]">
            <header className="header">
                <div className="logo">
                <p className="text-2xl text-green-500">CIMSO</p>
                </div>
                <nav className="nav">
                    <a href="#">HOME</a>
                    <a href="#" onClick={() => {router.push("/dashboard")}}>DASHBOARD</a>
                </nav>
                <div className="hamburger">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </header>
            <div className="content">
                <h1>Welcome</h1>
                <h2>YOUR CHOICE</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

        </div>
    )

}