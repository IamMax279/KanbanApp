"use client"
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Switch } from "@nextui-org/switch";
import { Progress } from "@nextui-org/progress";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";

import styles from "../../styles/wholekanban.module.css"
import { AddKanbanService } from '@/services/addkanbanService';

export default function WholeKanban() {
    const [checked, setChecked] = useState<boolean>(false)
    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const searchParams = useSearchParams()
    const router = useRouter()

    const service = new AddKanbanService()

    const id = searchParams.get("id")
    const description = searchParams.get("description")
    const title = searchParams.get("title")
    const status = searchParams.get("status")
    const deadline = searchParams.get("deadline")
    const label = searchParams.get("label")

    useEffect(() => {
        setChecked(status === "DONE")
        console.log(id, description, title, status, deadline, label)
    }, [])

    const calculateDateDiffrence = () => {
        if(!deadline) return 0

        const deadlineDate = new Date(deadline)
        const currentDate = new Date()

        deadlineDate.setHours(0, 0, 0, 0)
        currentDate.setHours(0, 0, 0, 0)

        const diffTime = deadlineDate.getTime() - currentDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return 100-((diffDays * 7) + 2)
    }

    const handleDelete = async (id: string) => {
        try {
            const result = await service.deleteKanban(id)
            if(result.success) {
                router.replace('/')
            }
        } catch(error) {
            console.log("error in delete", error)
        }
    }

    const updateKanbanStatus = async () => {
        try {
            const result = await service.updateKanbanStatus(id!, checked ? "DONE" : "TODO")
            if(result.success) {
                router.replace("/")
            }
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center p-4'>
            <div className='border rounded-xl border-neutral-700 w-1/3 flex flex-col p-4 min-w-72'>
                <h1 className='text-3xl font-bold text-gray-100 mb-8 self-center text-center'>
                    {title}
                </h1>
                <div className='flex text-gray-100 self-center'>
                    <p>{description}</p>
                </div>
                <div className='flex flex-col space-y-2'>
                    <label className='text-lg font-semibold text-gray-200'>
                        Status
                    </label>
                    <div className='flex flex-row items-center'>
                        <div className={`mr-2 p-2 border rounded-xl border-neutral-700 ${styles.statusBox}`}>
                            <p className='text-gray-100 text-sm cursor-default font-medium'>
                                {checked ? "DONE" : "TODO"}
                            </p>
                        </div>
                        <Switch
                        isSelected={checked}
                        onChange={() => {
                            if(status === "TODO") {
                                setChecked(prev => !prev)
                            }
                        }}
                        color='default'/>
                    </div>
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='text-lg font-semibold text-gray-200'>
                        Deadline
                    </label>
                    <div className='flex flex-row items-center'>
                        <div className={`flex flex-row items-center mt-2 p-2 border rounded-xl border-neutral-700 ${styles.statusBox}`}>
                            <p className='text-gray-100 text-sm cursor-default font-medium'>
                                {deadline}
                            </p>
                        </div>
                        <Progress value={calculateDateDiffrence()} className='w-52 mt-2 ml-2' color='secondary'/>
                    </div>
                </div>
                <div className='flex flex-row justify-between items-center mt-4'>
                    <Button color="primary" variant='solid'
                    className='text-gray-100 font-semibold'
                    onPress={() => updateKanbanStatus()}>
                        Save
                    </Button>
                    <Button onPress={onOpen} color="danger" variant='flat'
                    className='text-gray-100 font-semibold'>
                        Delete
                    </Button>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent className='bg-neutral-900'>
                        {(onClose) => (
                            <>
                            <ModalHeader className="flex flex-col gap-1 text-center text-gray-100">Deleting a Kanban</ModalHeader>
                            <ModalBody>
                                <p className='text-center text-gray-100'>
                                    Are you sure you want to delete this Kanban?
                                </p>
                            </ModalBody>
                            <ModalFooter className='flex flex-row justify-center items-center gap-2'>
                                <Button color="danger" variant="light" onPress={onClose} className='font-semibold'>
                                No
                                </Button>
                                <Button color="primary" onPress={() => handleDelete(id!)} className='font-semibold'>
                                Yes
                                </Button>
                            </ModalFooter>
                            </>
                        )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>
        </div>
    )
}