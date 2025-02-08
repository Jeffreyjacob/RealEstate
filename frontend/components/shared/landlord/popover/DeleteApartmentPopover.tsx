import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useDeleteApartmentMutation } from '@/redux/features/apartmentApislice'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface DeleteApartmentPopoverProps {
    id:string
}

const DeleteApartmentPopover:React.FC<DeleteApartmentPopoverProps> = ({
    id
}) => {
    const [open,setOpen] = useState(false)
    const [deleteApartment,{isLoading}] = useDeleteApartmentMutation()
    const HandleDelete = async ()=>{
        try{
           await deleteApartment({id:id})
           toast.success('Apartment deleted')
           setOpen(false)
        }catch(error){
            console.log(error)
            toast.error('Something went wrong,Try again!')
        }
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger className='w-full flex gap-2  text-[13px] p-1 m-1 rounded-lg hover:bg-accent'>
                <Trash2 className='text-[#475467] w-4 h-4' />
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure, you want to delete ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this apartment 
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={()=>setOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={HandleDelete} disabled={isLoading}>
                        {
                            isLoading ? "deleting...":" Continue"
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default DeleteApartmentPopover