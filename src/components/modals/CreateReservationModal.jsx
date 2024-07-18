import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import userStore from '@/lib/store/userStore';
import useReservationStore from '@/lib/store/reservationStore';
import axiosInstance from '@/lib/axiosInstance';

const reservationSchema = z
    .object({
        startDate: z.coerce.date().refine((data) => data > new Date(), { message: "Start date must be in the future" }),
        endDate: z.coerce.date(),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: "End date cannot be earlier than start date.",
        path: ["endDate"]
    });


const CreateReservationModal = ({ roomId, setStatus, roomNumber }) => {

    const { userId } = userStore();
    const { addReservationId } = useReservationStore();

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(reservationSchema)
    });

    const saveReservationDetails = (reservationId, reservationUserId, roomId) => {
        addReservationId({ reservationId, reservationUserId, roomId });
        setStatus("pending");
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const { startDate, endDate } = data;

            const res = await axiosInstance.post(import.meta.env.VITE_CREATE_RESERVATION_URL, {
                bookingDetails: {
                    roomId,
                    userId,
                    startDate,
                    endDate,
                    roomNumber
                }
            });

            const parsedBody = JSON.parse(res.data.body);
            const reservationId = parsedBody.reservationId;

            toast.success("Booking request successfully added to queue.");
            setIsOpen(false);
            saveReservationDetails(reservationId, userId, roomId)
        } catch (error) {
            console.error('Error adding booking request to queue', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">Create Reservation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Reservation</DialogTitle>
                    <DialogDescription>
                        Fill all the required details to create a new reservation
                    </DialogDescription>
                </DialogHeader>
                <hr/>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDate" className="text-right">Start Date</Label>
                        <Input id="startDate" type="date" {...register('startDate')} className="col-span-3" />
                        {errors.startDate && <span className="text-red-500 text-xs">{errors.startDate.message}</span>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDate" className="text-right">End Date</Label>
                        <Input id="endDate" type="date" {...register('endDate')} className="col-span-3" />
                        {errors.endDate && <span className="text-red-500 text-xs">{errors.endDate.message}</span>}
                    </div>
                    <DialogFooter>
                        <Button disabled={loading} type="submit">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateReservationModal