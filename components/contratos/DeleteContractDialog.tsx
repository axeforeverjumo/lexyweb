'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Contract {
  id: string;
  titulo: string;
}

interface DeleteContractDialogProps {
  contract: Contract;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteContractDialog({
  contract,
  onConfirm,
  onCancel,
}: DeleteContractDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle>Eliminar contrato</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            ¿Estás seguro de que quieres eliminar este contrato?
            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-900">{contract.titulo}</p>
            </div>
            <p className="mt-3 text-red-600 font-medium">
              Esta acción no se puede deshacer.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-[0_0_0_3px_rgba(220,38,38,0.1)] transition-all duration-300"
          >
            Eliminar contrato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
