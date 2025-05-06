"use client"
import Link from "next/link";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import { useRouter } from "next/navigation";

import styles from "../../styles/home.module.css";

interface NavBarProps {
    firstName: string
}

export default function NavBar({firstName}: NavBarProps) {
    const [clicked, setClicked] = useState<boolean>(false)

    const router = useRouter()

    return(
        <nav className="bg-neutral-900 w-full bg-opacity-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className={`${styles.mainTitle}`} onClick={() => router.replace("/")}>
                                Kanban
                            </h1>
                        </div>
                    </div>
                    <div className="hidden md:block items-center">
                        <ul className="ml-4 flex items-center space-x-4 mx-auto">
                            <Link href="/">
                                <h4 className="hover:brightness-75 text-white">
                                    Dashboard
                                </h4>
                            </Link>
                            {/* <li>
                                <Link href="/">
                                    <h4 className="hover:brightness-75 text-white">
                                        Home
                                    </h4>
                                </Link>
                            </li> */}
                            <li>
                                <Link href="/addkanban">
                                    <h4 className="hover:brightness-75 text-white">
                                        New
                                    </h4>
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile">
                                    <h4 className="hover:brightness-75 text-white">
                                        Profile
                                    </h4>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/profile">
                            <h4 className="hover:brightness-75 hover:cursor-pointer self-center hidden md:block text-white">
                                Welcome {firstName}
                            </h4>
                        </Link>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                        className="inline-flex items-center justify-center p-2 rounded-xl"
                        onClick={() => setClicked(prev => !prev)}>
                            {!clicked ? (
                                <RxHamburgerMenu size={32} className="text-white"/>
                            ) : (
                                <RxCross1 size={32} className="text-white"/>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {clicked && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <ul className="ml-4 flex flex-col items-center space-y-2 mx-auto">
                            <li className="self-start">
                                <Link href="/">
                                    <h4 className="hover:brightness-75 text-white">
                                        Dashboard
                                    </h4>
                                </Link>
                            </li>
                            {/* <li className="self-start">
                                <Link href="/">
                                    <h4 className="hover:brightness-75 text-white">
                                        Home
                                    </h4>
                                </Link>
                            </li> */}
                            <li className="self-start">
                                <Link href="/addkanban">
                                    <h4 className="hover:brightness-75 text-white">
                                        New
                                    </h4>
                                </Link>
                            </li>
                            <li className="self-start">
                                <Link href="/profile">
                                    <h4 className="hover:brightness-75 text-white">
                                        Profile
                                    </h4>
                                </Link>
                            </li>
                            <li className="self-start">
                                <Link href="/profile">
                                    <h4 className="hover:brightness-75 text-white">
                                        Witaj {firstName}
                                    </h4>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    )
}