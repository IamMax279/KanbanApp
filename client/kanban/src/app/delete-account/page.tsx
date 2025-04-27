"use client"

import { useState } from "react"
import styles from "../../styles/login.module.css"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

export default function DeleteAccount() {
    const [password, setPassword] = useState<string>("")
    const [secure, setSecure] = useState<boolean>(true)

    return (
        <div className="flex flex-col justify-start items-center min-h-screen">
            <form className={`${styles.loginContainer} min-w-72 w-1/4 rounded-2xl border border-neutral-800 p-4 mt-24`}>
                <div className="flex flex-row items-center justify-center">
                    <h1 className={`${styles.loginText} mb-12 lg:text-2xl text-lg`}>
                        Delete account
                    </h1>
                </div>
                <div className="flex flex-col space-y-6 -mt-4">
                    <div className="flex flex-col relative">
                        <div className="flex justify-between w-full mb-1">
                            <label className={`${styles.loginLabel} font-semibold text-base`}>
                                Password
                            </label>
                            <span className={`${styles.loginLabel} font-semibold text-base
                             text-zinc-300 brightness-90 cursor-pointer hover:brightness-75`}>
                                Forgot password?
                            </span>
                        </div>
                        <input type={`${secure ? 'password' : 'text'}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${styles.loginInput} outline-none text-black px-1 h-10 rounded-md
                        shadow-black shadow-inner`}/>
                        {secure ?
                        <FaRegEye
                        size={20}
                        className="absolute text-black right-[5px] top-[38px] cursor-pointer"
                        onClick={() => setSecure(prev => !prev)}
                        />
                        :
                        <FaRegEyeSlash
                        size={20}
                        className="absolute text-black right-[5px] top-[38px] cursor-pointer"
                        onClick={() => setSecure(prev => !prev)}
                        />
                        }
                    </div>
                </div>
                <div className="mt-8 mb-2">
                    <button className={`${styles.loginButton} flex flex-row w-full
                    justify-center items-center rounded-md`}
                    onClick={() => {}}>
                        Delete
                    </button>
                </div>
                {/* {loginError &&
                <div className="flex flex-row justify-center -mb-2 mt-2">
                    <p className={`${styles.uniqueErrorText}`}>
                        Wrong credentials.
                    </p>
                </div>
                } */}
            </form>
        </div>
    )
}