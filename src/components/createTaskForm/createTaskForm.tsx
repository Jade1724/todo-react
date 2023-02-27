import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
} from 'react';
import { useMutation } from 'react-query';

import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';
import { TaskTitleField } from './_taskTitleField';
import { TaskDescriptionField } from './_taskDescriptionField';
import { TaskDateField } from './_taskDateField';
import { TaskSelectField } from './_taskSelectField';
import { Status } from './enums/Status';
import { Priority } from './enums/Priority';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import { ICreateTask } from '../taskArea/interfaces/ICreateTask';

export const CreateTaskForm: FC = (): ReactElement => {
  // Declare component states
  const [title, setTitle] = useState<string | undefined>(
    undefined,
  );
  const [description, setDescription] = useState<
    string | undefined
  >(undefined);
  const [date, setDate] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<string>(Status.todo);
  const [priority, setPriority] = useState<string>(
    Priority.normal,
  );
  const [showSuccess, setShowSuccess] =
    useState<boolean>(false);

  // Create task mutation
  const createTaskMutation = useMutation(
    (data: ICreateTask) =>
      sendApiRequest(
        'http://localhost:3200/tasks',
        'POST',
        data,
      ),
  );

  // Manage side effects inside the application
  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      setShowSuccess(true);
    }

    const successTimeout = setTimeout(() => {
      setShowSuccess(false);
    }, 4000);

    return () => {
      clearTimeout(successTimeout);
    };
  }, [createTaskMutation.isSuccess]);

  function createTaskHandler() {
    if (!title || !date || !description) {
      return;
    }

    const task = {
      title,
      description,
      date: date.toString(),
      status,
      priority,
    };

    createTaskMutation.mutate(task);
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width="100%"
      px={4}
      my={6}
    >
      {showSuccess && (
        <Alert
          severity="success"
          sx={{ width: '100%', marginBottom: '16px' }}
        >
          <AlertTitle>Success</AlertTitle>
          The task has been created successfully
        </Alert>
      )}
      <Typography mb={2} component="h2" variant="h6">
        Create a Task
      </Typography>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <TaskTitleField
          onChange={(e) => setTitle(e.target.value)}
          disabled={createTaskMutation.isLoading}
        />
        <TaskDescriptionField
          onChange={(e) => setDescription(e.target.value)}
          disabled={createTaskMutation.isLoading}
        />
        <TaskDateField
          value={date}
          onChange={(date) => setDate(date)}
          disabled={createTaskMutation.isLoading}
        />
        <Stack
          sx={{ width: '100%' }}
          direction="row"
          spacing={2}
        >
          <TaskSelectField
            label="Status"
            name="status"
            onChange={(e) =>
              setStatus(e.target.value as string)
            }
            disabled={createTaskMutation.isLoading}
            items={[
              {
                value: Status.todo,
                label: Status.todo.toUpperCase(),
              },
              {
                value: Status.inProgress,
                label: Status.inProgress.toUpperCase(),
              },
            ]}
          />
          <TaskSelectField
            label="Priority"
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={createTaskMutation.isLoading}
            items={[
              {
                value: Priority.low,
                label: Priority.low,
              },
              {
                value: Priority.normal,
                label: Priority.normal,
              },
              {
                value: Priority.high,
                label: Priority.high,
              },
            ]}
          />
        </Stack>
        {createTaskMutation.isLoading && <LinearProgress />}
        <Button
          disabled={
            !title ||
            !description ||
            !date ||
            !status ||
            !priority
          }
          onClick={createTaskHandler}
          variant="contained"
          size="large"
          fullWidth
        >
          Create a Task
        </Button>
      </Stack>
    </Box>
  );
};
