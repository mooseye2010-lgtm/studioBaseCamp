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
      items: [{ name: '', required: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, you would send this data to your server
    toast({
      title: 'Trip Created!',
      description: `The trip "${values.name}" has been successfully created.`,
    });
    router.push('/educator/dashboard');
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <Link
          href="/educator/dashboard"
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <Icons.ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight font-headline mt-2">
          Create a New Trip
        </h1>
        <p className="text-muted-foreground">
          Fill out the details below to create a new packing list for your
          students.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>
                Basic information about the trip.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Name</FormLabel>
                    <FormControl>
                      <Input
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
                    <FormLabel>Trip Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Icons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Packing Items</CardTitle>
              <CardDescription>
                Add the items students need to pack.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-end gap-4 p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Water Bottle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Required?</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                  >
                    <Icons.Trash className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              ))}
                <FormMessage>{form.formState.errors.items?.message}</FormMessage>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', required: true })}
              >
                <Icons.PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assign Students</CardTitle>
              <CardDescription>
                Select the students who will be on this trip.
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
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
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
                                <FormLabel className="font-normal">
                                  {student.name} ({student.email})
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                     <FormMessage>{form.formState.errors.assignedStudentIds?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/educator/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90">
              Create Trip
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
