"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "../../styles/login.module.css"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddKanbanService } from "../../services/addkanbanService"

export default function AddKanban() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        label: '',
        deadline: '',
        status: 'TODO'
    })
    const [selectedLabel, setSelectedLabel] = useState<string>("Choose")
    const [addError, setAddError] = useState<boolean>(false)

    const router = useRouter()

    const addKanbanService = new AddKanbanService()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            e.preventDefault()
            const result = await addKanbanService.addNewKanban(formData)

            if(result.errStatus === 403) {
                setAddError(true)
            }

            if(result.success) {
                setAddError(false)
                router.push("/")
            }
        } catch(e) {
            console.log("error submiting form", e)
        }
    }

    return (
        <div>
            <div className="p-8 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-100 mb-8">Add New Kanban Card</h1>
                <form onSubmit={() => {}} className="w-full max-w-lg bg-neutral-800 shadow-md rounded-lg overflow-hidden">
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-lg font-semibold text-gray-200">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`${styles.newKanbanInput} w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent`}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="text-lg font-semibold block text-gray-200">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className={`${styles.newKanbanInput} w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent`}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="label" className="block text-lg font-semibold text-gray-200">
                                Label
                            </label>
                            <DropdownMenu>
                            <DropdownMenuTrigger className={`${styles.newKanbanInput} text-zinc-300`}>
                                <div className="px-2 py-1 bg-neutral-700 rounded-lg hover:brightness-110">
                                    {selectedLabel}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                                {/* <DropdownMenuSeparator /> */}
                                <DropdownMenuItem onClick={() => {
                                    setSelectedLabel("Urgent")
                                    setFormData(data => ({...data, label: "Urgent"}))
                                }}>
                                    Urgent
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    setSelectedLabel("School")
                                    setFormData(data => ({...data, label: "School"}))
                                }}>
                                    School
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    setSelectedLabel("Personal")
                                    setFormData(data => ({...data, label: "Personal"}))
                                }}>
                                    Personal
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-lg font-semibold text-gray-200">
                                Due Date
                            </label>
                            <input
                                type="date"
                                id="dueDate"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className={`${styles.newKanbanInput} w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent`}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`${styles.newKanbanInput} w-full bg-neutral-700 text-gray-100 px-4 py-2 rounded-md hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-800`}
                            onClick={(e) => handleSubmit(e)}>
                            Create Card
                        </button>
                        {addError &&
                        <div className="flex flex-row justify-center -mb-2 mt-2">
                            <p className={`${styles.uniqueErrorText}`}>
                                Title, label and date are required.
                            </p>
                        </div>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}