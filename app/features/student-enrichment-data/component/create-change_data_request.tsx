import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "~/components/ui/form"
import Field from "~/components/ui/form-field"
import { Button } from "~/components/ui/button"
import toast from "react-hot-toast"
import { getErrorMessage } from "~/lib/error"
import {
    createChangeDataRequest,
    type CreateChangeDataRequestInput, createChangeDataRequestInputSchema
} from "~/features/student-enrichment-data/api/create-change-data-request";
import {useAuth} from "~/lib/auth";

interface Props {
    onSuccess: () => void
}

const CreateChangeDataRequest = ({onSuccess}:Props) => {
    const {user} = useAuth()

    const form = useForm<CreateChangeDataRequestInput>({
        resolver: zodResolver(createChangeDataRequestInputSchema),
        defaultValues: {
            new_position: '',
            new_company: '',
            user_id: user?.id,
            application_type: 'create',
            enrichment_batch: "0"

        }
    })

    const onSubmit = async (data:CreateChangeDataRequestInput) => {
        const toastId = toast.loading("Requesting new data...")

        try {
            const res = await createChangeDataRequest({data})
            toast.success(res.message, {id: toastId})
            onSuccess()
        } catch (error) {
            toast.error(getErrorMessage(error), {id: toastId})
        }
    }

    return (<>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4 flex flex-col justify-center"}>
                <Field control={form.control} label="New Company" name="new_company" placeholder="Your new company name" />
                <Field control={form.control} label="New Position" name="new_position" placeholder="Your new job position" />
                <Field control={form.control} type="number" label="Enrichment Semester Period" name="enrichment_batch" placeholder="Enrichment semester period" />
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                >Request Change</Button>
            </form>
        </Form>
    </>)
}

export default CreateChangeDataRequest