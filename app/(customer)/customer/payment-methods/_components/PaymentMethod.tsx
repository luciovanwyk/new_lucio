"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
 // Replace with your UI library

// Credit card icons
import { CreditCard, Trash } from 'lucide-react';
import { addPaymentMethod, getUserPaymentMethods, PaymentMethodFormData } from '../_actions/AddPayment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type SavedPaymentMethod = {
  id: string;
  cardholderName: string;
  lastFourDigits: string;
  cardType: string | null;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
};

export default function PaymentMethodsManager() {
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form setup with Zod validation
  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(z.object({
      cardholderName: z.string().min(1, "Cardholder name is required"),
      cardNumber: z.string().min(13).max(19),
      expiryMonth: z.string(),
      expiryYear: z.string(),
      cvv: z.string().min(3).max(4),
      isDefault: z.boolean().default(false)
    })),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false
    }
  });
  
  // Load saved payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      setIsLoading(true);
      try {
        const response = await getUserPaymentMethods();
        if (response.success && response.paymentMethods) {
          setSavedMethods(response.paymentMethods);
        }
      } catch (error) {
        console.error("Failed to load payment methods:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPaymentMethods();
  }, []);
  
  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });
  
  // Generate year options (current year + 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = (currentYear + i).toString();
    return { value: year, label: year };
  });
  
  // Handle form submission
  const onSubmit = async (data: PaymentMethodFormData) => {
    setIsLoading(true);
    try {
      const response = await addPaymentMethod(data);
      if (response.success && response.paymentMethod) {
        // Update the local state with the new payment method
        setSavedMethods(prev => {
          // If this is the new default, update other cards
          if (data.isDefault) {
            prev = prev.map(method => ({
              ...method,
              isDefault: false
            }));
          }
          
          return [...prev, response.paymentMethod!];
        });
        
        // Reset form and hide add form
        form.reset();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get card icon based on card type
  const getCardIcon = (cardType: string | null) => {
    switch (cardType) {
      case 'VISA':
      case 'MASTERCARD':
      case 'AMEX':
      case 'DISCOVER':
        return <CreditCard className="h-5 w-5 mr-2" />;
      default:
        return <CreditCard className="h-5 w-5 mr-2" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Methods</h2>
      <p className="text-gray-500">
        Manage your saved payment methods for quicker checkout
      </p>
      
      {/* Saved Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          {savedMethods.length === 0 ? (
            <p className="text-gray-500">No payment methods saved yet.</p>
          ) : (
            <div className="space-y-4">
              {savedMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    {getCardIcon(method.cardType)}
                    <div>
                      <p className="font-medium">
                        {method.cardType || 'Card'} •••• {method.lastFourDigits}
                        {method.isDefault && (
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {method.cardholderName} • Expires {method.expiryMonth}/{method.expiryYear.slice(-2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add New Payment Method Button */}
      {!showAddForm && (
        <Button 
          onClick={() => setShowAddForm(true)}
          className="mt-4"
        >
          Add New Payment Method
        </Button>
      )}
      
      {/* Add New Payment Method Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Name as it appears on card" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          onChange={(e) => {
                            // Format the card number with spaces for readability
                            const value = e.target.value.replace(/\s/g, '');
                            const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Month</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {monthOptions.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year.value} value={year.value}>
                                {year.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="123"
                            maxLength={4}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Switch
                    id="default-payment"
                    checked={form.watch("isDefault")}
                    onCheckedChange={(checked) => {
                      form.setValue("isDefault", checked);
                    }}
                  />
                  <Label htmlFor="default-payment">Set as default payment method</Label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Payment Method"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}