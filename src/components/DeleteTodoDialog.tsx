'use client';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { errorToast, successToast } from '@/lib/toast-helper';
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
      successToast('Task removed');
      dispatch(closeDeleteDialog());

      if (fetchQuery) {
        dispatch(fetchTodos(fetchQuery));
      } else {
        dispatch(fetchTodos({ page: 1 }));
      }
    } catch (err: any) {
      errorToast(err?.response?.data?.message || 'Failed to delete task');
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
            <span className='text-primary-100 font-semibold'>
              {todoToDelete?.title}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex justify-end gap-2'>
          <Button
            onClick={() => dispatch(closeDeleteDialog())}
            className='bg-neutral-400 px-2 hover:bg-neutral-300'
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} className='px-2'>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTodoDialog;
