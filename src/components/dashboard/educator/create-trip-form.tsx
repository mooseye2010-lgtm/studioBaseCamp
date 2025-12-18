'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const packingItemSchema = z.object({
  name: z.string().min(1, 'Item name is required.'),
  required: z.boolean(),
});

const formSchema = z.object({
  name: z.string().min(3, 'Trip name must be at least 3 characters.'),
  date: z.date({
    required_error: 'A trip date is required.',
  }),
  assignedStudentIds: z.array(z.string()).min(1, 'At least one student must be assigned.'),
  items: z.array(packingItemSchema).min(1, 'At least one packing item is required.'),
});

export function CreateTripForm({ students }: { students: User[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      assignedStudentIds: [],
      items: [{ name: 'Water Bottle', required: true }, { name: 'Hiking Boots', required: true }, { name: 'Sunscreen', required: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: '🚀 Trip Created!',
      description: `The trip "${values.name}" has been successfully created.`,
    });
    router.push('/educator/dashboard');
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-10">
        <Button asChild variant="ghost" className="mb-4 rounded-full">
            <Link
            href="/educator/dashboard"
            className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
            >
            <Icons.ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
            </Link>
        </Button>
        <h1 className="text-5xl font-bold tracking-tight font-headline">
          Create New Trip
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Trip Name</FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg h-16 rounded-2xl"
                        placeholder="e.g., Yosemite Geology Tour"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-lg font-medium">Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full sm:w-[280px] justify-start text-left font-normal text-lg h-16 rounded-2xl',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <Icons.Calendar className="mr-3 h-5 w-5" />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-3xl">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <Card className="bg-card rounded-3xl">
                    <CardHeader>
                    <CardTitle className="text-xl font-medium">Assign Students</CardTitle>
                    <CardDescription>
                        Select students for this trip.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <FormField
                        control={form.control}
                        name="assignedStudentIds"
                        render={() => (
                        <FormItem>
                            <div className="space-y-2">
                            {students.map((student) => (
                                <FormField
                                key={student.id}
                                control={form.control}
                                name="assignedStudentIds"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={student.id}
                                        className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-2xl transition-colors hover:bg-secondary"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            className="h-6 w-6 rounded-md"
                                            checked={field.value?.includes(student.id)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    student.id,
                                                ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                    (value) => value !== student.id
                                                    )
                                                );
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal text-base flex-1 cursor-pointer">
                                        {student.name} <span className="block text-sm text-muted-foreground">{student.email}</span>
                                        </FormLabel>
                                    </FormItem>
                                    );
                                }}
                                />
                            ))}
                            </div>
                            <FormMessage className="pt-4 font-medium text-base text-center">{form.formState.errors.assignedStudentIds?.message}</FormMessage>
                        </FormItem>
                        )}
                    />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <div>
                     <h2 className="text-lg font-medium mb-4">Packing List Items</h2>
                     <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div
                            key={field.id}
                            className="flex items-center gap-3 p-2 border rounded-2xl bg-card"
                            >
                            <FormField
                                control={form.control}
                                name={`items.${index}.name`}
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                    <Input placeholder="e.g., Water Bottle" {...field} className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-auto p-1 rounded-md" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`items.${index}.required`}
                                render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    </FormControl>
                                    <FormLabel className="text-xs text-muted-foreground font-normal">Required</FormLabel>
                                </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full"
                            >
                                <Icons.Trash className="h-4 w-4" />
                                <span className="sr-only">Remove item</span>
                            </Button>
                            </div>
                        ))}
                     </div>
                     <FormMessage className="pt-2 font-medium">{form.formState.errors.items?.message}</FormMessage>
                </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', required: true })}
                className="w-full h-14 text-base font-medium rounded-full"
              >
                <Icons.PlusCircle className="mr-2 h-5 w-5" />
                Add Item
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-16">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="rounded-full"
              onClick={() => router.push('/educator/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="font-bold text-lg rounded-full">
              Create Trip
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
