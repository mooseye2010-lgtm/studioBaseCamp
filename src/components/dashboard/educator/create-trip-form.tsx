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
          className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
        >
          <Icons.ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-7xl font-bold tracking-tighter font-headline mt-4 leading-tight">
          Craft a New Adventure
        </h1>
        <p className="text-2xl text-muted-foreground tracking-tight">
          Build a packing list for your next expedition.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-bold tracking-tight">Expedition Name</FormLabel>
                    <FormControl>
                      <Input
                        className="text-2xl h-16"
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
                    <FormLabel className="text-2xl font-bold tracking-tight">Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full sm:w-[320px] justify-start text-left font-normal text-xl h-16',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <Icons.Calendar className="mr-3 h-6 w-6" />
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
                 <Card className="bg-card/30 backdrop-blur-sm border-border/20 rounded-2xl">
                    <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Assign Students</CardTitle>
                    <CardDescription className="text-base">
                        Select the students who will be joining this adventure.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <FormField
                        control={form.control}
                        name="assignedStudentIds"
                        render={() => (
                        <FormItem>
                            <div className="space-y-4">
                            {students.map((student) => (
                                <FormField
                                key={student.id}
                                control={form.control}
                                name="assignedStudentIds"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={student.id}
                                        className="flex flex-row items-center space-x-4 space-y-0 p-4 rounded-xl transition-colors hover:bg-secondary/50"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            className="h-7 w-7"
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
                                        <FormLabel className="font-medium text-lg leading-snug flex-1">
                                        {student.name} <span className="block text-sm text-muted-foreground">{student.email}</span>
                                        </FormLabel>
                                    </FormItem>
                                    );
                                }}
                                />
                            ))}
                            </div>
                            <FormMessage className="pt-4 font-medium text-base">{form.formState.errors.assignedStudentIds?.message}</FormMessage>
                        </FormItem>
                        )}
                    />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <div>
                     <h2 className="text-2xl font-bold tracking-tight mb-4">Packing List Items</h2>
                     <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div
                            key={field.id}
                            className="flex items-center gap-3 p-3 border rounded-xl bg-card/50"
                            >
                            <FormField
                                control={form.control}
                                name={`items.${index}.name`}
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                    <Input placeholder="e.g., Water Bottle" {...field} className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-lg h-auto p-1" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`items.${index}.required`}
                                render={({ field }) => (
                                <FormItem className="flex items-center gap-2.5">
                                    <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    </FormControl>
                                    <FormLabel className="text-sm text-muted-foreground font-medium">Required</FormLabel>
                                </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                                className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive rounded-full"
                            >
                                <Icons.Trash className="h-5 w-5" />
                                <span className="sr-only">Remove item</span>
                            </Button>
                            </div>
                        ))}
                     </div>
                     <FormMessage className="pt-2 font-medium text-base">{form.formState.errors.items?.message}</FormMessage>
                </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', required: true })}
                className="w-full h-14 text-lg font-bold"
              >
                <Icons.PlusCircle className="mr-2 h-6 w-6" />
                Add Item
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-16">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => router.push('/educator/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="font-bold text-xl h-14 rounded-full">
              Create Expedition
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
