"use client"
import { useEffect, useState } from "react"
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

import { UserData, ProfileService } from "../../services/profileService"
import styles from "../../styles/profile.module.css"
import { AuthService } from "../../services/authService";
import Loading from "@/components/Loading";

export default function Profile() {
    const [userData, setUserData] = useState<UserData | undefined>(undefined)
    const [cubes, setCubes] = useState<JSX.Element[]>([])

    const router = useRouter()

    const profileService = new ProfileService()

    useEffect(() => {
        const token = AuthService.getToken()
        if(!token) {
            router.replace('/login')
        }

        const fetchData = async () => {
            const result = await profileService.fetchUserData()
            if(result.success) {
                setUserData({
                    firstName: result.data!.firstName,
                    secondName: result.data!.secondName,
                    kanbansLength: result.data!.kanbansLength,
                    email: result.data!.email,
                    kanbanDates: result.data!.kanbanDates,
                    resolvedKanbans: result.data!.resolvedKanbans
                })
            }
        }
        fetchData()
    }, [])

    const renderColor = (amount: number) => {
        switch(amount) {
            case 0:
                return "bg-neutral-900"
            case 1:
                return "bg-sky-700 opacity-80"
            case 2:
                return "bg-sky-600 opacity-80"
            case 3:
                return "bg-sky-500 opacity-80"
            case 4:
                return "bg-sky-400 opacity-80"
            default:
                return "bg-sky-300 opacity-80"
        }
    }

    useEffect(() => {
        if(!userData) return
        const renderCubes = () => {
            const cubes = []
    
            const freq = new Map<number, number>()
    
            for(let i = 0; i < 30; i++) {
                freq.set(i, 0)
            }
    
            for(const date of userData!.kanbanDates) {
                const daysAgo = mapDateToDaysAgo(date)
                if(daysAgo >= 0 && daysAgo < 30) {
                    freq.set(daysAgo, freq.get(daysAgo)! + 1)
                }
            }
    
            for(let i = 0; i < 30; i++) {
                cubes.push(<div key={i} className={`w-5 h-5 ${styles.cube} ${renderColor(freq.get(i)!)}`}></div>)
            }
            setCubes(cubes)
        }
        renderCubes()
    }, [userData])

    const mapDateToDaysAgo = (dateString: string): number => {
        const cleaned = dateString.replace(' CEST', '').replace(' CET', '');
    
        const parsedDate = new Date(cleaned);
    
        if (isNaN(parsedDate.getTime())) {
            return -1;
        }
    
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        parsedDate.setHours(0, 0, 0, 0);
    
        const diffTime = today.getTime() - parsedDate.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleLogout = async () => {
        const result = profileService.logOut()
        if(result.success) {
            router.replace("/login")
        }
    }

    if(!userData) return <Loading/>

    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-row items-center justify-center">
                {userData &&
                <div className="flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row items-center">
                        <div className="flex flex-col p-4 sm:border-r sm:border-gray-100">
                            <h2 className="text-lg font-medium text-gray-100 mb-4">
                                Email: {userData.email}
                            </h2>
                            <h2 className="text-lg font-medium text-gray-100 flex flex-row self-center sm:self-start">
                                Resolved kanbans: {userData.resolvedKanbans}
                            </h2>
                        </div>
                        <div className="mr-6 flex flex-col text-center items-end pl-4 mt-4 sm:mt-0">
                            <h2 className="text-xl font-medium text-gray-100 flex flex-row self-center sm:self-start">
                                Activity in the last
                            </h2>
                            <h2 className="text-xl font-medium text-gray-100 flex flex-row self-center sm:self-start">
                                30 days
                            </h2>
                        </div>
                        <div className="flex justify-center items-center mt-2 sm:mt-0"
                        style={{transform: `rotateX(180deg) rotateY(180deg)`}}>
                            <div className="grid grid-cols-6 gap-2">
                                {cubes.map(cube => cube)}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Button color="primary" variant='solid'
                        className='text-gray-100 font-semibold'
                        onPress={() => handleLogout()}>
                            Log out
                        </Button>
                        <Button color="danger" variant='flat'
                        className='text-gray-100 font-semibold'
                        onPress={() => router.push('/delete-account')}>
                           Delete account
                        </Button>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}