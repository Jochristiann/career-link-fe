import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import toast from "react-hot-toast";
import { getErrorMessage } from "~/lib/error";
import {useEffect, useState} from "react";
import type { User} from "~/types/api";
import {
    type CreateStudentEnrollmentInput,
    createStudentEnrollmentInputSchema, createStudentEnrollment
} from "~/features/enrollments/api/add-student-enrollment";
import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {cn} from "cn";
import {Check, ChevronsUpDown, GraduationCap, Loader2, X} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "cmdk";
import {getUnenrolledUsers} from "~/features/enrollments/api/get-unenrolled-students";

interface Props {
    bootcamp_id:string;
    onSuccess: () => Promise<void>;
}

export const CreateEnrollment = ({
    bootcamp_id,
  onSuccess,
}: Props) => {
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const [users, setUsers] = useState<User[]>([])

  const form = useForm<CreateStudentEnrollmentInput>({
    resolver: zodResolver(createStudentEnrollmentInputSchema),
    defaultValues: {
      user_id: [],
      bootcamp_id: bootcamp_id
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUnenrolledUsers(bootcamp_id);
      setUsers(res.data)
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoadingUsers(false);
    }
  }

  const onSubmit = async (data: CreateStudentEnrollmentInput) => {
    const toastId = toast.loading("Enrolling students...");
    try {
      const res = await createStudentEnrollment({ data });
      toast.success(res.message, { id: toastId });
      form.reset();
      await onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col justify-center">
        <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => {
              const [open, setOpen] = useState(false);
              const selectedIds: string[] = field.value ?? [];
              const selectedUsers = users.filter((u) => selectedIds.includes(u.id));

              const toggleUser = (id: string) => {
                if (selectedIds.includes(id)) {
                  field.onChange(selectedIds.filter((sid) => sid !== id));
                } else {
                  field.onChange([...selectedIds, id]);
                }
              };

              const removeUser = (id: string) => {
                field.onChange(selectedIds.filter((sid) => sid !== id));
              };

              return (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Select Student(s)
                    </FormLabel>
                    <div
                        className={cn(
                            "w-full min-h-10 h-auto rounded-md border border-input bg-background flex gap-2 px-2 py-1.5"
                        )}
                    >
                      <div className="flex flex-1 flex-wrap items-center gap-1.5">
                        {isLoadingUsers ? (
                            <span className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      Loading Users...
                    </span>
                        ) : selectedUsers.length === 0 ? (
                            <span className="flex items-center gap-2 text-muted-foreground text-sm">
                      <GraduationCap className="h-4 w-4 shrink-0" />
                      No users selected
                    </span>
                        ) : (
                            selectedUsers.map((u) => (
                                <span
                                    key={u.id}
                                    className="flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-foreground"
                                >
                          {u.name}
                                  <X
                                      className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
                                      onClick={() => removeUser(u.id)}
                                  />
                        </span>
                            ))
                        )}
                      </div>

                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                role="combobox"
                                aria-expanded={open}
                                disabled={isLoadingUsers}
                                className="h-8 w-8 shrink-0 rounded-md"
                            >
                              <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-[280px] p-2 rounded-md bg-white shadow-xs border-gray-200 border-2"
                            align="end"
                        >
                          <Command className="w-full flex flex-col gap-2">
                            <CommandInput placeholder="Search user..." className="h-9 px-5 rounded-md" />
                            <CommandList className="w-full max-h-64 overflow-scroll">
                              <CommandEmpty>No users found</CommandEmpty>
                              <CommandGroup className="flex flex-col gap-2">
                                {users.map((u) => {
                                  const isSelected = selectedIds.includes(u.id);
                                  return (
                                      <CommandItem
                                          key={u.id}
                                          value={u.name}
                                          onSelect={() => toggleUser(u.id)}
                                          className="cursor-pointer flex flex-row gap-1 items-center border-b-1 border-t-1 py-2"
                                      >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {u.nim} - {u.name}
                                      </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <FormMessage />
                  </FormItem>
              );
            }}
        />
        <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className={`bg-accent ${
                form.formState.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {form.formState.isSubmitting ? "Enrolling..." : "Enroll Student"}
        </Button>
      </form>
    </Form>
  );
};
