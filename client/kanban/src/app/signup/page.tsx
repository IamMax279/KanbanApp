"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styles from "../../styles/login.module.css"
import { SignupService } from "@/services/signupService"
import Loading from "@/components/Loading";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@nextui-org/modal";

export default function SignUp() {
    const [firstName, setFirstName] = useState<string>("")
    const [secondName, setSecondName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [secure, setSecure] = useState<boolean>(true)
    const [uniqueViolation, setUniqueViolation] = useState<boolean>(false)
    const [emptyField, setEmptyField] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)

    const router = useRouter()

    const service = new SignupService()

    const onSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setUniqueViolation(false)
        setEmptyField(false)
        
        try {
            setLoading(true)
            e.preventDefault()

            const response = await service.handleSignup({
                firstName,
                secondName,
                email,
                password
            })

            switch(response.errStatus) {
                case 500:
                    setUniqueViolation(true)
                    break
                case 403:
                    setEmptyField(true)
                    break
            }

            if(response.success) {
                setSuccess(true)
            }
        } catch(error) {
            setEmptyField(true)
        }
        finally {
            setLoading(false)
        }
    }

    if(loading) {
        return <Loading/>
    }

    return(
        <div className="flex flex-col justify-center items-center h-screen">
            <form className={`${styles.signupContainer} min-w-72 w-1/4 rounded-2xl border border-neutral-800 p-4`}>
                <div className="flex flex-row items-center justify-center">
                    <h1 className={`${styles.loginText} mb-7 lg:text-2xl text-lg`}>
                        Sign up to Kanban
                    </h1>
                </div>
                <div className="flex flex-col space-y-6 -mt-4">
                    <div className="flex flex-col">
                        <label className={`${styles.loginLabel} font-semibold text-base mb-1`}>
                            First name
                        </label>
                        <input type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`${styles.loginInput} outline-none text-black px-1 h-10 rounded-md
                        shadow-black shadow-inner`}/>
                    </div>
                    <div className="flex flex-col">
                        <label className={`${styles.loginLabel} font-semibold text-base mb-1`}>
                            Second name
                        </label>
                        <input type="text"
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)}
                        className={`${styles.loginInput} outline-none text-black px-1 h-10 rounded-md
                        shadow-black shadow-inner`}/>
                    </div>
                    <div className="flex flex-col">
                        <label className={`${styles.loginLabel} font-semibold text-base mb-1`}>
                            E-mail
                        </label>
                        <input type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${styles.loginInput} outline-none text-black px-1 h-10 rounded-md
                        shadow-black shadow-inner`}/>
                    </div>
                    <div className="flex flex-col relative">
                        <div className="flex justify-between w-full mb-1">
                            <label className={`${styles.loginLabel} font-semibold text-base`}>
                                Password
                            </label>
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
                    onClick={(e) => onSignup(e)}>
                        Sign up
                    </button>
                </div>
                {uniqueViolation &&
                <div className="flex flex-row justify-center mt-4 -mb-2">
                    <p className={`${styles.uniqueErrorText} self-center`}>
                        This email is already in use.
                    </p>
                </div>
                }
                {emptyField &&
                <div className="flex flex-row justify-center mt-4 -mb-2">
                    <p className={`${styles.uniqueErrorText} self-center`}>
                        All fields must be filled.
                    </p>
                </div>
                }
                <div className={`flex justify-center items-center mt-5`}>
                    <p className={`${styles.loginP}`}>
                        Already have an account?
                        <Link href="/login">
                            <span className="text-zinc-300 brightness-90 hover:brightness-75 cursor-pointer">
                                {' '} Sign in
                            </span>
                        </Link>
                    </p>
                </div>
            </form>
            <Modal isOpen={success}>
                <ModalContent className='bg-neutral-900'>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 text-center text-gray-100">
                        Signed up successfully.
                    </ModalHeader>
                    <ModalFooter className='flex flex-row justify-center items-center gap-2'>
                        <Button color="primary" onPress={() => {
                            router.replace('/')
                        }} className='font-semibold'>
                        OK
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </div>
    )
}