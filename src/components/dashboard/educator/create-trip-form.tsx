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
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const requirementSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Requirement text cannot be empty.'),
});

const packingItemSchema = z.object({
  name: z.string().min(1, 'Item name is required.'),
  required: z.boolean(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  link: z.string().url().optional().or(z.literal('')),
  requirements: z.array(requirementSchema).optional(),
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
      items: [{ name: 'Water Bottle', required: true, description: '', imageUrl: '', link: '', requirements: [] }, { name: 'Hiking Boots', required: true, description: '', imageUrl: '', link: '', requirements: [] }, { name: 'Sunscreen', required: false, description: '', imageUrl: '', link: '', requirements: [] }],
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
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group uppercase font-body tracking-wider"
            >
            <Icons.ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
            </Link>
        </Button>
        <h1 className="text-5xl tracking-widest font-headline font-light">
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
                    <FormLabel className="text-base font-medium uppercase font-body tracking-wider">Trip Name</FormLabel>
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
                    <FormLabel className="text-base font-medium uppercase font-body tracking-wider">Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full sm:w-[280px] justify-start text-left font-normal text-base h-16 rounded-2xl uppercase font-body tracking-wider',
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
                    <CardTitle className="text-xl font-medium uppercase font-body tracking-wider">Assign Students</CardTitle>
                    <CardDescription className="uppercase font-body tracking-wider">
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
                                        <FormLabel className="font-normal text-base flex-1 cursor-pointer uppercase font-body tracking-wider">
                                        {student.name} <span className="block text-sm text-muted-foreground normal-case font-light">{student.email}</span>
                                        </FormLabel>
                                    </FormItem>
                                    );
                                }}
                                />
                            ))}
                            </div>
                            <FormMessage className="pt-4 font-medium text-base text-center uppercase font-body tracking-wider">{form.formState.errors.assignedStudentIds?.message}</FormMessage>
                        </FormItem>
                        )}
                    />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <div>
                     <h2 className="text-base font-medium mb-4 uppercase font-body tracking-wider">Packing List Items</h2>
                     <div className="space-y-3">
                        {fields.map((field, index) => (
                          <PackingItemForm
                            key={field.id}
                            form={form}
                            index={index}
                            onRemove={() => remove(index)}
                            isRemoveDisabled={fields.length <= 1}
                          />
                        ))}
                     </div>
                     <FormMessage className="pt-2 font-medium uppercase font-body tracking-wider">{form.formState.errors.items?.message}</FormMessage>
                </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', required: true, description: '', imageUrl: '', link: '', requirements: [] })}
                className="w-full h-14 text-base font-medium rounded-full uppercase font-body tracking-wider"
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
              className="rounded-full uppercase font-body tracking-wider"
              onClick={() => router.push('/educator/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="text-lg rounded-full uppercase font-body tracking-wider">
              Create Trip
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function PackingItemForm({ form, index, onRemove, isRemoveDisabled }: { form: any, index: number, onRemove: () => void, isRemoveDisabled: boolean }) {
  const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({
    control: form.control,
    name: `items.${index}.requirements`,
  });
  
  return (
    <Card className="border rounded-2xl bg-card overflow-hidden">
      <div className="flex items-center gap-3 p-2">
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
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-xs text-muted-foreground font-normal uppercase font-body tracking-wider">Required</FormLabel>
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isRemoveDisabled}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full"
        >
          <Icons.Trash className="h-4 w-4" />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="details" className="border-t">
          <AccordionTrigger className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider font-body">
            Add Details & Requirements
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0 space-y-4">
            <FormField
              control={form.control}
              name={`items.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-light">Description</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Add a short description..." className="text-sm" /></FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`items.${index}.imageUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-light">Image URL</FormLabel>
                  <FormControl><Input {...field} placeholder="https://example.com/image.png" className="text-sm h-10" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`items.${index}.link`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-light">Reference Link</FormLabel>
                  <FormControl><Input {...field} placeholder="https://example.com/product" className="text-sm h-10" /></FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel className="text-xs uppercase tracking-wider font-light mb-2 block">Sub-Requirements</FormLabel>
              <div className="space-y-2">
                {reqFields.map((reqField, reqIndex) => (
                  <div key={reqField.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.requirements.${reqIndex}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                           <FormControl>
                             <Input {...field} placeholder="e.g., Must be waterproof" className="text-sm h-10 bg-secondary" />
                           </FormControl>
                           <FormMessage/>
                        </FormItem>
                      )}
                    />
                     <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive rounded-full h-8 w-8" onClick={() => removeReq(reqIndex)}>
                        <Icons.Trash size={14} />
                      </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2 h-8 rounded-full" onClick={() => appendReq({ id: `req-${Date.now()}`, text: '' })}>
                <Icons.PlusCircle size={14} className="mr-2" />
                Add Requirement
              </Button>
            </div>

          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
