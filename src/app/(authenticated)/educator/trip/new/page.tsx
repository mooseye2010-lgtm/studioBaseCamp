import { CreateTripForm } from "@/components/dashboard/educator/create-trip-form";
import { users } from "@/lib/data";

export default function CreateTripPage() {
    const students = users.filter(u => u.role === 'student');
    return <CreateTripForm students={students} />;
}
