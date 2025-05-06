"use client"

import { useState } from "react"
import styles from "../../styles/login.module.css"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import Loading from "@/components/Loading"
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import axios from "axios"
import { AuthService } from "@/services/authService"
import { useRouter } from "next/navigation"

export default function DeleteAccount() {
    const [password, setPassword] = useState<string>("")
    const [secure, setSecure] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const router = useRouter()

    const deleteAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            setLoading(true)
            setError(false)
            e.preventDefault()

            const token = await AuthService.getToken()
            if(!token) {
                throw new Error("Missing token.")
            }

            const response = await axios.post(
                "api/user/delete-account",
                {password},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            
            if(response.data.message === 'User deleted successfully') {
                AuthService.removeToken()
                AuthService.removeRefreshToken()

                setOpen(true)
            }
        } catch(error) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    if(loading) {
        return <Loading/>
    }

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
                {error &&
                <div className="flex flex-row justify-center -mb-6 mt-2">
                    <p className={`${styles.uniqueErrorText}`}>
                        Something went wrong.
                    </p>
                </div>
                }
                <div className="mt-8 mb-2">
                    <button className={`${styles.loginButton} flex flex-row w-full
                    justify-center items-center rounded-md`}
                    onClick={(e) => deleteAccount(e)}>
                        Delete
                    </button>
                </div>
            </form>
            <Modal isOpen={open}>
                <ModalContent className='bg-neutral-900'>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 text-center text-gray-100">Your account has been deleted</ModalHeader>
                    <ModalFooter className='flex flex-row justify-center items-center gap-2'>
                        <Button color="primary" onPress={() => {
                            router.replace('/login')
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