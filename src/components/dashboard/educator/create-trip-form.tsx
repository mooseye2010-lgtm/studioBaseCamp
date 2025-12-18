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
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <Link
          href="/educator/dashboard"
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <Icons.ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-5xl font-bold tracking-tighter font-headline mt-2">
          Design an Expedition
        </h1>
        <p className="text-xl text-muted-foreground">
          Craft a new packing list for your students.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Expedition Name</FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg h-12"
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
                    <FormLabel className="text-lg">Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[280px] justify-start text-left font-normal text-lg h-12',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <Icons.Calendar className="mr-2 h-5 w-5" />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
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
                 <Card>
                    <CardHeader>
                    <CardTitle className="text-xl">Assign Students</CardTitle>
                    <CardDescription>
                        Select the students for this trip.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <FormField
                        control={form.control}
                        name="assignedStudentIds"
                        render={() => (
                        <FormItem>
                            <div className="space-y-3">
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
                                        <FormLabel className="font-normal text-base">
                                        {student.name} <span className="text-muted-foreground">({student.email})</span>
                                        </FormLabel>
                                    </FormItem>
                                    );
                                }}
                                />
                            ))}
                            </div>
                            <FormMessage className="pt-2">{form.formState.errors.assignedStudentIds?.message}</FormMessage>
                        </FormItem>
                        )}
                    />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <div>
                     <h2 className="text-lg font-medium mb-2">Packing List Items</h2>
                     <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div
                            key={field.id}
                            className="flex items-center gap-2 p-3 border rounded-lg bg-card/50"
                            >
                            <FormField
                                control={form.control}
                                name={`items.${index}.name`}
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                    <Input placeholder="e.g., Water Bottle" {...field} className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-base" />
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
                                    <FormLabel className="text-sm text-muted-foreground">Required</FormLabel>
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
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                                className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                            >
                                <Icons.Trash className="h-4 w-4" />
                                <span className="sr-only">Remove item</span>
                            </Button>
                            </div>
                        ))}
                     </div>
                     <FormMessage className="pt-2">{form.formState.errors.items?.message}</FormMessage>
                </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', required: true })}
                className="w-full h-12 text-base"
              >
                <Icons.PlusCircle className="mr-2 h-5 w-5" />
                Add Item
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-12">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => router.push('/educator/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="font-bold text-lg">
              Create Expedition
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
