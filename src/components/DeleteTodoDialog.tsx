'use client';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { deleteTodo } from '@/services/service';
import { AppDispatch, RootState } from '@/store';
import { closeDeleteDialog } from '@/store/todo-slice';
import { fetchTodos } from '@/store/todo-thunks';

interface DeleteTodoDialogProps {
  fetchQuery?: Parameters<typeof fetchTodos>[0];
}

const DeleteTodoDialog = ({ fetchQuery }: DeleteTodoDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDeleteOpen, todoToDelete } = useSelector(
    (state: RootState) => state.todos
  );

  const handleDelete = async () => {
    if (!todoToDelete) return;
    try {
      await deleteTodo(todoToDelete.id);
      toast.success('Task deleted successfully');
      dispatch(closeDeleteDialog());

      if (fetchQuery) {
        dispatch(fetchTodos(fetchQuery));
      } else {
        dispatch(fetchTodos({ page: 1 }));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <Dialog
      open={isDeleteOpen}
      onOpenChange={() => dispatch(closeDeleteDialog())}
    >
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className='font-semibold'>{todoToDelete?.title}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex justify-end gap-2'>
          <Button onClick={() => dispatch(closeDeleteDialog())}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTodoDialog;
