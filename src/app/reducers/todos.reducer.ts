import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, Action, on } from '@ngrx/store';
import * as actions from '../actions/todo-item.actions';

export interface TodoEntity {
  id: string;
  name: string;
  project?: string;
  dueDate?: string;
  completed: boolean;
}

export interface TodosState extends EntityState<TodoEntity> {

}

export const adapter = createEntityAdapter<TodoEntity>();

const initialState = adapter.getInitialState();



const reducerFunction = createReducer(
  initialState,
  on(actions.todoItemAdded, (state, action) => adapter.addOne(action.payload, state)),
  on(actions.markTodoItemCompleted, actions.markTodoItemIncomplete, (state, action) => adapter.updateOne(
    {
      id: action.payload.id,
      changes: {
        completed: !action.payload.completed
      }
    }, state)),
  on(actions.clearCompletedTodoItems, (state) => {

    const ids = state.ids as string[];
    const completedIds = ids
      .map(id => state.entities[id]) // [{id: '1'...}] (an array of all the entities)
      .filter(t => t.completed) // Just the entities that are completed.
      .map(t => t.id); // and just the ids so like ['T1', 'T2','T15']
    return adapter.removeMany(completedIds, state);
  })
);

export function reducer(state: TodosState = initialState, action: Action): TodosState {
  return reducerFunction(state, action);
}
