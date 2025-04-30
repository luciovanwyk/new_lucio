// BestSellerUploadModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BestSellerUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  isEditing: boolean;
  onSave: (updatedProduct: any) => void;
}

export const BestSellerUploadModal: React.FC<BestSellerUploadModalProps> = ({
  isOpen,
  onClose,
  product,
  isEditing,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({});

  // Reset formData when product prop changes and ensure product is not null
  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, imageUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) { // Ensure formData has an id before saving
      onSave(formData);
    }
    onClose();
  };

  // Only render the dialog if isOpen is true and product is not null
  if (!isOpen || !product) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Product Name</Label>
            <Input
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label>Rating (1-5)</Label>
            <Input
              name="rating"
              type="number"
              value={formData.rating || ''}
              onChange={handleChange}
              required
              min="1"
              max="5"
            />
          </div>

          <div>
            <Label>Product Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};