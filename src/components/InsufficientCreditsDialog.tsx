
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface InsufficientCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditBalance: number;
  requiredCredits: number;
}

const InsufficientCreditsDialog: React.FC<InsufficientCreditsDialogProps> = ({
  open,
  onOpenChange,
  creditBalance,
  requiredCredits
}) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insufficient credits</DialogTitle>
          <DialogDescription>
            You don't have enough credits to generate an article.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 bg-brand/5 rounded-md flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Current balance</p>
              <p className="text-xl font-bold">{creditBalance} credits</p>
            </div>
            <div>
              <p className="text-sm font-medium">Required</p>
              <p className="text-xl font-bold">{requiredCredits} credits</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => {
              onOpenChange(false);
              navigate('/credits');
            }}
            className="bg-brand hover:bg-brand-dark"
          >
            Add credits
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsufficientCreditsDialog;
